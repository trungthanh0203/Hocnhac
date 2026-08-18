-- ============================================================
-- VA HINH MINH HOA con thiếu ở Sơ cấp 2-3 (các ý trước đây chỉ có chữ)
-- Chạy sau khi đã có seed_so_cap_2.sql + seed_so_cap_3.sql
-- Dùng UPDATE match theo lesson + heading, không đụng tới các ý đã có sẵn hình
-- ============================================================

-- Sơ cấp 2 · Dấu lặng đen · "Vì sao cần dấu lặng"
update lesson_points set media = '{"kind":"breath"}'::jsonb
where heading = 'Vì sao cần dấu lặng'
  and lesson_id = (select id from lessons where title = 'Dấu lặng đen');

-- Sơ cấp 2 · Dấu lặng trắng · "So sánh với lặng đen"
update lesson_points set media = '{"kind":"rest_compare"}'::jsonb
where heading = 'So sánh với lặng đen'
  and lesson_id = (select id from lessons where title = 'Dấu lặng trắng');

-- Sơ cấp 2 · Nốt móc đơn · "Giá trị"
update lesson_points set media = '{"kind":"beamed_eighths"}'::jsonb
where heading = 'Giá trị'
  and lesson_id = (select id from lessons where title = 'Nốt móc đơn');

-- Sơ cấp 2 · Bài hát thiếu nhi Việt Nam · "Ứng dụng"
update lesson_points set media = '{"kind":"milestone"}'::jsonb
where heading = 'Ứng dụng'
  and lesson_id = (select id from lessons where title = 'Bài hát thiếu nhi Việt Nam');

-- Sơ cấp 3 · Dấu chấm dôi · "Ví dụ tính toán"
update lesson_points set media = '{"kind":"dotted_compare"}'::jsonb
where heading = 'Ví dụ tính toán'
  and lesson_id = (select id from lessons where title = 'Dấu chấm dôi');

-- Sơ cấp 3 · Nốt móc kép · "Giá trị"
update lesson_points set media = '{"kind":"beamed_eighths"}'::jsonb
where heading = 'Giá trị'
  and lesson_id = (select id from lessons where title = 'Nốt móc kép (giới thiệu)');

-- Sơ cấp 3 · Ôn tập tổng hợp Sơ cấp · "Bước tiếp theo"
update lesson_points set media = '{"kind":"forward"}'::jsonb
where heading = 'Bước tiếp theo'
  and lesson_id = (select id from lessons where title = 'Ôn tập tổng hợp Sơ cấp');

-- Kiểm tra lại: liệt kê các ý (ở Sơ cấp 2-3) vẫn còn CHƯA có hình sau khi vá
select l.title as bai_hoc, lp.heading as y_con_thieu_hinh
from lesson_points lp
join lessons l on l.id = lp.lesson_id
join modules m on m.id = l.module_id
join levels lv on lv.id = m.level_id
where lv.name in ('Sơ cấp 2', 'Sơ cấp 3') and lp.media is null;
