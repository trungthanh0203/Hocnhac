# Cập nhật mới — port 4/6 việc còn lại

## Đã làm xong trong bản này

1. **Đăng nhập / nhập mã kích hoạt** — `src/hooks/useAuth.js` + `src/components/AuthPanel.jsx`. Bấm nút "Đăng nhập" ở góc banner để mở form. Sau khi đăng nhập, nhập mã kích hoạt (dùng thử mã trong `supabase/test_activation_codes.sql`) sẽ gọi hàm `redeem_code` và tự động cập nhật quyền truy cập.
2. **4 tab còn lại đã port đầy đủ, chạy thật với Supabase**:
   - `src/components/ReviewTab.jsx` (Ôn tập) — lấy `concepts` + `questions` theo cấp, gộp và xáo trộn ngẫu nhiên.
   - `src/components/EarTrainingTab.jsx` (Luyện âm) — đủ 5 dạng bài kể cả Vỗ tay tiết tấu.
   - `src/components/TestTab.jsx` (Bài test) — lấy ngẫu nhiên 6 câu từ bảng `questions`, chấm điểm 1 lần, tô xanh/đỏ từng câu.
   - `src/components/PracticeTab.jsx` (Thực hành) — bản nhạc gốc, đọc từng nốt + nghe cả bài kèm hiệu ứng sáng nốt.
3. **Lộ trình của tôi** — `src/components/RoadmapPanel.jsx` — đọc bảng `levels` thật, đánh dấu "Đang học" / "Đã mở" / "Khóa" dựa theo `student_access` của tài khoản đang đăng nhập.
4. **Bộ icon minh họa đầy đủ** — bổ sung vào `src/lib/staffSvg.js`: 12 icon Ôn tập, icon cao độ/trường độ/cường độ, icon 4 nhạc cụ.

## Cách áp dụng vào project bạn đang có (đã có sẵn repo)

Vì bạn đã có repo và đã deploy 1 lần, **không cần làm lại từ đầu** — chỉ cần copy các file/thư mục sau từ bản zip mới đè lên project cũ (giữ nguyên file `.env` và `.env.production` của bạn, đừng đụng vào 2 file đó):

```
src/App.jsx                          (ghi đè)
src/index.css                        (ghi đè)
src/lib/audio.js                     (ghi đè)
src/lib/staffSvg.js                  (ghi đè)
src/components/LessonTab.jsx         (ghi đè)
src/components/TabBar.jsx            (giữ nguyên, không đổi)
src/components/Banner.jsx            (không còn dùng trực tiếp trong App.jsx mới,
                                       có thể xóa hoặc giữ lại không ảnh hưởng gì)
src/components/ReviewTab.jsx         (file MỚI)
src/components/EarTrainingTab.jsx    (file MỚI)
src/components/TestTab.jsx           (file MỚI)
src/components/PracticeTab.jsx       (file MỚI)
src/components/RoadmapPanel.jsx      (file MỚI)
src/components/AuthPanel.jsx         (file MỚI)
src/hooks/useAuth.js                 (file MỚI, cần tạo thư mục hooks/)
```

Xóa file `src/components/StubTab.jsx` cũ (không còn dùng nữa).

Sau khi copy xong, chạy lại:
```
npm run dev
```
kiểm tra cả 5 tab hoạt động đúng ở local, rồi mới `git add . `, `git commit`, `git push` để Cloudflare tự build lại.

## Việc 5 — Trang quản trị riêng (kế hoạch, chưa code trong bản này)

Đây là 1 ứng dụng con riêng biệt (route `/admin` hoặc project React thứ 2), gồm:
- Đăng nhập admin (dùng lại Supabase Auth, kiểm tra `profiles.role = 'admin'`).
- CRUD bài học / lesson_points (form nhập liệu thay vì phải gõ SQL tay).
- CRUD câu hỏi.
- Quản lý mã kích hoạt: bảng danh sách + nút tạo mã mới (sinh chuỗi ngẫu nhiên, chọn cấp mở, chọn hạn dùng) + nút thu hồi.
- Danh sách học viên đã đăng ký.

**Đề xuất**: làm sau khi bạn đã dùng Table Editor một thời gian và cảm thấy thật sự bất tiện — vì đây là phần tốn công nhất trong 6 việc, nên ưu tiên sau khi app học viên đã ổn định.

## Việc 6 — Cloudflare Workers AI tạo ảnh minh họa (kế hoạch, chưa code trong bản này)

Hướng triển khai khi bạn sẵn sàng:
1. Tạo 1 Cloudflare Worker riêng (không phải Pages) gọi model tạo ảnh (ví dụ `@cf/stabilityai/stable-diffusion-xl-base-1.0` hoặc model mới hơn tại thời điểm bạn làm — cần kiểm tra danh sách model hiện có trong Cloudflare AI docs vì họ cập nhật thường xuyên).
2. Worker này nhận prompt (mô tả hình cần vẽ, ví dụ "khuông nhạc với khóa Sol, phong cách minh họa trẻ em, tông xanh navy và vàng"), trả về ảnh, lưu vào Supabase Storage.
3. Trong bảng `lesson_points`, thêm cột `image_url` — khi có ảnh AI, ưu tiên hiển thị ảnh này thay vì SVG vẽ tay.
4. Vì có phí (dù rẻ) và cần kiểm duyệt ảnh đầu ra phù hợp trẻ em, nên làm thủ công qua trang quản trị (Việc 5) — admin bấm "Tạo ảnh minh họa" cho từng bài, xem trước, duyệt rồi mới lưu — không nên tự động tạo hàng loạt không kiểm soát.

**Đề xuất**: làm sau Việc 5, vì cần có trang quản trị làm nơi bấm nút tạo ảnh và duyệt ảnh.
