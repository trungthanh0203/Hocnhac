-- ============================================================
-- SEED DU LIEU: TRUNG CAP 2 — mở rộng quãng, giọng thứ, hợp âm thứ
-- Chạy SAU khi đã chạy seed_trung_cap_1.sql
-- ============================================================

insert into modules (level_id, name, order_index)
select id, m.name, m.order_index from levels,
  (values ('Nhạc lý',1), ('Tiết tấu',2), ('Xướng âm',3), ('Hòa âm',4), ('Thường thức',5)) as m(name, order_index)
where levels.name = 'Trung cấp 2';

insert into lessons (module_id, order_index, title, goal, is_demo_free)
select (select id from modules where level_id = (select id from levels where name='Trung cấp 2') and name = l.mod_name),
       l.order_index, l.title, l.goal, l.is_demo_free
from (values
  ('Nhạc lý', 1, 'Quãng 4 và Quãng 5', 'Sau bài này, bạn nhận biết và nghe được quãng 4 và quãng 5.', true),
  ('Nhạc lý', 2, 'Quãng 6, 7, 8', 'Sau bài này, bạn nhận biết được các quãng rộng: quãng 6, quãng 7 và quãng 8.', true),
  ('Nhạc lý', 3, 'Giọng La thứ tự nhiên', 'Sau bài này, bạn hiểu giọng La thứ là giọng song song với Đô trưởng.', false),
  ('Tiết tấu', 1, 'Đảo phách nâng cao', 'Sau bài này, bạn đọc được các mẫu đảo phách phức tạp hơn mức cơ bản.', true),
  ('Tiết tấu', 2, 'Ôn tập nhịp 6/8', 'Sau bài này, bạn tự tin đọc tiết tấu trong nhịp 6/8 ở mức nâng cao hơn.', false),
  ('Xướng âm', 1, 'Xướng âm giọng La thứ', 'Sau bài này, bạn xướng âm được gam La thứ tự nhiên.', true),
  ('Xướng âm', 2, 'Bài tập quãng 4 - 5', 'Sau bài này, bạn xướng âm chính xác khi giai điệu nhảy quãng 4 hoặc quãng 5.', false),
  ('Hòa âm', 1, 'Hợp âm thứ — La thứ (Am)', 'Sau bài này, bạn hiểu cấu tạo và nhận biết được hợp âm La thứ.', true),
  ('Hòa âm', 2, 'So sánh hợp âm trưởng và thứ', 'Sau bài này, bạn phân biệt được cảm giác âm thanh của hợp âm trưởng và hợp âm thứ.', false),
  ('Thường thức', 1, 'Cấu trúc bài hát: đoạn, câu, tiết nhạc', 'Sau bài này, bạn hiểu 1 bài hát được chia thành đoạn, câu, tiết nhạc như thế nào.', true)
) as l(mod_name, order_index, title, goal, is_demo_free);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Quãng 4 và Quãng 5'), * from (values
  (1, 'Quãng 4', 'Hai nốt cách nhau 2 nốt ở giữa (ví dụ Đô-Fa) tạo thành quãng 4.',
     '{"kind":"interval","noteA":"C","noteB":"F","label":"Quãng 4"}'::jsonb, '{"type":"sequence","notes":["C","F"],"label":"Nghe quãng 4"}'::jsonb),
  (2, 'Quãng 5', 'Hai nốt cách nhau 3 nốt ở giữa (ví dụ Đô-Sol) tạo thành quãng 5 — nghe rất "chắc" và ổn định.',
     '{"kind":"interval","noteA":"C","noteB":"G","label":"Quãng 5"}'::jsonb, '{"type":"sequence","notes":["C","G"],"label":"Nghe quãng 5"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Quãng 6, 7, 8'), * from (values
  (1, 'Quãng 6', 'Đô-La tạo thành quãng 6 — rộng hơn quãng 5 một bậc.',
     '{"kind":"interval","noteA":"C","noteB":"A","label":"Quãng 6"}'::jsonb, '{"type":"sequence","notes":["C","A"],"label":"Nghe quãng 6"}'::jsonb),
  (2, 'Quãng 7', 'Đô-Si tạo thành quãng 7 — quãng rộng gần nhất trước khi lặp lại tên nốt.',
     '{"kind":"interval","noteA":"C","noteB":"B","label":"Quãng 7"}'::jsonb, '{"type":"sequence","notes":["C","B"],"label":"Nghe quãng 7"}'::jsonb),
  (3, 'Quãng 8', 'Khi đi đủ 7 bậc, tên nốt lặp lại (Đô thấp - Đô cao) — đây chính là quãng 8, quãng rộng nhất trong 1 vòng nốt.',
     '{"kind":"icon","index":1}'::jsonb, null::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Giọng La thứ tự nhiên'), * from (values
  (1, 'Giọng song song với Đô trưởng', 'La thứ tự nhiên dùng đúng 7 nốt tự nhiên giống Đô trưởng (không hóa biểu), chỉ khác âm chủ — vì vậy gọi là "giọng song song".',
     '{"kind":"key_signature","items":[]}'::jsonb, null::jsonb),
  (2, 'Âm chủ La', 'Thay vì xoay quanh nốt Đô như giọng trưởng, giọng La thứ xoay quanh nốt La — nghe trầm và sâu lắng hơn.',
     '{"kind":"staff_notes","notes":["A"]}'::jsonb, '{"type":"note","note":"A","label":"Nghe âm chủ La"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Đảo phách nâng cao'), * from (values
  (1, 'Mẫu đảo phách phức tạp hơn', 'Trọng âm có thể rơi vào nhiều vị trí bất ngờ hơn mức cơ bản, tạo cảm giác tiết tấu sinh động, hiện đại.',
     '{"kind":"beat_strip","pattern":[1,2,1,2]}'::jsonb, '{"type":"click","pattern":[0,1,0,1],"label":"Nghe đảo phách"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Ôn tập nhịp 6/8'), * from (values
  (1, 'Luyện tập nâng cao', 'Ôn lại cảm giác 2 nhóm 3 phách đơn của nhịp 6/8, áp dụng vào các câu tiết tấu phức tạp hơn.',
     '{"kind":"beat_strip","pattern":[2,1,1,2,1,1]}'::jsonb, '{"type":"click","pattern":[1,0,0,1,0,0],"label":"Nghe nhịp 6/8"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Xướng âm giọng La thứ'), * from (values
  (1, 'Gam La thứ tự nhiên', 'Xướng âm từ La lên đến La cao, dùng đúng 7 nốt tự nhiên như giọng Đô trưởng nhưng bắt đầu và kết ở La.',
     '{"kind":"staff_notes","notes":["A","B","C","D","E","F","G","A"]}'::jsonb, '{"type":"sequence","notes":["A","B","C","D","E","F","G","A"],"label":"Nghe gam La thứ"}'::jsonb),
  (2, 'Cảm giác giọng thứ', 'So với giọng trưởng nghe tươi sáng, giọng thứ thường mang cảm giác trầm lắng, sâu sắc hơn.', null, null)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Bài tập quãng 4 - 5'), * from (values
  (1, 'Luyện nhảy quãng 4-5', 'Thử xướng âm câu nhạc nhảy quãng 4 rồi quãng 5 liên tiếp — cần nghe kỹ trước khi hát để lấy đúng cao độ.',
     '{"kind":"staff_notes","notes":["C","F","C","G"]}'::jsonb, '{"type":"sequence","notes":["C","F","C","G"],"label":"Nghe ví dụ"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Hợp âm thứ — La thứ (Am)'), * from (values
  (1, 'Cấu tạo hợp âm Am', 'Hợp âm La thứ gồm 3 nốt: La - Đô - Mi.',
     '{"kind":"chord","notes":["A","C","E"]}'::jsonb, '{"type":"chord","notes":["A","C","E"],"label":"Nghe hợp âm Am"}'::jsonb),
  (2, 'Cảm giác âm thanh', 'Hợp âm thứ thường nghe buồn, sâu lắng hơn hợp âm trưởng — dù chỉ khác 1 nốt ở giữa.', null, null)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'So sánh hợp âm trưởng và thứ'), * from (values
  (1, 'C trưởng và La thứ', 'Cả 2 hợp âm chia sẻ 2 nốt chung (Mi, Sol/Đô) nhưng nốt còn lại khác nhau, tạo màu sắc âm thanh hoàn toàn khác.',
     '{"kind":"progression","chords":["C","Am"]}'::jsonb, null::jsonb),
  (2, 'Thử tự nghe so sánh', 'Bấm nghe lần lượt 2 hợp âm để cảm nhận rõ sự khác biệt giữa trưởng và thứ.', null,
     '{"type":"chord","notes":["C","E","G"],"label":"Nghe hợp âm C"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Cấu trúc bài hát: đoạn, câu, tiết nhạc'), * from (values
  (1, 'Tiết nhạc - Câu - Đoạn', 'Nhiều nốt ghép thành 1 tiết nhạc, nhiều tiết nhạc ghép thành 1 câu nhạc, nhiều câu ghép thành 1 đoạn — giống như chữ, câu, đoạn văn.',
     '{"kind":"icon","index":8}'::jsonb),
  (2, 'Vì sao cần biết cấu trúc', 'Hiểu cấu trúc giúp bạn "đọc hiểu" bài hát nhanh hơn, biết chỗ nào nên nghỉ lấy hơi khi hát.', null)
) as p(order_index, heading, body, media);

insert into concepts (module_id, term, sub, audio_note, icon_index)
select (select id from modules where level_id=(select id from levels where name='Trung cấp 2') and name=c.mod_name), c.term, c.sub, c.audio_note, c.icon_index
from (values
  ('Nhạc lý','Quãng 4','Đô-Fa','F',1),
  ('Nhạc lý','Quãng 5','Đô-Sol','G',2),
  ('Nhạc lý','Quãng 6-7-8','các quãng rộng',null,1),
  ('Nhạc lý','Giọng La thứ','song song với Đô trưởng','A',0),
  ('Tiết tấu','Đảo phách nâng cao','trọng âm bất ngờ',null,10),
  ('Xướng âm','Gam La thứ','7 nốt tự nhiên từ La','A',7),
  ('Hòa âm','Hợp âm Am','La-Đô-Mi',null,10),
  ('Hòa âm','Trưởng vs Thứ','màu sắc âm thanh khác nhau',null,10),
  ('Thường thức','Câu nhạc','nhiều tiết nhạc ghép lại',null,8),
  ('Thường thức','Đoạn nhạc','nhiều câu ghép lại',null,8)
) as c(mod_name, term, sub, audio_note, icon_index);

insert into questions (level_id, type, question_text, options, correct_answer)
select (select id from levels where name='Trung cấp 2'), * from (values
  ('mc','Đô và Fa cách nhau quãng mấy?','["Quãng 3","Quãng 4","Quãng 5","Quãng 6"]'::jsonb,'Quãng 4'),
  ('mc','Đô và Sol cách nhau quãng mấy?','["Quãng 4","Quãng 5","Quãng 6","Quãng 7"]'::jsonb,'Quãng 5'),
  ('mc','Quãng 8 xảy ra khi nào?','["2 nốt liền bậc","2 nốt cùng tên, khác quãng cao thấp","2 nốt bất kỳ","Không có quy tắc"]'::jsonb,'2 nốt cùng tên, khác quãng cao thấp'),
  ('match','Giọng La thứ tự nhiên có hóa biểu như thế nào?','["1 dấu thăng","1 dấu giáng","Không có dấu hóa nào","2 dấu giáng"]'::jsonb,'Không có dấu hóa nào'),
  ('mc','Âm chủ của giọng La thứ là nốt nào?','["Đô","Rê","La","Sol"]'::jsonb,'La'),
  ('mc','Hợp âm La thứ (Am) gồm những nốt nào?','["La - Đô - Mi","La - Rê - Fa","Đô - Mi - Sol","La - Si - Đô"]'::jsonb,'La - Đô - Mi'),
  ('match','Hợp âm thứ thường tạo cảm giác âm thanh như thế nào?','["Buồn, sâu lắng","Vui tươi, sáng sủa","Không có cảm giác gì đặc biệt","Luôn nghe giống hợp âm trưởng"]'::jsonb,'Buồn, sâu lắng'),
  ('mc','Đơn vị nhỏ nhất trong cấu trúc bài hát (nhiều nốt ghép lại) gọi là gì?','["Đoạn nhạc","Câu nhạc","Tiết nhạc","Chương nhạc"]'::jsonb,'Tiết nhạc'),
  ('match','Thứ tự đúng từ nhỏ đến lớn trong cấu trúc bài hát là gì?','["Tiết nhạc - Câu nhạc - Đoạn nhạc","Câu nhạc - Tiết nhạc - Đoạn nhạc","Đoạn nhạc - Câu nhạc - Tiết nhạc","Không có thứ tự cố định"]'::jsonb,'Tiết nhạc - Câu nhạc - Đoạn nhạc'),
  ('mc','C trưởng và La thứ có điểm gì chung?','["Cùng hóa biểu (không dấu hóa)","Cùng âm chủ","Cùng cảm giác âm thanh","Không có điểm chung nào"]'::jsonb,'Cùng hóa biểu (không dấu hóa)')
) as q(type, question_text, options, correct_answer);
