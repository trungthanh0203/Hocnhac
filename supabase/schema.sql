-- ============================================================
-- HOC NHAC CUNG MR.THANH -- Supabase schema
-- Chạy file này trong Supabase SQL Editor (chạy 1 lần khi tạo project)
-- ============================================================

-- 1) HO SO NGUOI DUNG (gắn với Supabase Auth)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('admin','student')),
  created_at timestamptz default now()
);

-- 2) 9 CAP HOC
create table if not exists levels (
  id serial primary key,
  tier text not null,              -- 'Sơ cấp' | 'Trung cấp' | 'Nâng cao'
  name text not null,              -- 'Sơ cấp 1'
  order_index int not null,
  focus_text text
);

-- 3) MODULE TRONG MOI CAP (Nhạc lý, Tiết tấu, Xướng âm, Hòa âm, Thường thức)
create table if not exists modules (
  id serial primary key,
  level_id int references levels(id) on delete cascade,
  name text not null,
  order_index int not null
);

-- 4) BAI HOC
create table if not exists lessons (
  id serial primary key,
  module_id int references modules(id) on delete cascade,
  order_index int not null,
  title text not null,
  goal text,
  is_demo_free boolean not null default false   -- true = 3 bài đầu, mở cho tài khoản demo
);

-- 5) TUNG Y NHO TRONG BAI HOC (kèm hình minh họa dạng dữ liệu có cấu trúc, không lưu SVG thô)
-- media dạng jsonb, ví dụ:
--   {"kind":"staff_blank"}
--   {"kind":"staff_notes","notes":["G"]}
--   {"kind":"clef_highlight"}
--   {"kind":"accidental","note":"F","symbol":"#"}
--   {"kind":"beat_strip","pattern":[1,1,1,1]}
--   {"kind":"notehead","filled":true,"label":"1 phách"}
--   {"kind":"icon","index":1}
-- audio dạng jsonb, ví dụ:
--   {"type":"note","note":"G","label":"Nghe nốt Sol"}
--   {"type":"sequence","notes":["C","D","E"],"label":"Nghe Đô Rê Mi"}
--   {"type":"click","pattern":[1,1,1,1],"label":"Nghe 4 phách đều"}
--   {"type":"timbre","name":"piano","label":"Nghe âm piano"}
create table if not exists lesson_points (
  id serial primary key,
  lesson_id int references lessons(id) on delete cascade,
  order_index int not null,
  heading text not null,
  body text not null,
  media jsonb,
  audio jsonb,
  example_tag text
);

-- 6) THE KHAI NIEM (dùng trong Ôn tập)
create table if not exists concepts (
  id serial primary key,
  module_id int references modules(id) on delete cascade,
  term text not null,
  sub text,
  audio_note text,
  icon_index int default 0
);

-- 7) NGAN HANG CAU HOI (dùng cho cả Ôn tập và Bài test)
create table if not exists questions (
  id serial primary key,
  level_id int references levels(id) on delete cascade,
  type text not null check (type in ('mc','staff','audio','match','fill')),
  question_text text not null,
  options jsonb,          -- mảng string, null nếu type = 'fill'
  correct_answer text,    -- dùng cho mc/staff/audio/match
  answers jsonb,          -- mảng các đáp án chấp nhận được, dùng cho 'fill'
  note text,              -- tên nốt, dùng cho type staff/audio
  explanation text
);

-- 8) MA KICH HOAT
create table if not exists activation_codes (
  id serial primary key,
  code text unique not null,
  unlock_level_id int references levels(id),   -- null = mở tất cả 9 cấp
  expires_at timestamptz,
  created_at timestamptz default now(),
  used_by uuid references auth.users(id),
  used_at timestamptz,
  note text
);

-- 9) HOC VIEN DA MO CAP NAO (không lưu tiến độ học/điểm số, chỉ lưu quyền truy cập)
create table if not exists student_access (
  id serial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  level_id int references levels(id),
  activated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table levels enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table lesson_points enable row level security;
alter table concepts enable row level security;
alter table questions enable row level security;
alter table activation_codes enable row level security;
alter table student_access enable row level security;

-- Nội dung học: ai cũng đọc được (kể cả chưa đăng nhập) — việc khóa bài demo xử lý ở phía frontend
create policy "public read levels" on levels for select using (true);
create policy "public read modules" on modules for select using (true);
create policy "public read lessons" on lessons for select using (true);
create policy "public read lesson_points" on lesson_points for select using (true);
create policy "public read concepts" on concepts for select using (true);
create policy "public read questions" on questions for select using (true);

-- profiles: user tự xem/sửa hồ sơ của mình; admin xem được tất cả
create policy "own profile select" on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);
create policy "admin read all profiles" on profiles for select
  using (exists (select 1 from profiles p2 where p2.id = auth.uid() and p2.role = 'admin'));

-- activation_codes: chỉ admin thao tác trực tiếp trên bảng này
create policy "admin manage activation_codes" on activation_codes for all
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- student_access: user chỉ thấy quyền truy cập của chính mình
create policy "own access select" on student_access for select using (auth.uid() = user_id);

-- ============================================================
-- HAM RPC: nhap ma kich hoat an toan (khong lo bang activation_codes cho hoc vien)
-- ============================================================
create or replace function redeem_code(code_input text)
returns jsonb
language plpgsql
security definer
as $$
declare
  rec activation_codes%rowtype;
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
  insert into student_access(user_id, level_id) values (auth.uid(), rec.unlock_level_id);

  return jsonb_build_object('success', true, 'level_id', rec.unlock_level_id);
end;
$$;

-- Cho phép người dùng đã đăng nhập gọi hàm redeem_code
grant execute on function redeem_code(text) to authenticated;
