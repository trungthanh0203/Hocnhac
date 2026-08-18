# Học nhạc cùng Mr.Thành — khung project

Kiến trúc: **GitHub** (mã nguồn) → **Cloudflare Pages** (host web app) ↔ **Supabase** (auth + database + storage) → (giai đoạn sau) **Cloudflare Workers AI** (tạo ảnh minh họa).

Bản khung này đã nối dây THẬT với Supabase ở tab **Bài học** để bạn kiểm chứng toàn bộ luồng hoạt động. Các tab còn lại (Ôn tập, Luyện âm, Bài test, Thực hành) đang là khung tạm — logic UI/UX của chúng đã được duyệt kỹ trong bản demo HTML trước đó, việc còn lại là port theo đúng mẫu `LessonTab.jsx`.

## Bước 1 — Tạo Supabase project

1. Vào [supabase.com](https://supabase.com) → New Project.
2. Vào **SQL Editor** → chạy toàn bộ nội dung file `supabase/schema.sql` (tạo bảng + bảo mật RLS).
3. Chạy tiếp file `supabase/seed_so_cap_1.sql` (dữ liệu mẫu đầy đủ Sơ cấp 1 + khung 9 cấp).
4. Vào **Project Settings → API**, copy `Project URL` và `anon public key`.

## Bước 2 — Chạy thử ở máy bạn

```bash
cp .env.example .env
# mở .env, dán URL và anon key vừa copy vào
npm install
npm run dev
```

Mở trình duyệt theo địa chỉ hiện ra (thường là `http://localhost:5173`) — nếu tab **Bài học** hiện đúng 12 bài Sơ cấp 1 kèm hình minh họa và nút nghe âm thanh chạy được, nghĩa là kết nối Supabase đã thành công.

## Bước 3 — Đưa lên GitHub

```bash
git init
git add .
git commit -m "Khung project ban đầu"
git branch -M main
git remote add origin https://github.com/<tên-bạn>/hocnhac-app.git
git push -u origin main
```

(File `.env` đã được loại trừ qua `.gitignore` — không bao giờ đẩy khóa Supabase lên GitHub công khai.)

## Bước 4 — Deploy qua Cloudflare Pages

1. Vào Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Chọn repo `hocnhac-app` vừa đẩy lên.
3. Build command: `npm run build` — Output directory: `dist`.
4. Vào **Settings → Environment variables**, thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` (giống file `.env`).
5. Deploy — Cloudflare sẽ cấp cho bạn 1 địa chỉ `.pages.dev` chạy thật, có thể gắn tên miền riêng sau.

## Bước 5 — Cấp mã kích hoạt (tạm thời, chưa cần trang quản trị riêng)

Vào Supabase → **Table Editor → activation_codes** → thêm dòng mới: nhập `code`, chọn `unlock_level_id` (cấp muốn mở), đặt `expires_at` (hạn dùng). Học viên nhập mã này vào app (màn hình nhập mã sẽ gọi hàm `redeem_code` đã tạo sẵn trong `schema.sql`) — Table Editor đóng vai trò "trang quản trị tạm" cho tới khi bạn cần giao diện admin đẹp hơn.

## Việc cần làm tiếp (gợi ý thứ tự ưu tiên)

1. Màn hình đăng nhập / nhập mã kích hoạt (Supabase Auth + gọi RPC `redeem_code`).
2. Port 4 tab còn lại theo mẫu `LessonTab.jsx` (dùng `lib/audio.js` + `lib/staffSvg.js` đã có sẵn).
3. Port nốt `Lộ trình của tôi` (đọc bảng `levels` + `student_access` để biết cấp đang mở).
4. Bộ icon minh họa còn thiếu trong `lib/staffSvg.js` (pitch/duration/volume icon, instrument icon) — xem file demo cũ để lấy lại markup SVG.
5. Trang quản trị riêng (thêm/sửa bài học, câu hỏi, quản lý mã kích hoạt) khi Table Editor không còn đủ tiện.
6. Tích hợp Cloudflare Workers AI để tạo ảnh minh họa thay cho SVG vẽ tay.

## Cấu trúc thư mục

```
hocnhac-app/
├── supabase/
│   ├── schema.sql          # tạo bảng + RLS + hàm redeem_code
│   └── seed_so_cap_1.sql   # dữ liệu mẫu: khung 9 cấp + đầy đủ Sơ cấp 1
├── src/
│   ├── lib/
│   │   ├── audio.js        # engine âm thanh tổng hợp (Web Audio API)
│   │   └── staffSvg.js     # vẽ khuông nhạc / minh họa từ dữ liệu jsonb
│   ├── components/
│   │   ├── Banner.jsx
│   │   ├── TabBar.jsx
│   │   ├── LessonTab.jsx   # ĐÃ nối Supabase thật — dùng làm mẫu cho các tab khác
│   │   └── StubTab.jsx     # khung tạm cho 4 tab còn lại
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── supabaseClient.js
├── .env.example
├── package.json
└── vite.config.js
```
