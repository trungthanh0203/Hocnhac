-- ============================================================
-- SEED DU LIEU: NANG CAO 1 — tiết tấu & hòa âm phức tạp hơn
-- Chạy SAU khi đã chạy seed_trung_cap_3.sql
-- ============================================================

insert into modules (level_id, name, order_index)
select id, m.name, m.order_index from levels,
  (values ('Nhạc lý',1), ('Tiết tấu',2), ('Xướng âm',3), ('Hòa âm',4), ('Thường thức',5)) as m(name, order_index)
where levels.name = 'Nâng cao 1';

insert into lessons (module_id, order_index, title, goal, is_demo_free)
select (select id from modules where level_id = (select id from levels where name='Nâng cao 1') and name = l.mod_name),
       l.order_index, l.title, l.goal, l.is_demo_free
from (values
  ('Nhạc lý', 1, 'Giọng thứ hòa thanh', 'Sau bài này, bạn hiểu điểm khác biệt giữa giọng thứ tự nhiên và thứ hòa thanh.', true),
  ('Nhạc lý', 2, 'Dấu hóa bất thường', 'Sau bài này, bạn hiểu dấu hóa bất thường chỉ có hiệu lực trong phạm vi 1 ô nhịp.', false),
  ('Tiết tấu', 1, 'Nốt móc kép trong thực tế', 'Sau bài này, bạn áp dụng được nốt móc kép vào các câu tiết tấu nhanh.', true),
  ('Tiết tấu', 2, 'Chùm ba', 'Sau bài này, bạn nhận biết chùm ba — 3 nốt gọn trong thời gian bình thường của 2 nốt.', false),
  ('Xướng âm', 1, 'Đọc nhạc 2 bè — giới thiệu', 'Sau bài này, bạn hiểu khái niệm 2 bè và thử đọc từng bè riêng biệt.', true),
  ('Xướng âm', 2, 'Bài tập đọc 2 bè', 'Sau bài này, bạn luyện tập đọc 2 bè với 1 câu nhạc cụ thể.', false),
  ('Hòa âm', 1, 'Áp dụng vòng hòa âm I - IV - V - I', 'Sau bài này, bạn nghe và nhận biết được từng hợp âm trong vòng I-IV-V-I.', true),
  ('Hòa âm', 2, 'Giới thiệu hợp âm 7', 'Sau bài này, bạn hiểu hợp âm 7 được tạo thêm 1 nốt so với hợp âm 3.', false),
  ('Thường thức', 1, 'Thể loại dân ca', 'Sau bài này, bạn hiểu đặc điểm chung của dân ca và vai trò của nhạc cụ dân tộc.', true),
  ('Thường thức', 2, 'Thể loại nhạc nhẹ và cổ điển', 'Sau bài này, bạn phân biệt được đặc điểm cơ bản của nhạc nhẹ và nhạc cổ điển.', false)
) as l(mod_name, order_index, title, goal, is_demo_free);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Giọng thứ hòa thanh'), * from (values
  (1, 'Khác biệt với thứ tự nhiên', 'Bậc 7 của giọng thứ hòa thanh được nâng lên nửa cung so với thứ tự nhiên, tạo cảm giác "dẫn" mạnh về âm chủ hơn.', null::jsonb, null::jsonb),
  (2, 'Ví dụ: La thứ hòa thanh', 'Trong La thứ hòa thanh, nốt Sol được nâng thành Sol thăng — đây chính là dấu hóa bất thường sẽ học ở bài sau.',
     '{"kind":"accidental","note":"G","symbol":"♯"}'::jsonb, '{"type":"note","note":"G","label":"Nghe nốt Sol (gần đúng)"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Dấu hóa bất thường'), * from (values
  (1, 'Khái niệm', 'Dấu hóa đặt ngay trước 1 nốt cụ thể (không phải ở hóa biểu), chỉ ảnh hưởng nốt đó và các nốt cùng tên trong CÙNG 1 ô nhịp.',
     '{"kind":"accidental","note":"F","symbol":"♮"}'::jsonb),
  (2, 'Hết hiệu lực khi nào', 'Sang ô nhịp mới, dấu hóa bất thường tự động hết hiệu lực — nốt trở lại đúng như hóa biểu quy định.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Nốt móc kép trong thực tế'), * from (values
  (1, 'Nhắc lại', 'Nốt móc kép có giá trị 1/4 phách — 4 nốt móc kép mới bằng 1 phách.', '{"kind":"notehead","filled":true,"label":"1/4 phách"}'::jsonb),
  (2, 'Ứng dụng', 'Ở tốc độ nhanh, móc kép tạo cảm giác dồn dập, thường dùng trong đoạn cao trào của bài hát.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Chùm ba'), * from (values
  (1, 'Chùm ba là gì', '3 nốt móc đơn được gộp lại vừa khít trong thời gian bình thường chỉ đủ cho 2 nốt — nhận biết qua số "3" ở trên dấu ngoặc.',
     '{"kind":"triplet"}'::jsonb),
  (2, 'Cảm giác âm thanh', 'Chùm ba tạo cảm giác "lướt" nhẹ nhàng, khác hẳn nhịp điệu đều đặn thông thường.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Đọc nhạc 2 bè — giới thiệu'), * from (values
  (1, 'Bè trên', 'Trong bài có 2 bè, bè trên (giai điệu chính) thường ở cao độ cao hơn bè dưới.',
     '{"kind":"staff_notes","notes":["E","F","G"]}'::jsonb, '{"type":"sequence","notes":["E","F","G"],"label":"Nghe bè trên"}'::jsonb),
  (2, 'Bè dưới', 'Bè dưới (bè đệm/hòa âm) thường đi cùng lúc với bè trên, tạo chiều sâu cho bản nhạc. Ở app này minh họa đơn giản trong cùng phạm vi nốt đã học.',
     '{"kind":"staff_notes","notes":["C","D","E"]}'::jsonb, '{"type":"sequence","notes":["C","D","E"],"label":"Nghe bè dưới"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Bài tập đọc 2 bè'), * from (values
  (1, 'Luyện tập', 'Thử nghe lần lượt từng bè trước, sau đó tưởng tượng 2 bè vang lên cùng lúc.',
     '{"kind":"staff_notes","notes":["G","F","E","D"]}'::jsonb, '{"type":"sequence","notes":["G","F","E","D"],"label":"Nghe ví dụ"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Áp dụng vòng hòa âm I - IV - V - I'), * from (values
  (1, 'Hợp âm I (chủ)', 'Hợp âm Đô trưởng (C) — điểm khởi đầu và kết thúc, tạo cảm giác ổn định.',
     '{"kind":"chord","notes":["C","E","G"]}'::jsonb, '{"type":"chord","notes":["C","E","G"],"label":"Nghe hợp âm I"}'::jsonb),
  (2, 'Hợp âm IV', 'Hợp âm Fa trưởng (F) — tạo cảm giác chuyển động nhẹ ra khỏi hợp âm chủ.',
     '{"kind":"chord","notes":["F","A","C"]}'::jsonb, '{"type":"chord","notes":["F","A","C"],"label":"Nghe hợp âm IV"}'::jsonb),
  (3, 'Hợp âm V', 'Hợp âm Sol trưởng (G) — tạo cảm giác căng, cần "giải quyết" bằng cách quay về hợp âm I.',
     '{"kind":"chord","notes":["G","B","D"]}'::jsonb, '{"type":"chord","notes":["G","B","D"],"label":"Nghe hợp âm V"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Giới thiệu hợp âm 7'), * from (values
  (1, 'Cấu tạo hợp âm 7', 'Thêm 1 nốt quãng 7 vào hợp âm 3 — ví dụ hợp âm G7 gồm Sol - Si - Rê - Fa.',
     '{"kind":"chord","notes":["G","B","D","F"]}'::jsonb, '{"type":"chord","notes":["G","B","D","F"],"label":"Nghe hợp âm G7"}'::jsonb),
  (2, 'Cảm giác âm thanh', 'Hợp âm 7 tạo cảm giác "cần giải quyết" rất mạnh — thường xuất hiện ngay trước khi quay về hợp âm chủ.', null, null)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Thể loại dân ca'), * from (values
  (1, 'Đặc điểm dân ca', 'Dân ca thường được truyền miệng qua nhiều thế hệ, giai điệu gắn liền với đời sống lao động, sinh hoạt vùng miền.',
     '{"kind":"instrument_icon","name":"dan_tranh"}'::jsonb, '{"type":"timbre","name":"dan_tranh","label":"Nghe âm đàn tranh"}'::jsonb),
  (2, 'Nhạc cụ gắn liền với dân ca', 'Đàn tranh, đàn bầu, sáo trúc là những nhạc cụ dân tộc thường xuất hiện trong dân ca Việt Nam.', null, null)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Thể loại nhạc nhẹ và cổ điển'), * from (values
  (1, 'Nhạc nhẹ', 'Giai điệu dễ nhớ, phối khí hiện đại, thường dùng nhạc cụ điện tử hoặc guitar, trống.',
     '{"kind":"instrument_icon","name":"guitar"}'::jsonb, '{"type":"timbre","name":"guitar","label":"Nghe âm guitar"}'::jsonb),
  (2, 'Nhạc cổ điển', 'Cấu trúc chặt chẽ, thường viết cho dàn nhạc lớn hoặc độc tấu piano, violin — đòi hỏi kỹ thuật biểu diễn cao.',
     '{"kind":"instrument_icon","name":"violin"}'::jsonb, '{"type":"timbre","name":"violin","label":"Nghe âm violin"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into concepts (module_id, term, sub, audio_note, icon_index)
select (select id from modules where level_id=(select id from levels where name='Nâng cao 1') and name=c.mod_name), c.term, c.sub, c.audio_note, c.icon_index
from (values
  ('Nhạc lý','Thứ hòa thanh','bậc 7 nâng nửa cung',null,3),
  ('Nhạc lý','Dấu hóa bất thường','hiệu lực trong 1 ô nhịp',null,3),
  ('Tiết tấu','Móc kép','1/4 phách',null,6),
  ('Tiết tấu','Chùm ba','3 nốt trong 1 phách',null,10),
  ('Xướng âm','Bè trên - bè dưới','2 bè cùng lúc','E',7),
  ('Hòa âm','Vòng I-IV-V-I','ứng dụng thực tế',null,10),
  ('Hòa âm','Hợp âm 7','hợp âm 3 + 1 nốt',null,10),
  ('Thường thức','Dân ca','gắn với nhạc cụ dân tộc',null,11),
  ('Thường thức','Nhạc nhẹ - Cổ điển','2 thể loại phổ biến',null,11)
) as c(mod_name, term, sub, audio_note, icon_index);

insert into questions (level_id, type, question_text, options, correct_answer)
select (select id from levels where name='Nâng cao 1'), * from (values
  ('mc','Giọng thứ hòa thanh khác thứ tự nhiên ở điểm nào?','["Bậc 3 hạ nửa cung","Bậc 7 nâng nửa cung","Bậc 5 nâng nửa cung","Không khác gì cả"]'::jsonb,'Bậc 7 nâng nửa cung'),
  ('mc','Dấu hóa bất thường có hiệu lực trong phạm vi nào?','["Cả bài hát","Cả trang nhạc","1 ô nhịp","1 câu nhạc"]'::jsonb,'1 ô nhịp'),
  ('mc','Nốt móc kép có giá trị bao nhiêu phách?','["1/2 phách","1/4 phách","1 phách","2 phách"]'::jsonb,'1/4 phách'),
  ('match','Chùm ba là gì?','["3 nốt trong thời gian bình thường của 2 nốt","3 nốt trong 3 phách","3 ô nhịp liên tiếp","3 bè cùng lúc"]'::jsonb,'3 nốt trong thời gian bình thường của 2 nốt'),
  ('mc','Trong bản nhạc 2 bè, bè nào thường mang giai điệu chính?','["Bè dưới","Bè trên","Cả 2 bè như nhau","Không bè nào"]'::jsonb,'Bè trên'),
  ('match','Trong vòng I-IV-V-I, hợp âm nào tạo cảm giác căng cần giải quyết?','["I","IV","V","Không hợp âm nào"]'::jsonb,'V'),
  ('mc','Hợp âm 7 được tạo ra bằng cách nào?','["Bớt 1 nốt khỏi hợp âm 3","Thêm 1 nốt quãng 7 vào hợp âm 3","Đổi tất cả các nốt","Nhân đôi hợp âm 3"]'::jsonb,'Thêm 1 nốt quãng 7 vào hợp âm 3'),
  ('mc','G7 gồm những nốt nào?','["Sol - Si - Rê - Fa","Sol - Si - Rê","Đô - Mi - Sol - Si","Fa - La - Đô - Mi"]'::jsonb,'Sol - Si - Rê - Fa'),
  ('match','Nhạc cụ nào KHÔNG phải nhạc cụ dân tộc Việt Nam?','["Đàn tranh","Đàn bầu","Sáo trúc","Guitar điện"]'::jsonb,'Guitar điện'),
  ('mc','Nhạc cổ điển thường có đặc điểm gì?','["Cấu trúc lỏng lẻo, ngẫu hứng","Cấu trúc chặt chẽ, kỹ thuật cao","Chỉ dùng nhạc cụ điện tử","Không cần luyện tập nhiều"]'::jsonb,'Cấu trúc chặt chẽ, kỹ thuật cao')
) as q(type, question_text, options, correct_answer);

-- 2 giai điệu thực hành cho Nâng cao 1
insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Nâng cao 1'), 1, 'Hòa âm dạo khúc',
'[[{"note":"C","dur":1},{"note":"E","dur":1}],[{"note":"G","dur":1},{"note":"F","dur":1}],[{"note":"A","dur":2}],[{"note":"G","dur":1},{"note":"F","dur":1}],[{"note":"E","dur":1},{"note":"D","dur":1}],[{"note":"G","dur":2}],[{"note":"B","dur":1},{"note":"D","dur":1}],[{"note":"C","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Nâng cao 1'), 2, 'Câu chuyện hai bè',
'[[{"note":"E","dur":1},{"note":"F","dur":1}],[{"note":"G","dur":1},{"note":"E","dur":1}],[{"note":"C","dur":2}],[{"note":"D","dur":1},{"note":"E","dur":1}],[{"note":"F","dur":1},{"note":"D","dur":1}],[{"note":"C","dur":2}],[{"note":"E","dur":1},{"note":"G","dur":1}],[{"note":"C","dur":2}]]'::jsonb;
