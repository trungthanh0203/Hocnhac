-- ============================================================
-- NANG CAP: mã kích hoạt có thể mở NHIỀU cấp cùng lúc (thay vì chỉ 1 hoặc tất cả)
-- Chạy file này 1 lần trong Supabase SQL Editor (database bạn đang chạy đã có
-- dữ liệu, nên dùng file migrate riêng này thay vì chạy lại schema.sql từ đầu)
-- ============================================================

-- 1) Thêm cột mới dạng danh sách (mảng số nguyên)
alter table activation_codes add column if not exists unlock_level_ids int[];

-- 2) Chuyển dữ liệu cũ sang cột mới (mã cũ mở 1 cấp -> mảng 1 phần tử;
--    mã cũ mở "tất cả" tức unlock_level_id = null -> giữ null, nghĩa là vẫn mở tất cả)
update activation_codes
set unlock_level_ids = case when unlock_level_id is null then null else array[unlock_level_id] end
where unlock_level_ids is null;

-- 3) Xóa cột cũ (không dùng nữa)
alter table activation_codes drop column if exists unlock_level_id;

-- 4) Cập nhật lại hàm redeem_code để mở ĐỦ các cấp trong danh sách khi học viên nhập mã
create or replace function redeem_code(code_input text)
returns jsonb
language plpgsql
security definer
as $$
declare
  rec activation_codes%rowtype;
  lvl int;
begin
  select * into rec from activation_codes where code = code_input;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Mã không tồn tại');
  end if;

  if rec.expires_at is not null and rec.expires_at < now() then
    return jsonb_build_object('success', false, 'message', 'Mã đã hết hạn');
  end if;

  if rec.used_by is not null then
    return jsonb_build_object('success', false, 'message', 'Mã đã được sử dụng trước đó');
  end if;

  update activation_codes set used_by = auth.uid(), used_at = now() where id = rec.id;

  if rec.unlock_level_ids is null then
    -- null = mở tất cả 9 cấp (giữ đúng quy ước cũ)
    insert into student_access(user_id, level_id) values (auth.uid(), null);
  else
    foreach lvl in array rec.unlock_level_ids loop
      insert into student_access(user_id, level_id) values (auth.uid(), lvl);
    end loop;
  end if;

  return jsonb_build_object('success', true, 'level_ids', rec.unlock_level_ids);
end;
$$;
