-- ============================================================
-- BO SUNG CHO TRANG QUAN TRI
-- Chạy file này SAU khi đã chạy schema.sql + seed_so_cap_1.sql
-- ============================================================

-- 1) Thêm cột email vào profiles (để admin thấy được ai là ai mà không cần quyền hệ thống)
alter table profiles add column if not exists email text;

-- 2) Tự động tạo 1 dòng profiles mỗi khi có người đăng ký mới (mặc định role = 'student')
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 3) Cho phép ADMIN toàn quyền thêm/sửa/xóa nội dung học (trước đây chỉ có quyền đọc công khai)
create policy "admin manage levels" on levels for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "admin manage modules" on modules for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "admin manage lessons" on lessons for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "admin manage lesson_points" on lesson_points for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "admin manage concepts" on concepts for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "admin manage questions" on questions for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- 4) Cho phép admin xem TOÀN BỘ student_access (trước đây mỗi người chỉ xem được của chính mình)
create policy "admin manage student_access" on student_access for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ============================================================
-- SAU KHI CHẠY FILE NÀY: bạn cần tự đăng ký 1 tài khoản (qua app học viên,
-- nút Đăng nhập -> Đăng ký) rồi CHẠY LỆNH DƯỚI ĐÂY để phong tài khoản đó làm admin
-- (thay email cho đúng email bạn vừa đăng ký):
--
-- update profiles set role = 'admin' where email = 'ban@vidu.com';
-- ============================================================
