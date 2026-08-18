-- ============================================================
-- SEED DU LIEU: NANG CAO 2 — ứng dụng thực tế
-- Chạy SAU khi đã chạy seed_nang_cao_1.sql
-- ============================================================

insert into modules (level_id, name, order_index)
select id, m.name, m.order_index from levels,
  (values ('Nhạc lý',1), ('Tiết tấu',2), ('Xướng âm',3), ('Hòa âm',4), ('Thường thức',5)) as m(name, order_index)
where levels.name = 'Nâng cao 2';

insert into lessons (module_id, order_index, title, goal, is_demo_free)
select (select id from modules where level_id = (select id from levels where name='Nâng cao 2') and name = l.mod_name),
       l.order_index, l.title, l.goal, l.is_demo_free
from (values
  ('Nhạc lý', 1, 'Hóa biểu 2 dấu hóa', 'Sau bài này, bạn nhận biết hóa biểu 2 dấu thăng của giọng Rê trưởng.', true),
  ('Nhạc lý', 2, 'Quãng thuận và quãng nghịch', 'Sau bài này, bạn phân biệt được quãng nghe êm tai (thuận) và quãng nghe căng (nghịch).', false),
  ('Tiết tấu', 1, 'Nhịp 5/4 (tham khảo)', 'Sau bài này, bạn nhận biết nhịp 5/4 — loại nhịp lẻ ít gặp nhưng rất đặc biệt.', true),
  ('Tiết tấu', 2, 'Nhịp 7/8 (tham khảo)', 'Sau bài này, bạn nhận biết nhịp 7/8 — thường gặp trong nhạc dân gian nhiều nước.', false),
  ('Xướng âm', 1, 'Đọc nhạc 2 bè nâng cao', 'Sau bài này, bạn đọc được 2 bè có hướng đi giai điệu ngược nhau.', true),
  ('Xướng âm', 2, 'Bài tập 2 bè có tiết tấu khác nhau', 'Sau bài này, bạn xử lý được tình huống 2 bè không cùng tiết tấu.', false),
  ('Hòa âm', 1, 'Ký hiệu hợp âm trên lời bài hát', 'Sau bài này, bạn đọc hiểu được ký hiệu hợp âm ghi phía trên lời bài hát.', true),
  ('Hòa âm', 2, 'Ứng dụng đệm hát cơ bản', 'Sau bài này, bạn biết 1 vòng hợp âm đệm hát rất phổ biến trong nhạc hiện đại.', false),
  ('Thường thức', 1, 'Đàn tranh và đàn bầu', 'Sau bài này, bạn hiểu sâu hơn về cách chơi và âm sắc của đàn tranh, đàn bầu.', true),
  ('Thường thức', 2, 'Sáo trúc', 'Sau bài này, bạn hiểu vai trò của sáo trúc trong dàn nhạc dân tộc.', false)
) as l(mod_name, order_index, title, goal, is_demo_free);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Hóa biểu 2 dấu hóa'), * from (values
  (1, 'Giọng Rê trưởng', 'Rê trưởng có 2 dấu thăng: Fa♯ và Đô♯ — nhiều dấu hóa hơn nghĩa là giọng "xa" Đô trưởng hơn.',
     '{"kind":"key_signature","items":[{"note":"F","sym":"♯"},{"note":"C","sym":"♯"}]}'::jsonb),
  (2, 'Quy luật thêm dấu thăng', 'Mỗi giọng trưởng mới thường thêm đúng 1 dấu thăng nữa so với giọng liền trước theo 1 trật tự cố định.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Quãng thuận và quãng nghịch'), * from (values
  (1, 'Quãng thuận', 'Quãng 5 (Đô-Sol) nghe êm, "chắc", ổn định — đây là quãng thuận điển hình.',
     '{"kind":"interval","noteA":"C","noteB":"G","label":"Quãng 5 - Thuận"}'::jsonb, '{"type":"sequence","notes":["C","G"],"label":"Nghe quãng thuận"}'::jsonb),
  (2, 'Quãng nghịch', 'Quãng 7 (Đô-Si) nghe căng, tạo cảm giác "cần giải quyết" — đây là quãng nghịch điển hình.',
     '{"kind":"interval","noteA":"C","noteB":"B","label":"Quãng 7 - Nghịch"}'::jsonb, '{"type":"sequence","notes":["C","B"],"label":"Nghe quãng nghịch"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Nhịp 5/4 (tham khảo)'), * from (values
  (1, 'Số chỉ nhịp 5/4', 'Mỗi ô nhịp có 5 phách — thuộc nhóm "nhịp lẻ", ít gặp hơn nhiều so với 2/4, 3/4, 4/4.', '{"kind":"meter","num":5,"den":4}'::jsonb),
  (2, 'Cách cảm nhận', 'Thường được nhóm thành 3+2 hoặc 2+3 phách để dễ đếm hơn là đếm đều cả 5.', '{"kind":"beat_strip","pattern":[2,1,1,2,1]}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Nhịp 7/8 (tham khảo)'), * from (values
  (1, 'Số chỉ nhịp 7/8', 'Mỗi ô nhịp có 7 phách đơn — cũng là 1 loại nhịp lẻ, hay gặp trong dân ca vùng Balkan, Trung Đông.', '{"kind":"meter","num":7,"den":8}'::jsonb),
  (2, 'Cách nhóm phổ biến', 'Thường nhóm 2+2+3 phách đơn — tạo cảm giác "vấp nhẹ" rất đặc trưng, khó nhầm với nhịp chẵn.', '{"kind":"beat_strip","pattern":[2,1,2,1,2,1,1]}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Đọc nhạc 2 bè nâng cao'), * from (values
  (1, 'Bè trên đi lên', 'Trong khi bè trên đi lên...',
     '{"kind":"staff_notes","notes":["C","D","E","G"]}'::jsonb, '{"type":"sequence","notes":["C","D","E","G"],"label":"Nghe bè trên"}'::jsonb),
  (2, 'Bè dưới đi ngược lại', '...bè dưới có thể đi xuống hoặc đứng yên, tạo chuyển động "ngược chiều" (nghịch hành) — kỹ thuật rất hay dùng trong hòa âm.',
     '{"kind":"staff_notes","notes":["E","D","C","C"]}'::jsonb, '{"type":"sequence","notes":["E","D","C","C"],"label":"Nghe bè dưới"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Bài tập 2 bè có tiết tấu khác nhau'), * from (values
  (1, 'Khi 2 bè không cùng nhịp điệu', 'Bè trên có thể ngân dài trong khi bè dưới di chuyển nhanh hơn (hoặc ngược lại) — đây là kỹ thuật tạo sự thú vị trong hòa âm.', '{"kind":"icon","index":8}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Ký hiệu hợp âm trên lời bài hát'), * from (values
  (1, 'Cách ghi phổ biến', 'Tên hợp âm (ví dụ "C", "Am", "F", "G") thường được ghi ngay phía trên chữ, tại đúng vị trí cần đổi hợp âm khi đệm đàn.', '{"kind":"progression","chords":["C","Am","F","G"]}'::jsonb),
  (2, 'Vì sao hữu ích', 'Người đệm đàn chỉ cần nhìn ký hiệu hợp âm, không cần đọc hết bản nhạc phức tạp.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Ứng dụng đệm hát cơ bản'), * from (values
  (1, 'Vòng hợp âm rất phổ biến', 'Vòng C - G - Am - F (bậc I-V-vi-IV) xuất hiện trong cực kỳ nhiều bài hát hiện đại ở mọi thể loại.',
     '{"kind":"progression","chords":["C","G","Am","F"]}'::jsonb, '{"type":"chord","notes":["A","C","E"],"label":"Nghe hợp âm Am"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Đàn tranh và đàn bầu'), * from (values
  (1, 'Đàn tranh', 'Nhạc cụ dây gảy, có nhiều dây căng trên thân đàn dài, âm thanh trong trẻo, thường dùng ngón tay hoặc móng gảy.',
     '{"kind":"instrument_icon","name":"dan_tranh"}'::jsonb, '{"type":"timbre","name":"dan_tranh","label":"Nghe âm đàn tranh"}'::jsonb),
  (2, 'Đàn bầu', 'Chỉ có DUY NHẤT 1 dây, nhưng nhờ cần đàn uốn được nên tạo ra âm thanh luyến láy rất đặc biệt, khó nhạc cụ nào bắt chước được.',
     '{"kind":"instrument_icon","name":"dan_bau"}'::jsonb, '{"type":"timbre","name":"dan_bau","label":"Nghe âm đàn bầu"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Sáo trúc'), * from (values
  (1, 'Cấu tạo', 'Làm từ ống trúc rỗng, có các lỗ bấm để thay đổi cao độ, thổi hơi qua 1 lỗ để tạo âm thanh.',
     '{"kind":"instrument_icon","name":"sao_truc"}'::jsonb, '{"type":"timbre","name":"sao_truc","label":"Nghe âm sáo trúc"}'::jsonb),
  (2, 'Vai trò trong dàn nhạc', 'Thường đảm nhiệm giai điệu chính hoặc solo, âm sắc trong trẻo dễ nhận ra giữa dàn nhạc dân tộc.', null, null)
) as p(order_index, heading, body, media, audio);

insert into concepts (module_id, term, sub, audio_note, icon_index)
select (select id from modules where level_id=(select id from levels where name='Nâng cao 2') and name=c.mod_name), c.term, c.sub, c.audio_note, c.icon_index
from (values
  ('Nhạc lý','Rê trưởng','2 dấu thăng (Fa♯, Đô♯)',null,3),
  ('Nhạc lý','Quãng thuận','êm tai, ổn định (VD quãng 5)','G',1),
  ('Nhạc lý','Quãng nghịch','căng, cần giải quyết (VD quãng 7)','B',2),
  ('Tiết tấu','Nhịp 5/4','5 phách, nhóm 3+2',null,5),
  ('Tiết tấu','Nhịp 7/8','7 phách đơn, nhóm 2+2+3',null,5),
  ('Xướng âm','Nghịch hành','2 bè đi ngược chiều nhau',null,8),
  ('Hòa âm','Ký hiệu hợp âm','ghi phía trên lời bài hát',null,10),
  ('Hòa âm','C-G-Am-F','vòng đệm hát rất phổ biến',null,10),
  ('Thường thức','Đàn tranh','nhạc cụ dây gảy nhiều dây',null,11),
  ('Thường thức','Đàn bầu','1 dây, luyến láy đặc biệt',null,11),
  ('Thường thức','Sáo trúc','thổi hơi, giai điệu chính',null,11)
) as c(mod_name, term, sub, audio_note, icon_index);

insert into questions (level_id, type, question_text, options, correct_answer)
select (select id from levels where name='Nâng cao 2'), * from (values
  ('mc','Giọng Rê trưởng có hóa biểu như thế nào?','["1 dấu thăng","2 dấu thăng (Fa♯, Đô♯)","1 dấu giáng","2 dấu giáng"]'::jsonb,'2 dấu thăng (Fa♯, Đô♯)'),
  ('match','Quãng 5 (Đô-Sol) là quãng thuận hay nghịch?','["Thuận","Nghịch","Không xác định","Tùy ngữ cảnh"]'::jsonb,'Thuận'),
  ('match','Quãng 7 (Đô-Si) là quãng thuận hay nghịch?','["Thuận","Nghịch","Không xác định","Tùy ngữ cảnh"]'::jsonb,'Nghịch'),
  ('mc','Nhịp 5/4 có bao nhiêu phách mỗi ô nhịp?','["4 phách","5 phách","6 phách","7 phách"]'::jsonb,'5 phách'),
  ('mc','Nhịp 7/8 thường được nhóm theo cách nào?','["2+2+3","3+3+1","Đều cả 7","4+3"]'::jsonb,'2+2+3'),
  ('mc','Nghịch hành trong 2 bè nghĩa là gì?','["2 bè cùng đi lên","2 bè đi ngược chiều nhau","2 bè cùng đứng yên","2 bè cùng tiết tấu"]'::jsonb,'2 bè đi ngược chiều nhau'),
  ('mc','Ký hiệu hợp âm trên lời bài hát dùng để làm gì?','["Trang trí bản nhạc","Giúp người đệm đàn biết đổi hợp âm ở đâu","Thay thế lời bài hát","Không có tác dụng gì"]'::jsonb,'Giúp người đệm đàn biết đổi hợp âm ở đâu'),
  ('mc','Vòng hợp âm C-G-Am-F có đặc điểm gì?','["Rất hiếm gặp","Xuất hiện trong rất nhiều bài hát hiện đại","Chỉ dùng trong nhạc cổ điển","Không thể đệm hát được"]'::jsonb,'Xuất hiện trong rất nhiều bài hát hiện đại'),
  ('mc','Đàn bầu có bao nhiêu dây?','["1 dây","2 dây","4 dây","6 dây"]'::jsonb,'1 dây'),
  ('match','Sáo trúc tạo âm thanh bằng cách nào?','["Gảy dây","Gõ vào mặt trống","Thổi hơi qua lỗ","Kéo cung"]'::jsonb,'Thổi hơi qua lỗ')
) as q(type, question_text, options, correct_answer);

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Nâng cao 2'), 1, 'Điệu dân ca mô phỏng',
'[[{"note":"D","dur":1},{"note":"E","dur":1}],[{"note":"G","dur":1},{"note":"E","dur":1}],[{"note":"D","dur":2}],[{"note":"C","dur":1},{"note":"D","dur":1}],[{"note":"E","dur":1},{"note":"D","dur":1}],[{"note":"C","dur":2}],[{"note":"D","dur":1},{"note":"G","dur":1}],[{"note":"D","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Nâng cao 2'), 2, 'Đệm hát vòng C-G-Am-F',
'[[{"note":"C","dur":1},{"note":"E","dur":1}],[{"note":"G","dur":1},{"note":"B","dur":1}],[{"note":"A","dur":2}],[{"note":"F","dur":1},{"note":"A","dur":1}],[{"note":"C","dur":1},{"note":"D","dur":1}],[{"note":"E","dur":2}],[{"note":"G","dur":1},{"note":"E","dur":1}],[{"note":"C","dur":2}]]'::jsonb;
