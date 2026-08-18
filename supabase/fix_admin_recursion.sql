-- ============================================================
-- SUA LOI: "infinite recursion detected in policy for relation profiles"
-- Chạy file này SAU admin_setup.sql (chạy 1 lần)
-- ============================================================

-- 1) Hàm kiểm tra quyền admin — SECURITY DEFINER giúp hàm này đọc bảng profiles
--    mà KHÔNG bị chính RLS của profiles chặn lại, nên không còn bị đệ quy vô hạn nữa.
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- 2) Xóa chính sách bị lỗi trên bảng profiles, tạo lại dùng hàm is_admin()
drop policy if exists "admin read all profiles" on profiles;
create policy "admin read all profiles" on profiles for select
  using (is_admin());

-- 3) Cập nhật lại các chính sách admin khác (trên các bảng khác) để dùng chung
--    hàm is_admin() cho gọn và nhất quán — không bắt buộc để sửa lỗi trên,
--    nhưng nên làm để tránh gặp lại vấn đề tương tự sau này.
drop policy if exists "admin manage activation_codes" on activation_codes;
create policy "admin manage activation_codes" on activation_codes for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin manage levels" on levels;
create policy "admin manage levels" on levels for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin manage modules" on modules;
create policy "admin manage modules" on modules for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin manage lessons" on lessons;
create policy "admin manage lessons" on lessons for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin manage lesson_points" on lesson_points;
create policy "admin manage lesson_points" on lesson_points for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin manage concepts" on concepts;
create policy "admin manage concepts" on concepts for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin manage questions" on questions;
create policy "admin manage questions" on questions for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin read all student_access" on student_access;
create policy "admin read all student_access" on student_access for select
  using (is_admin());
