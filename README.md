# Học nhạc cùng Mr.Thành — hướng dẫn triển khai chi tiết

Kiến trúc: **GitHub** (lưu code) → **Cloudflare Pages/Workers** (host web app, tự build và deploy mỗi khi bạn đẩy code mới) ↔ **Supabase** (đăng nhập, database, lưu trữ file). Giai đoạn sau sẽ thêm **Cloudflare Workers AI** để tạo ảnh minh họa.

Hướng dẫn này viết cho người **chưa quen dòng lệnh** — mỗi bước đều nói rõ bạn gõ lệnh gì và **sẽ thấy hiện tượng gì** để bạn tự biết mình đang làm đúng hay sai.

---

## Bước 0 — Kiểm tra máy đã có Node.js chưa

Mở **PowerShell** (bấm Start, gõ "PowerShell", Enter), gõ:
```
node -v
npm -v
```
✅ Đúng: hiện ra 2 dòng số phiên bản, ví dụ `v20.11.0` và `10.2.4`.
❌ Sai: báo `'node' is not recognized...` — bạn chưa cài Node.js. Tải bản **LTS** tại https://nodejs.org, cài xong **đóng hẳn PowerShell rồi mở lại** (bắt buộc, không thì máy chưa nhận lệnh mới), gõ lại 2 lệnh trên để kiểm tra.

---

## Bước 1 — Tạo Supabase project và nạp dữ liệu

1. Vào https://supabase.com → đăng nhập → **New Project**.
2. Đặt tên (ví dụ `hocnhac-app`), đặt mật khẩu database (**lưu lại chỗ nào đó**, không phải mật khẩu đăng nhập Supabase của bạn), chọn vùng **Southeast Asia (Singapore)** cho gần Việt Nam, bấm **Create new project**.
   ✅ Đúng: Supabase hiện màn hình "Setting up project..." khoảng 1-2 phút rồi tự chuyển sang dashboard.
3. Menu bên trái → **SQL Editor** → **New query**.
4. Mở file `supabase/schema.sql` trong project đã tải về (dùng Notepad hoặc VS Code), **bôi đen toàn bộ (Ctrl+A), copy (Ctrl+C)**, dán vào ô query trên Supabase (Ctrl+V), bấm **Run** (hoặc Ctrl+Enter).
   ✅ Đúng: thanh thông báo màu xanh lá "Success. No rows returned" hiện ở góc dưới.
   ❌ Sai: chữ đỏ báo lỗi SQL — thường là do dán thiếu 1 phần, thử copy lại từ đầu.
5. Bấm **New query** lần nữa (không dùng lại ô cũ), làm y hệt bước 4 với file `supabase/seed_so_cap_1.sql`.
6. (Tùy chọn, để có mã test) Bấm **New query**, làm y hệt với file `supabase/test_activation_codes.sql`.
7. Vào menu **Table Editor** bên trái → bấm bảng `lessons` → ✅ đúng: thấy 12 dòng dữ liệu (12 bài Sơ cấp 1).
8. Vào icon **bánh răng (Project Settings)** ở góc dưới trái → **API** → bạn sẽ thấy 2 giá trị cần copy:
   - **Project URL** (dạng `https://xxxxxxxx.supabase.co`)
   - **anon public** key (chuỗi rất dài, bắt đầu bằng `eyJ...`)

   Giữ tab trình duyệt này mở, Bước 2 sẽ cần dùng lại.

---

## Bước 2 — Chạy thử ở máy bạn (local)

Trong PowerShell, di chuyển vào đúng thư mục project (sửa đường dẫn cho khớp máy bạn, ví dụ nếu bạn giải nén ra Downloads):
```
cd C:\Users\<tên-máy-bạn>\Downloads\hocnhac-app
```
✅ Đúng: dòng nhắc lệnh (prompt) đổi thành đường dẫn đó.

Tạo file cấu hình cho máy local:
```
copy .env.example .env
notepad .env
```
Dán **Project URL** và **anon public key** đã copy ở Bước 1 vào, dạng:
```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```
**Lưu (Ctrl+S), đóng Notepad.**

Cài thư viện:
```
npm install
```
✅ Đúng: chạy khoảng 30 giây, kết thúc bằng dòng `added XX packages`.

Chạy app:
```
npm run dev
```
✅ Đúng: hiện vài dòng, trong đó có dòng quan trọng nhất:
```
➜  Local:   http://localhost:5173/
```
**Terminal sẽ KHÔNG tự mở trình duyệt** — bạn tự copy dòng địa chỉ đó, dán vào Chrome/Edge để xem app.

✅ Đúng: thấy giao diện app, tab "Bài học" hiện 12 bài Sơ cấp 1, có hình minh họa và nghe được âm thanh khi bấm nút loa.
❌ Sai / trang trắng: bấm **F12** mở DevTools, xem tab **Console** có dòng chữ đỏ nào, chụp gửi mình.

*(Cửa sổ PowerShell đang chạy `npm run dev` sẽ đứng yên ở đó — đó là bình thường, nó đang giữ server sống. Bấm `Ctrl + C` để dừng khi cần.)*

---

## Bước 3 — Đưa code lên GitHub

**3a. Tạo repo rỗng trên GitHub trước:**
1. Vào https://github.com → bấm **+** góc trên phải → **New repository**.
2. Đặt tên (ví dụ `hocnhac-app`) → **KHÔNG** tích "Add a README file" → **Create repository**.
3. Trang tiếp theo hiện 1 đường dẫn dạng `https://github.com/tên-bạn/hocnhac-app.git` — **copy đường dẫn này**.

**3b. Quay lại PowerShell** (vẫn đang ở đúng thư mục project), chạy lần lượt:
```
git init
git add .
git commit -m "Khung project ban đầu"
git branch -M main
git remote add origin https://github.com/tên-bạn/hocnhac-app.git
git push -u origin main
```
✅ Đúng: lần đầu `push` có thể hiện cửa sổ trình duyệt yêu cầu đăng nhập GitHub — đăng nhập xong, PowerShell tự chạy tiếp, kết thúc bằng dòng `branch 'main' set up to track 'origin/main'`.
Kiểm tra lại: refresh trang GitHub repo trên trình duyệt — thấy toàn bộ file code đã có ở đó.

❌ Nếu báo `remote origin already exists` (do đã chạy `git remote add` từ trước): dùng lệnh này thay thế:
```
git remote set-url origin https://github.com/tên-bạn/hocnhac-app.git
git push -u origin main
```

---

## Bước 4 — Đưa khóa Supabase vào code (né lỗi "Variables cannot be added...")

Đây là bước hay bị vướng nhất vì Cloudflare mới đổi giao diện. **Không cần vào phần "Variables and Secrets"** trên Cloudflare nữa — làm cách này chắc chắn hơn:

Tạo file `.env.production` **ngay trong project**, nội dung giống hệt file `.env` bạn đã tạo ở Bước 2:
```
notepad .env.production
```
Dán vào:
```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```
**Lưu, đóng.**

> **Vì sao an toàn?** `anon key` của Supabase vốn **được thiết kế để lộ ra ở trình duyệt** — mọi app Supabase đều làm vậy. Nó không phải "mật khẩu bí mật" như khóa admin; toàn bộ quyền truy cập dữ liệu thật sự được kiểm soát bởi **Row Level Security (RLS)** mà mình đã bật sẵn trong `schema.sql` (ví dụ bảng `activation_codes` chỉ admin mới đọc/ghi được, dù ai cũng thấy được anon key).

File `.env.production` này **khác** với file `.env` (file `.env` bị `.gitignore` chặn không cho lên GitHub, còn `.env.production` thì được phép — đây là chủ đích). Đẩy nó lên GitHub:
```
git add .env.production
git commit -m "Thêm cấu hình Supabase cho bản build production"
git push
```
✅ Đúng: thấy tiến trình push chạy xong bình thường như Bước 3.

---

## Bước 5 — Deploy qua Cloudflare

1. Vào Cloudflare dashboard → **Workers & Pages → Create → Import a repository** (hoặc **Pages → Connect to Git**, tùy giao diện hiện tại của bạn).
2. Chọn repo `hocnhac-app` vừa đẩy lên.
3. Ở phần cấu hình build:
   - **Build command**: `npm run build`
   - **Build output directory / Path**: `dist`
4. Bấm **Save and Deploy**.
   ✅ Đúng: Cloudflare chạy build (mất khoảng 1-2 phút), log cuối cùng có dòng `Success` màu xanh, và cấp cho bạn 1 địa chỉ dạng `hocnhac-app.pages.dev` hoặc `.workers.dev` — bấm vào để xem app chạy thật trên mạng.
   ❌ Nếu vẫn báo lỗi liên quan đến biến môi trường: nghĩa là Cloudflare chưa đọc được file `.env.production` — kiểm tra lại file đó đã được `git push` lên GitHub thật chưa (vào GitHub repo, xem có thấy file `.env.production` trong danh sách không).

**Từ giờ về sau**: mỗi lần bạn `git push` code mới lên GitHub, Cloudflare **tự động build và deploy lại** — bạn không cần bấm gì thêm trên Cloudflare nữa.

---

## Bước 6 — Cấp mã kích hoạt cho học viên (tạm thời, chưa cần trang quản trị riêng)

Vào Supabase → **Table Editor → activation_codes** → **Insert row**:
- `code`: gõ mã bất kỳ, ví dụ `HOCVIEN001`
- `unlock_level_id`: chọn số cấp muốn mở (1 = Sơ cấp 1, để trống/null = mở tất cả 9 cấp)
- `expires_at`: chọn ngày hết hạn
- Bấm **Save**.

Học viên nhập mã này vào app (màn hình nhập mã sẽ gọi hàm `redeem_code` đã có sẵn trong `schema.sql`) — Table Editor đóng vai trò "trang quản trị tạm" cho tới khi có giao diện admin riêng.

File `supabase/test_activation_codes.sql` đã có sẵn 4 mã mẫu để bạn test nhanh các tình huống (mã còn hạn, mã mở hết 9 cấp, mã hết hạn, mã mở Trung cấp 1).

---

## Việc cần làm tiếp (gợi ý thứ tự ưu tiên)

1. Màn hình đăng nhập / nhập mã kích hoạt (Supabase Auth + gọi RPC `redeem_code`).
2. Port 4 tab còn lại (Ôn tập, Luyện âm, Bài test, Thực hành) theo đúng mẫu `src/components/LessonTab.jsx` — dùng `src/lib/audio.js` và `src/lib/staffSvg.js` đã có sẵn.
3. Port "Lộ trình của tôi" (đọc bảng `levels` + `student_access`).
4. Bổ sung icon minh họa còn thiếu trong `staffSvg.js` (pitch/duration/volume, nhạc cụ) — xem lại bản demo HTML cũ để lấy markup SVG gốc.
5. Trang quản trị riêng (thêm/sửa bài học, câu hỏi, quản lý mã kích hoạt) khi Table Editor không còn đủ tiện.
6. Tích hợp Cloudflare Workers AI để tạo ảnh minh họa thay cho SVG vẽ tay.

---

## Cấu trúc thư mục

```
hocnhac-app/
├── supabase/
│   ├── schema.sql               # tạo bảng + RLS + hàm redeem_code
│   ├── seed_so_cap_1.sql        # dữ liệu mẫu: khung 9 cấp + đầy đủ Sơ cấp 1
│   └── test_activation_codes.sql # 4 mã kích hoạt mẫu để test
├── src/
│   ├── lib/
│   │   ├── audio.js             # engine âm thanh tổng hợp (Web Audio API)
│   │   └── staffSvg.js          # vẽ khuông nhạc / minh họa từ dữ liệu jsonb
│   ├── components/
│   │   ├── Banner.jsx
│   │   ├── TabBar.jsx
│   │   ├── LessonTab.jsx        # ĐÃ nối Supabase thật — dùng làm mẫu cho tab khác
│   │   └── StubTab.jsx          # khung tạm cho 4 tab còn lại
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── supabaseClient.js
├── .env.example                 # mẫu — không chứa khóa thật
├── .env                         # khóa dùng khi chạy local (KHÔNG lên GitHub)
├── .env.production               # khóa dùng khi Cloudflare build (CÓ lên GitHub, an toàn vì là anon key)
├── package.json
└── vite.config.js
```

---

## Câu hỏi thường gặp khi triển khai

**"npm run dev" báo lỗi liên quan Supabase URL undefined?**
→ File `.env` chưa có hoặc điền sai tên biến. Phải đúng chính xác `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` (thiếu tiền tố `VITE_` là Vite sẽ không đọc được).

**Sửa code xong, chạy local thấy đúng nhưng lên Cloudflare vẫn cũ?**
→ Bạn quên `git add` + `git commit` + `git push` sau khi sửa. Cloudflare chỉ build lại khi có commit mới trên GitHub.

**Muốn đổi khóa Supabase sau này (ví dụ đổi sang project Supabase khác)?**
→ Sửa cả 2 file `.env` (cho local) và `.env.production` (cho Cloudflare), rồi `git push` lại.
