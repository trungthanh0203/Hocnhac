-- ============================================================
-- SEED DU LIEU: SO CAP 2 — mở rộng phạm vi nốt, làm quen nhịp 3/4
-- Chạy SAU khi đã chạy schema.sql + seed_so_cap_1.sql (+ các file migrate liên quan)
-- Dùng subquery để tự tìm đúng ID, không phụ thuộc vào việc bạn đã sửa/thêm gì ở Sơ cấp 1
-- ============================================================

-- 4 MODULE CUA SO CAP 2 (level "Sơ cấp 2")
insert into modules (level_id, name, order_index)
select id, m.name, m.order_index from levels,
  (values ('Nhạc lý',1), ('Tiết tấu',2), ('Xướng âm',3), ('Thường thức',4)) as m(name, order_index)
where levels.name = 'Sơ cấp 2';

-- 12 BAI HOC SO CAP 2
insert into lessons (module_id, order_index, title, goal, is_demo_free)
select (select id from modules where level_id = (select id from levels where name='Sơ cấp 2') and name = l.mod_name),
       l.order_index, l.title, l.goal, l.is_demo_free
from (values
  ('Nhạc lý', 1, 'Vị trí nốt La và Si trên khuông nhạc', 'Sau bài này, bạn xác định đúng vị trí đủ 7 nốt Đô-Si trên khuông nhạc.', true),
  ('Nhạc lý', 2, 'Dấu lặng đen', 'Sau bài này, bạn nhận biết dấu lặng đen và biết nó có nghĩa là nghỉ 1 phách.', true),
  ('Nhạc lý', 3, 'Dấu lặng trắng', 'Sau bài này, bạn phân biệt được dấu lặng đen và dấu lặng trắng.', true),
  ('Nhạc lý', 4, 'Nốt móc đơn', 'Sau bài này, bạn nhận biết nốt móc đơn và biết giá trị nửa phách của nó.', false),
  ('Tiết tấu', 1, 'Nhịp 3/4', 'Sau bài này, bạn hiểu ý nghĩa nhịp 3/4 và phân biệt được với nhịp 2/4 đã học.', true),
  ('Tiết tấu', 2, 'Kết hợp đen - trắng - móc đơn', 'Sau bài này, bạn đọc được 1 câu tiết tấu có đủ 3 loại hình nốt đã học.', true),
  ('Tiết tấu', 3, 'Ôn tập hình nốt và dấu lặng', 'Sau bài này, bạn phân biệt nhanh và chính xác các hình nốt, dấu lặng đã học.', false),
  ('Xướng âm', 1, 'Xướng âm đủ 7 nốt Đô đến Si', 'Sau bài này, bạn xướng âm trôi chảy cả 7 nốt Đô-Rê-Mi-Fa-Sol-La-Si.', true),
  ('Xướng âm', 2, 'Xướng âm có dấu lặng', 'Sau bài này, bạn giữ đúng nhịp khi xướng âm 1 câu có chỗ nghỉ (dấu lặng).', true),
  ('Xướng âm', 3, 'Xướng âm nhịp 3/4', 'Sau bài này, bạn xướng âm đúng 1 câu nhạc viết ở nhịp 3/4.', false),
  ('Thường thức', 1, 'Giới thiệu giọng Đô trưởng', 'Sau bài này, bạn biết giọng Đô trưởng là gì ở mức sơ lược.', true),
  ('Thường thức', 2, 'Bài hát thiếu nhi Việt Nam', 'Sau bài này, bạn nhận ra đặc điểm chung của các bài hát thiếu nhi quen thuộc.', false)
) as l(mod_name, order_index, title, goal, is_demo_free);

-- LESSON POINTS
-- Bài "Vị trí nốt La và Si trên khuông nhạc"
insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Vị trí nốt La và Si trên khuông nhạc'), * from (values
  (1, 'Nốt La', 'Nốt La nằm trong khe thứ ba của khuông nhạc, ngay trên nốt Sol.',
     '{"kind":"staff_notes","notes":["A"]}'::jsonb, '{"type":"note","note":"A","label":"Nghe nốt La"}'::jsonb),
  (2, 'Nốt Si', 'Nốt Si nằm trên dòng kẻ thứ ba, ở giữa khuông nhạc.',
     '{"kind":"staff_notes","notes":["B"]}'::jsonb, '{"type":"note","note":"B","label":"Nghe nốt Si"}'::jsonb),
  (3, 'Đủ 7 nốt trên khuông', 'Giờ bạn đã biết vị trí cả 7 nốt Đô-Rê-Mi-Fa-Sol-La-Si trên khuông nhạc khóa Sol.',
     '{"kind":"staff_notes","notes":["C","D","E","F","G","A","B"]}'::jsonb, '{"type":"sequence","notes":["C","D","E","F","G","A","B"],"label":"Nghe cả 7 nốt"}'::jsonb)
) as p(order_index, heading, body, media, audio);

-- Bài "Dấu lặng đen"
insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Dấu lặng đen'), * from (values
  (1, 'Dấu lặng đen là gì', 'Ký hiệu cho biết phải NGHỈ (không phát âm) đúng 1 phách, bằng đúng giá trị của 1 nốt đen.',
     '{"kind":"rest","type":"quarter","label":"Lặng đen = nghỉ 1 phách"}'::jsonb),
  (2, 'Vì sao cần dấu lặng', 'Âm nhạc cần có chỗ nghỉ để câu nhạc "thở" được, không phải lúc nào cũng có âm thanh liên tục.', null)
) as p(order_index, heading, body, media);

-- Bài "Dấu lặng trắng"
insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Dấu lặng trắng'), * from (values
  (1, 'Dấu lặng trắng là gì', 'Ký hiệu cho biết phải nghỉ đúng 2 phách, bằng đúng giá trị của 1 nốt trắng.',
     '{"kind":"rest","type":"half","label":"Lặng trắng = nghỉ 2 phách"}'::jsonb),
  (2, 'So sánh với lặng đen', 'Lặng trắng nghỉ lâu gấp đôi lặng đen — giống hệt quan hệ giữa nốt trắng và nốt đen.', null)
) as p(order_index, heading, body, media);

-- Bài "Nốt móc đơn" (khóa demo)
insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Nốt móc đơn'), * from (values
  (1, 'Hình dạng nốt móc đơn', 'Giống nốt đen nhưng có thêm 1 dấu móc nhỏ ở đuôi nốt.',
     '{"kind":"notehead","filled":true,"label":"1/2 phách"}'::jsonb),
  (2, 'Giá trị', 'Nốt móc đơn chỉ ngân dài bằng nửa nốt đen — 2 nốt móc đơn mới bằng 1 phách.', null)
) as p(order_index, heading, body, media);

-- Bài "Nhịp 3/4"
insert into lesson_points (lesson_id, order_index, heading, body, media, audio, example_tag)
select (select id from lessons where title = 'Nhịp 3/4'), * from (values
  (1, 'Số chỉ nhịp 3/4', 'Số 3 trên: mỗi ô nhịp có 3 phách. Số 4 dưới: nốt đen vẫn bằng 1 phách như đã học.',
     '{"kind":"meter","num":3,"den":4}'::jsonb, null::jsonb, null),
  (2, 'Phách mạnh - nhẹ - nhẹ', 'Phách 1 mạnh, phách 2 và 3 nhẹ hơn — tạo cảm giác "đung đưa" đặc trưng của nhịp 3/4.',
     '{"kind":"beat_strip","pattern":[2,1,1]}'::jsonb, '{"type":"click","pattern":[1,0,0],"label":"Nghe mạnh-nhẹ-nhẹ"}'::jsonb,
     'Ví dụ quen thuộc: rất nhiều bài hát ru truyền thống Việt Nam viết theo nhịp 3 phách, tạo cảm giác nhẹ nhàng đung đưa.')
) as p(order_index, heading, body, media, audio, example_tag);

-- Bài "Kết hợp đen - trắng - móc đơn"
insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Kết hợp đen - trắng - móc đơn'), * from (values
  (1, 'Câu tiết tấu hỗn hợp', 'Một câu nhạc thường không chỉ dùng 1 loại hình nốt — kết hợp đen, trắng, móc đơn tạo tiết tấu sinh động hơn.',
     '{"kind":"staff_notes","notes":["C","D","E","D"]}'::jsonb, '{"type":"sequence","notes":["C","D","E","D"],"label":"Nghe ví dụ"}'::jsonb)
) as p(order_index, heading, body, media, audio);

-- Bài "Ôn tập hình nốt và dấu lặng" (khóa demo)
insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Ôn tập hình nốt và dấu lặng'), * from (values
  (1, 'Tổng kết trường độ đã học', 'Nốt trắng (2 phách) - nốt đen (1 phách) - nốt móc đơn (1/2 phách).', '{"kind":"icon","index":6}'::jsonb),
  (2, 'Tổng kết dấu lặng đã học', 'Lặng trắng (nghỉ 2 phách) - lặng đen (nghỉ 1 phách).', '{"kind":"rest","type":"quarter","label":"Ôn tập dấu lặng"}'::jsonb)
) as p(order_index, heading, body, media);

-- Bài "Xướng âm đủ 7 nốt Đô đến Si"
insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Xướng âm đủ 7 nốt Đô đến Si'), * from (values
  (1, 'Luyện tập', 'Xướng âm chậm rãi từ Đô lên tới Si rồi quay ngược lại, giữ đúng cao độ từng nốt.',
     '{"kind":"staff_notes","notes":["C","D","E","F","G","A","B"]}'::jsonb, '{"type":"sequence","notes":["C","D","E","F","G","A","B"],"label":"Nghe đi lên"}'::jsonb)
) as p(order_index, heading, body, media, audio);

-- Bài "Xướng âm có dấu lặng"
insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Xướng âm có dấu lặng'), * from (values
  (1, 'Giữ nhịp khi nghỉ', 'Khi gặp dấu lặng, vẫn đếm thầm trong đầu để không bị lệch nhịp ở nốt tiếp theo.',
     '{"kind":"staff_notes","notes":["C","E","G"]}'::jsonb, '{"type":"sequence","notes":["C","E","G"],"label":"Nghe ví dụ"}'::jsonb)
) as p(order_index, heading, body, media, audio);

-- Bài "Xướng âm nhịp 3/4" (khóa demo)
insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Xướng âm nhịp 3/4'), * from (values
  (1, 'Câu nhạc 3 phách', 'Xướng âm câu nhạc dưới đây, nhớ nhấn nhẹ vào phách đầu mỗi ô nhịp.',
     '{"kind":"staff_notes","notes":["C","D","E"]}'::jsonb, '{"type":"sequence","notes":["C","D","E"],"label":"Nghe câu nhạc"}'::jsonb)
) as p(order_index, heading, body, media, audio);

-- Bài "Giới thiệu giọng Đô trưởng"
insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Giới thiệu giọng Đô trưởng'), * from (values
  (1, 'Giọng là gì (sơ lược)', 'Một "giọng" là tập hợp các nốt nhạc chính dùng trong 1 bài, xoay quanh 1 nốt "chủ" quan trọng nhất.',
     '{"kind":"icon","index":1}'::jsonb),
  (2, 'Giọng Đô trưởng', 'Giọng đơn giản nhất — dùng đúng 7 nốt Đô-Rê-Mi-Fa-Sol-La-Si, không có dấu hóa nào, nốt chủ là Đô.',
     '{"kind":"staff_notes","notes":["C"]}'::jsonb)
) as p(order_index, heading, body, media);

-- Bài "Bài hát thiếu nhi Việt Nam" (khóa demo)
insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Bài hát thiếu nhi Việt Nam'), * from (values
  (1, 'Đặc điểm chung', 'Đa số bài hát thiếu nhi dùng giai điệu đơn giản, phạm vi nốt hẹp, tiết tấu đều đặn — rất phù hợp để luyện xướng âm.', '{"kind":"icon","index":7}'::jsonb),
  (2, 'Ứng dụng', 'Sau khi học xong Sơ cấp 2, bạn đã đủ kiến thức để tự đọc được nhiều bài hát thiếu nhi quen thuộc.', null)
) as p(order_index, heading, body, media);

-- THE KHAI NIEM (On tap) SO CAP 2
insert into concepts (module_id, term, sub, audio_note, icon_index)
select (select id from modules where level_id=(select id from levels where name='Sơ cấp 2') and name=c.mod_name), c.term, c.sub, c.audio_note, c.icon_index
from (values
  ('Nhạc lý','La','nốt trong khe thứ 3','A',1),
  ('Nhạc lý','Si','nốt trên dòng kẻ thứ 3','B',2),
  ('Nhạc lý','Lặng đen','nghỉ 1 phách',null,3),
  ('Nhạc lý','Lặng trắng','nghỉ 2 phách',null,4),
  ('Nhạc lý','Móc đơn','1/2 phách',null,6),
  ('Tiết tấu','Nhịp 3/4','3 phách mỗi ô nhịp',null,5),
  ('Tiết tấu','Mạnh-nhẹ-nhẹ','trọng âm nhịp 3/4',null,10),
  ('Xướng âm','Đô đến Si','đủ 7 nốt','C',7),
  ('Xướng âm','Câu nhạc có lặng','giữ nhịp khi nghỉ',null,8),
  ('Xướng âm','Câu nhạc 3/4','xướng âm theo nhịp 3',null,9),
  ('Thường thức','Giọng Đô trưởng','không dấu hóa, chủ âm Đô',null,0),
  ('Thường thức','Bài hát thiếu nhi','giai điệu đơn giản',null,11)
) as c(mod_name, term, sub, audio_note, icon_index);

-- NGAN HANG CAU HOI SO CAP 2 (16 câu, tương tự Sơ cấp 1)
insert into questions (level_id, type, question_text, options, correct_answer)
select (select id from levels where name='Sơ cấp 2'), * from (values
  ('mc','Nốt La nằm ở vị trí nào trên khuông nhạc?','["Trên dòng kẻ 3","Trong khe thứ 3","Dưới khuông nhạc","Trên dòng kẻ 1"]'::jsonb,'Trong khe thứ 3'),
  ('staff','Nhìn khuông nhạc, đây là nốt gì?','["Sol","La","Si","Đô"]'::jsonb,'La'),
  ('audio','Nghe âm thanh và chọn đúng tên nốt:','["Sol","La","Si","Đô"]'::jsonb,'Si'),
  ('mc','Dấu lặng đen nghĩa là nghỉ bao nhiêu phách?','["Nửa phách","1 phách","2 phách","4 phách"]'::jsonb,'1 phách'),
  ('mc','Dấu lặng trắng nghĩa là nghỉ bao nhiêu phách?','["1 phách","2 phách","3 phách","4 phách"]'::jsonb,'2 phách'),
  ('match','Nốt móc đơn có giá trị trường độ là bao nhiêu?','["2 phách","1 phách","1/2 phách","1/4 phách"]'::jsonb,'1/2 phách'),
  ('mc','Nhịp 3/4 thì mỗi ô nhịp có bao nhiêu phách?','["2 phách","3 phách","4 phách","6 phách"]'::jsonb,'3 phách'),
  ('staff','Nhìn khuông nhạc, đây là nốt gì?','["La","Si","Đô","Rê"]'::jsonb,'Si'),
  ('audio','Nghe âm thanh và chọn đúng tên nốt:','["Fa","Sol","La","Si"]'::jsonb,'La'),
  ('match','Trong nhịp 3/4, phách nào là phách mạnh?','["Phách 1","Phách 2","Phách 3","Cả 3 phách đều mạnh như nhau"]'::jsonb,'Phách 1'),
  ('mc','Giọng Đô trưởng có bao nhiêu dấu hóa?','["Không có dấu hóa nào","1 dấu thăng","1 dấu giáng","2 dấu thăng"]'::jsonb,'Không có dấu hóa nào'),
  ('staff','Nhìn khuông nhạc, đây là nốt gì?','["Đô","Rê","Mi","Fa"]'::jsonb,'Đô'),
  ('audio','Nghe âm thanh và chọn đúng tên nốt:','["Đô","Rê","Mi","Fa"]'::jsonb,'Rê'),
  ('match','Nốt chủ (âm chủ) của giọng Đô trưởng là nốt nào?','["Đô","Rê","Sol","La"]'::jsonb,'Đô'),
  ('mc','7 nốt nhạc cơ bản đầy đủ là gì?','["Đô Rê Mi Fa Sol La Si","Đô Rê Mi Fa Sol La","Đô Rê Mi Fa Sol","Đô Rê Mi"]'::jsonb,'Đô Rê Mi Fa Sol La Si'),
  ('match','Nốt trắng và 2 nốt móc đơn, cái nào ngân dài hơn?','["Nốt trắng","2 nốt móc đơn","Bằng nhau","Không so sánh được"]'::jsonb,'Nốt trắng')
) as q(type, question_text, options, correct_answer);
