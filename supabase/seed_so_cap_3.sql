-- ============================================================
-- SEED DU LIEU: SO CAP 3 — hoàn thiện nền tảng, chuẩn bị lên Trung cấp
-- Chạy SAU khi đã chạy seed_so_cap_2.sql
-- ============================================================

insert into modules (level_id, name, order_index)
select id, m.name, m.order_index from levels,
  (values ('Nhạc lý',1), ('Tiết tấu',2), ('Xướng âm',3), ('Thường thức',4)) as m(name, order_index)
where levels.name = 'Sơ cấp 3';

insert into lessons (module_id, order_index, title, goal, is_demo_free)
select (select id from modules where level_id = (select id from levels where name='Sơ cấp 3') and name = l.mod_name),
       l.order_index, l.title, l.goal, l.is_demo_free
from (values
  ('Nhạc lý', 1, 'Dấu chấm dôi', 'Sau bài này, bạn hiểu dấu chấm dôi làm tăng thêm nửa giá trị của nốt nhạc.', true),
  ('Nhạc lý', 2, 'Nốt móc kép (giới thiệu)', 'Sau bài này, bạn nhận biết nốt móc kép và biết nó ngắn hơn móc đơn.', true),
  ('Nhạc lý', 3, 'Nhịp 4/4', 'Sau bài này, bạn hiểu ý nghĩa nhịp 4/4 — loại nhịp phổ biến nhất.', true),
  ('Nhạc lý', 4, 'Ôn tập nhạc lý Sơ cấp', 'Sau bài này, bạn tự tổng kết lại toàn bộ nhạc lý đã học ở Sơ cấp.', false),
  ('Tiết tấu', 1, 'Đảo phách cơ bản', 'Sau bài này, bạn nhận biết được hiện tượng đảo phách đơn giản.', true),
  ('Tiết tấu', 2, 'Bài tập tiết tấu tổng hợp', 'Sau bài này, bạn đọc được 1 câu tiết tấu phối hợp đủ loại hình nốt và dấu lặng đã học.', true),
  ('Tiết tấu', 3, 'Ôn tập tiết tấu Sơ cấp', 'Sau bài này, bạn tự tin đọc mọi bài tập tiết tấu ở trình độ Sơ cấp.', false),
  ('Xướng âm', 1, 'Xướng âm quãng 8', 'Sau bài này, bạn xướng âm đúng cao độ từ Đô thấp lên Đô cao (1 quãng 8).', true),
  ('Xướng âm', 2, 'Bài tập nhịp 4/4', 'Sau bài này, bạn xướng âm trôi chảy 1 câu nhạc viết ở nhịp 4/4.', true),
  ('Xướng âm', 3, 'Bài tập có dấu chấm dôi', 'Sau bài này, bạn xướng âm đúng trường độ khi gặp nốt có dấu chấm dôi.', false),
  ('Thường thức', 1, 'Ký hiệu tốc độ đơn giản', 'Sau bài này, bạn nhận biết 3 mức tốc độ cơ bản: nhanh - vừa - chậm.', true),
  ('Thường thức', 2, 'Ôn tập tổng hợp Sơ cấp', 'Sau bài này, bạn đã sẵn sàng để bước vào chương trình Trung cấp.', false)
) as l(mod_name, order_index, title, goal, is_demo_free);

-- LESSON POINTS
insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Dấu chấm dôi'), * from (values
  (1, 'Dấu chấm dôi là gì', 'Một dấu chấm nhỏ đặt ngay sau đầu nốt, làm tăng thêm PHÂN NỬA giá trị của chính nốt đó.',
     '{"kind":"notehead","filled":false,"label":"trắng chấm dôi = 3 phách"}'::jsonb),
  (2, 'Ví dụ tính toán', 'Nốt trắng = 2 phách. Nốt trắng chấm dôi = 2 + 1 (nửa của 2) = 3 phách.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Nốt móc kép (giới thiệu)'), * from (values
  (1, 'Hình dạng', 'Giống nốt móc đơn nhưng có 2 dấu móc ở đuôi nốt thay vì 1.',
     '{"kind":"notehead","filled":true,"label":"1/4 phách"}'::jsonb),
  (2, 'Giá trị', 'Nốt móc kép chỉ bằng 1/4 phách — ngắn gấp đôi nốt móc đơn. 4 nốt móc kép mới bằng 1 phách.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Nhịp 4/4'), * from (values
  (1, 'Số chỉ nhịp 4/4', 'Số 4 trên: mỗi ô nhịp có 4 phách. Đây là loại nhịp được dùng nhiều nhất trong âm nhạc phổ thông.',
     '{"kind":"meter","num":4,"den":4}'::jsonb, null::jsonb),
  (2, 'Trọng âm trong nhịp 4/4', 'Phách 1 mạnh nhất, phách 3 mạnh vừa, phách 2 và 4 nhẹ.',
     '{"kind":"beat_strip","pattern":[2,1,2,1]}'::jsonb, '{"type":"click","pattern":[1,0,1,0],"label":"Nghe trọng âm 4/4"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Ôn tập nhạc lý Sơ cấp'), * from (values
  (1, 'Tổng kết', 'Bạn đã học: khuông nhạc, 7 nốt, vị trí nốt, dấu hóa, các hình nốt, dấu lặng, dấu chấm dôi, các loại nhịp 2/4-3/4-4/4.', '{"kind":"icon","index":0}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Đảo phách cơ bản'), * from (values
  (1, 'Đảo phách là gì', 'Khi trọng âm rơi vào chỗ đáng lẽ là phách nhẹ, tạo cảm giác "lệch" thú vị so với nhịp thông thường.',
     '{"kind":"beat_strip","pattern":[1,2,1]}'::jsonb, '{"type":"click","pattern":[0,1,0],"label":"Nghe đảo phách"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Bài tập tiết tấu tổng hợp'), * from (values
  (1, 'Luyện tổng hợp', 'Kết hợp nốt trắng, nốt đen, móc đơn và dấu lặng trong cùng 1 câu nhạc để luyện phản xạ đọc tiết tấu.',
     '{"kind":"staff_notes","notes":["C","E","G","E"]}'::jsonb, '{"type":"sequence","notes":["C","E","G","E"],"label":"Nghe ví dụ"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Ôn tập tiết tấu Sơ cấp'), * from (values
  (1, 'Tổng kết', 'Bạn đã học đủ: phách, nhịp 2/4-3/4-4/4, các hình nốt, dấu lặng, đảo phách cơ bản.', '{"kind":"icon","index":4}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Xướng âm quãng 8'), * from (values
  (1, 'Đô thấp đến Đô cao', 'Xướng âm từ Đô ở đáy khuông nhạc lên tới Đô ở quãng cao hơn — trọn vẹn 1 quãng 8.',
     '{"kind":"staff_notes","notes":["C","E","G","C"]}'::jsonb, '{"type":"sequence","notes":["C","E","G","C"],"label":"Nghe quãng 8"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Bài tập nhịp 4/4'), * from (values
  (1, 'Câu nhạc 4 phách', 'Xướng âm câu nhạc dưới đây, đếm đủ 4 phách mỗi ô nhịp.',
     '{"kind":"staff_notes","notes":["C","D","E","F"]}'::jsonb, '{"type":"sequence","notes":["C","D","E","F"],"label":"Nghe câu nhạc"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Bài tập có dấu chấm dôi'), * from (values
  (1, 'Luyện trường độ', 'Khi gặp nốt chấm dôi, ngân dài hơn bình thường đúng bằng nửa giá trị gốc — đừng vội chuyển sang nốt kế tiếp.',
     '{"kind":"notehead","filled":true,"label":"đen chấm dôi = 1.5 phách"}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Ký hiệu tốc độ đơn giản'), * from (values
  (1, 'Chậm (Lento/Adagio)', 'Tốc độ chậm rãi, thư thái.', '{"kind":"icon","index":4}'::jsonb),
  (2, 'Vừa phải (Moderato)', 'Tốc độ trung bình, phổ biến nhất trong các bài hát thiếu nhi.', '{"kind":"icon","index":5}'::jsonb),
  (3, 'Nhanh (Allegro)', 'Tốc độ nhanh, vui tươi, rộn ràng.', '{"kind":"icon","index":8}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Ôn tập tổng hợp Sơ cấp'), * from (values
  (1, 'Chúc mừng!', 'Bạn đã hoàn thành toàn bộ nền tảng Sơ cấp: nhạc lý, tiết tấu, xướng âm và thường thức âm nhạc cơ bản.', '{"kind":"icon","index":10}'::jsonb),
  (2, 'Bước tiếp theo', 'Trung cấp sẽ đưa bạn đến với quãng, giọng, và hợp âm — nền tảng để chơi nhạc cụ và đệm hát.', null)
) as p(order_index, heading, body, media);

-- THE KHAI NIEM SO CAP 3
insert into concepts (module_id, term, sub, audio_note, icon_index)
select (select id from modules where level_id=(select id from levels where name='Sơ cấp 3') and name=c.mod_name), c.term, c.sub, c.audio_note, c.icon_index
from (values
  ('Nhạc lý','Chấm dôi','tăng thêm nửa giá trị',null,6),
  ('Nhạc lý','Móc kép','1/4 phách',null,6),
  ('Nhạc lý','Nhịp 4/4','4 phách mỗi ô nhịp',null,5),
  ('Tiết tấu','Đảo phách','trọng âm lệch',null,10),
  ('Tiết tấu','Tiết tấu tổng hợp','đen-trắng-móc đơn-lặng',null,4),
  ('Xướng âm','Quãng 8','Đô thấp đến Đô cao','C',1),
  ('Xướng âm','Nhịp 4/4','xướng âm 4 phách','F',9),
  ('Xướng âm','Chấm dôi','ngân dài hơn 1.5 lần',null,7),
  ('Thường thức','Chậm - Vừa - Nhanh','3 mức tốc độ cơ bản',null,4),
  ('Thường thức','Tổng kết Sơ cấp','sẵn sàng lên Trung cấp',null,11)
) as c(mod_name, term, sub, audio_note, icon_index);

-- NGAN HANG CAU HOI SO CAP 3
insert into questions (level_id, type, question_text, options, correct_answer)
select (select id from levels where name='Sơ cấp 3'), * from (values
  ('mc','Dấu chấm dôi làm gì với nốt nhạc?','["Giảm nửa giá trị","Tăng thêm nửa giá trị","Nhân đôi giá trị","Không đổi gì cả"]'::jsonb,'Tăng thêm nửa giá trị'),
  ('mc','Nốt trắng chấm dôi ngân dài bao nhiêu phách?','["2 phách","2.5 phách","3 phách","4 phách"]'::jsonb,'3 phách'),
  ('mc','Nốt móc kép có giá trị bao nhiêu phách?','["1/2 phách","1/4 phách","1 phách","2 phách"]'::jsonb,'1/4 phách'),
  ('mc','Nhịp 4/4 thì mỗi ô nhịp có bao nhiêu phách?','["2 phách","3 phách","4 phách","6 phách"]'::jsonb,'4 phách'),
  ('match','Trong nhịp 4/4, phách nào mạnh nhất?','["Phách 1","Phách 2","Phách 3","Phách 4"]'::jsonb,'Phách 1'),
  ('mc','Đảo phách là hiện tượng gì?','["Mất phách","Trọng âm rơi vào phách đáng lẽ nhẹ","Tăng tốc độ đột ngột","Đổi sang nhịp khác"]'::jsonb,'Trọng âm rơi vào phách đáng lẽ nhẹ'),
  ('mc','Quãng 8 là khoảng cách từ đâu đến đâu?','["Đô đến Rê","Đô đến Sol","Đô đến Đô kế tiếp","Đô đến Si"]'::jsonb,'Đô đến Đô kế tiếp'),
  ('match','Allegro nghĩa là tốc độ như thế nào?','["Chậm","Vừa phải","Nhanh","Không xác định"]'::jsonb,'Nhanh'),
  ('match','Lento/Adagio nghĩa là tốc độ như thế nào?','["Chậm","Vừa phải","Nhanh","Rất nhanh"]'::jsonb,'Chậm'),
  ('mc','Moderato nghĩa là tốc độ như thế nào?','["Chậm","Vừa phải","Nhanh","Cực nhanh"]'::jsonb,'Vừa phải'),
  ('mc','4 nốt móc kép cộng lại bằng bao nhiêu phách?','["1/2 phách","1 phách","2 phách","4 phách"]'::jsonb,'1 phách'),
  ('mc','Sau Sơ cấp 3, học viên sẽ học tiếp cấp nào?','["Sơ cấp 1","Trung cấp 1","Nâng cao 1","Không có cấp tiếp theo"]'::jsonb,'Trung cấp 1'),
  ('match','Trong nhịp 4/4, đâu là các phách nhẹ?','["Phách 1 và 3","Phách 2 và 4","Chỉ phách 4","Không có phách nhẹ"]'::jsonb,'Phách 2 và 4')
) as q(type, question_text, options, correct_answer);
