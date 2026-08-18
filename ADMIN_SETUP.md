# Trang quản trị — hướng dẫn kích hoạt

Trang quản trị dùng chung project với app học viên, truy cập qua đường dẫn `/admin` (ví dụ `https://hocnhac-app.pages.dev/admin`).

## Bước 1 — Chạy thêm 1 file SQL

Vào Supabase → SQL Editor → chạy nội dung file `supabase/admin_setup.sql` (file này bổ sung: tự động tạo hồ sơ khi có người đăng ký, và cấp quyền ghi cho admin trên các bảng nội dung).

## Bước 2 — Tự đăng ký 1 tài khoản rồi phong làm admin

1. Vào app học viên (đường dẫn gốc, không phải `/admin`) → bấm "Đăng nhập" → chuyển "Đăng ký" → tạo tài khoản bằng **email thật của bạn**.
2. Vào Supabase → Table Editor → bảng `profiles` → tìm đúng dòng có email bạn vừa đăng ký → sửa cột `role` từ `student` thành `admin` → Save.

   Hoặc chạy trong SQL Editor (thay email cho đúng):
   ```sql
   update profiles set role = 'admin' where email = 'ban@vidu.com';
   ```

## Bước 3 — Đăng nhập trang quản trị

Vào `/admin` (ví dụ `http://localhost:5173/admin` khi chạy local, hoặc `https://tên-project.pages.dev/admin` sau khi deploy), đăng nhập bằng đúng email/mật khẩu tài khoản vừa phong admin.

## Copy các file mới vào project bạn đang có

```
src/AdminApp.jsx                     (file MỚI)
src/main.jsx                         (ghi đè — thêm phân luồng /admin)
src/admin/                           (thư mục MỚI, toàn bộ)
public/_redirects                    (file MỚI — bắt buộc để /admin không bị lỗi 404 trên Cloudflare)
supabase/admin_setup.sql             (file MỚI — nhớ chạy trong Supabase)
```

## Lưu ý quan trọng

- Về nội dung Media/Audio khi soạn bài trong trang quản trị: cần nhập đúng cấu trúc JSON (xem ví dụ đặt sẵn trong ô nhập, hoặc xem `supabase/schema.sql` phần comment giải thích cấu trúc `media`/`audio`). Đây là đánh đổi hợp lý cho bản đầu tiên; nếu về sau thấy bất tiện, có thể nâng cấp thành các ô chọn dạng dropdown thay vì gõ JSON tay.
- Trang quản trị hiện chưa có giao diện dành riêng cho di động — nên dùng trên máy tính.
- File `public/_redirects` **bắt buộc phải có** trên Cloudflare, nếu thiếu thì vào thẳng `/admin` sẽ bị lỗi 404 (vì đây là ứng dụng 1 trang — SPA — Cloudflare cần được chỉ dẫn luôn trả về `index.html` cho mọi đường dẫn).
