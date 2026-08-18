-- ============================================================
-- BANG MOI: practice_scores — giai điệu Thực hành, RIÊNG cho từng cấp
-- (trước đây bị hard-code 1 bài dùng chung mọi cấp — sửa lại đúng thiết kế)
-- ============================================================

create table if not exists practice_scores (
  id serial primary key,
  level_id int references levels(id) on delete cascade,
  order_index int not null default 1,
  title text not null,
  measures jsonb not null   -- ví dụ: [[{"note":"C","dur":1},{"note":"D","dur":1}], [{"note":"E","dur":2}], ...]
);

alter table practice_scores enable row level security;
create policy "public read practice_scores" on practice_scores for select using (true);
create policy "admin manage practice_scores" on practice_scores for all
  using (is_admin()) with check (is_admin());
