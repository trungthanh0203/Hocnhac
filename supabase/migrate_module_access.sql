-- ============================================================
-- NANG CAP: ho tro ban theo MODULE (ben canh ban theo CAP da co)
-- Chạy 1 lần trong Supabase SQL Editor, sau khi đã có fix_admin_recursion.sql
-- ============================================================

-- 1) activation_codes: thêm loại mã + danh sách module (khi loại = 'module')
alter table activation_codes add column if not exists code_type text not null default 'level' check (code_type in ('level', 'module'));
alter table activation_codes add column if not exists unlock_module_names text[];

-- 2) student_access: thêm cột module_name — có giá trị = dòng này là quyền THEO MODULE
--    (xuyên suốt mọi cấp), null = hoạt động y hệt như trước (quyền theo cấp)
alter table student_access add column if not exists module_name text;

-- 3) Cập nhật lại hàm redeem_code để xử lý được cả 2 loại mã
create or replace function redeem_code(code_input text)
returns jsonb
language plpgsql
security definer
as $$
declare
  rec activation_codes%rowtype;
  lvl int;
  modname text;
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

  if rec.code_type = 'module' then
    foreach modname in array rec.unlock_module_names loop
      insert into student_access(user_id, level_id, module_name) values (auth.uid(), null, modname);
    end loop;
    return jsonb_build_object('success', true, 'type', 'module', 'modules', rec.unlock_module_names);
  else
    if rec.unlock_level_ids is null then
      insert into student_access(user_id, level_id) values (auth.uid(), null);
    else
      foreach lvl in array rec.unlock_level_ids loop
        insert into student_access(user_id, level_id) values (auth.uid(), lvl);
      end loop;
    end if;
    return jsonb_build_object('success', true, 'type', 'level', 'level_ids', rec.unlock_level_ids);
  end if;
end;
$$;
