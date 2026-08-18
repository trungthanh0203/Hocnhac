-- ============================================================
-- SUA LOI: khong xoa duoc user vi bi rang buoc voi activation_codes.used_by
-- Chạy file này 1 lần trong Supabase SQL Editor
-- ============================================================

-- Nới lỏng ràng buộc: khi xóa 1 tài khoản, cột used_by của mã kích hoạt mà
-- họ đã dùng sẽ tự chuyển về NULL (mã vẫn còn đó, chỉ là "chưa gắn với ai"),
-- thay vì chặn đứng việc xóa tài khoản như trước.
alter table activation_codes drop constraint if exists activation_codes_used_by_fkey;
alter table activation_codes add constraint activation_codes_used_by_fkey
  foreign key (used_by) references auth.users(id) on delete set null;
