-- ============================================================
-- NANG CAP: cho phép admin TRỰC TIẾP thêm/xóa quyền truy cập cấp học của học viên
-- (trước đây admin chỉ có quyền XEM student_access, chưa sửa được)
-- Cần đã chạy supabase/fix_admin_recursion.sql trước (để có hàm is_admin())
-- ============================================================

drop policy if exists "admin read all student_access" on student_access;
create policy "admin manage student_access" on student_access for all
  using (is_admin()) with check (is_admin());
