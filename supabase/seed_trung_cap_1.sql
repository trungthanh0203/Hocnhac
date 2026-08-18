-- ============================================================
-- SEED DU LIEU: TRUNG CAP 1 — bước vào quãng, giọng, hợp âm
-- Chạy SAU khi đã chạy seed_so_cap_3.sql (và nên chạy sau patch_so_cap_2_3_images.sql)
-- Có thêm module mới "Hòa âm" — lần đầu xuất hiện từ cấp này
-- ============================================================

insert into modules (level_id, name, order_index)
select id, m.name, m.order_index from levels,
  (values ('Nhạc lý',1), ('Tiết tấu',2), ('Xướng âm',3), ('Hòa âm',4), ('Thường thức',5)) as m(name, order_index)
where levels.name = 'Trung cấp 1';

insert into lessons (module_id, order_index, title, goal, is_demo_free)
select (select id from modules where level_id = (select id from levels where name='Trung cấp 1') and name = l.mod_name),
       l.order_index, l.title, l.goal, l.is_demo_free
from (values
  ('Nhạc lý', 1, 'Quãng là gì — Quãng 2', 'Sau bài này, bạn hiểu khái niệm quãng và nhận biết được quãng 2.', true),
  ('Nhạc lý', 2, 'Quãng 3', 'Sau bài này, bạn nhận biết và nghe được sự khác biệt giữa quãng 2 và quãng 3.', true),
  ('Nhạc lý', 3, 'Giới thiệu hóa biểu', 'Sau bài này, bạn hiểu hóa biểu là gì và vì sao mỗi giọng có hóa biểu riêng.', false),
  ('Tiết tấu', 1, 'Nhịp 6/8 (giới thiệu)', 'Sau bài này, bạn nhận biết đặc trưng "đung đưa" của nhịp 6/8.', true),
  ('Tiết tấu', 2, 'Tiết tấu chấm dôi kết hợp móc đơn', 'Sau bài này, bạn đọc được 1 câu tiết tấu có cả nốt chấm dôi và móc đơn.', false),
  ('Xướng âm', 1, 'Xướng âm gam Đô trưởng đầy đủ', 'Sau bài này, bạn xướng âm trôi chảy cả gam Đô trưởng đi lên và đi xuống.', true),
  ('Xướng âm', 2, 'Bài tập nhảy quãng 3', 'Sau bài này, bạn xướng âm chính xác khi giai điệu nhảy quãng 3 thay vì đi liền bậc.', false),
  ('Hòa âm', 1, 'Hợp âm 3 là gì', 'Sau bài này, bạn hiểu hợp âm 3 được tạo thành từ 3 nốt xếp chồng như thế nào.', true),
  ('Hòa âm', 2, 'Hợp âm Đô trưởng (C)', 'Sau bài này, bạn nhận biết và nghe được hợp âm Đô trưởng.', false),
  ('Thường thức', 1, 'Nhạc sĩ Việt Nam tiêu biểu', 'Sau bài này, bạn biết thêm về những nhạc sĩ có đóng góp lớn cho nhạc thiếu nhi Việt Nam.', true)
) as l(mod_name, order_index, title, goal, is_demo_free);

-- LESSON POINTS
insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Quãng là gì — Quãng 2'), * from (values
  (1, 'Quãng là gì', 'Khoảng cách về cao độ giữa 2 nốt nhạc, được tính bằng số bậc (tên nốt) cách nhau, kể cả 2 nốt đầu-cuối.',
     '{"kind":"interval","noteA":"C","noteB":"D","label":"Quãng 2"}'::jsonb, '{"type":"sequence","notes":["C","D"],"label":"Nghe quãng 2"}'::jsonb),
  (2, 'Quãng 2 là gì', 'Hai nốt liền bậc nhau (ví dụ Đô-Rê, Rê-Mi) tạo thành quãng 2 — quãng hẹp nhất, nghe rất gần gũi.', null, null)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Quãng 3'), * from (values
  (1, 'Quãng 3 là gì', 'Hai nốt cách nhau 1 nốt ở giữa (ví dụ Đô-Mi, bỏ qua Rê) tạo thành quãng 3 — nghe rộng và "mở" hơn quãng 2.',
     '{"kind":"interval","noteA":"C","noteB":"E","label":"Quãng 3"}'::jsonb, '{"type":"sequence","notes":["C","E"],"label":"Nghe quãng 3"}'::jsonb),
  (2, 'Ví dụ khác', 'Quãng 3 không nhất thiết phải bắt đầu từ Đô — ví dụ Rê-Fa cũng là 1 quãng 3.',
     '{"kind":"interval","noteA":"D","noteB":"F","label":"Quãng 3"}'::jsonb, '{"type":"sequence","notes":["D","F"],"label":"Nghe ví dụ"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Giới thiệu hóa biểu'), * from (values
  (1, 'Hóa biểu là gì', 'Các dấu thăng/giáng đặt ngay sau khóa Sol, có hiệu lực với TẤT CẢ các nốt cùng tên trong suốt bản nhạc.',
     '{"kind":"key_signature","items":[{"note":"F","sym":"♯"}]}'::jsonb),
  (2, 'Giọng Đô trưởng không có hóa biểu', 'Vì giọng Đô trưởng dùng đúng 7 nốt tự nhiên, không cần thăng giáng gì — khuông nhạc "trắng trơn" ngay sau khóa Sol.',
     '{"kind":"key_signature","items":[]}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Nhịp 6/8 (giới thiệu)'), * from (values
  (1, 'Số chỉ nhịp 6/8', 'Số 6 trên: mỗi ô nhịp có 6 phách đơn. Số 8 dưới: đơn vị phách là nốt móc đơn.',
     '{"kind":"meter","num":6,"den":8}'::jsonb),
  (2, 'Cảm giác đung đưa', '6 phách đơn thường được nhóm thành 2 nhóm 3 — tạo cảm giác đung đưa rất đặc trưng, khác hẳn nhịp 2/4 hay 3/4.',
     '{"kind":"beat_strip","pattern":[2,1,1,2,1,1]}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Tiết tấu chấm dôi kết hợp móc đơn'), * from (values
  (1, 'Mẫu tiết tấu phổ biến', 'Nốt đen chấm dôi + 1 nốt móc đơn là mẫu tiết tấu rất hay gặp — nốt đầu ngân dài, nốt sau ngắn gọn.',
     '{"kind":"beamed_eighths"}'::jsonb, '{"type":"sequence","notes":["C","D"],"label":"Nghe ví dụ"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Xướng âm gam Đô trưởng đầy đủ'), * from (values
  (1, 'Đi lên', 'Xướng âm đủ 7 nốt từ Đô đến Si rồi lên Đô cao, giữ đều tốc độ.',
     '{"kind":"staff_notes","notes":["C","D","E","F","G","A","B","C"]}'::jsonb, '{"type":"sequence","notes":["C","D","E","F","G","A","B","C"],"label":"Nghe đi lên"}'::jsonb),
  (2, 'Đi xuống', 'Xướng âm ngược lại từ Đô cao về Đô thấp — khó hơn chiều đi lên, cần luyện thêm.',
     '{"kind":"staff_notes","notes":["C","B","A","G","F","E","D","C"]}'::jsonb, '{"type":"sequence","notes":["C","B","A","G","F","E","D","C"],"label":"Nghe đi xuống"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Bài tập nhảy quãng 3'), * from (values
  (1, 'Luyện nhảy quãng', 'Thay vì đi liền bậc (Đô-Rê-Mi), thử nhảy cách quãng 3 liên tiếp (Đô-Mi-Sol) — khó hơn nhưng rất hữu ích.',
     '{"kind":"staff_notes","notes":["C","E","G"]}'::jsonb, '{"type":"sequence","notes":["C","E","G"],"label":"Nghe ví dụ"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Hợp âm 3 là gì'), * from (values
  (1, 'Định nghĩa', 'Hợp âm 3 gồm 3 nốt xếp chồng lên nhau theo quãng 3: nốt gốc, nốt quãng 3 và nốt quãng 5 tính từ gốc.',
     '{"kind":"chord","notes":["C","E","G"]}'::jsonb, '{"type":"chord","notes":["C","E","G"],"label":"Nghe hợp âm"}'::jsonb),
  (2, 'Khác gì với giai điệu', 'Giai điệu là các nốt vang lên LẦN LƯỢT; hợp âm là các nốt vang lên CÙNG LÚC.', null, null)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Hợp âm Đô trưởng (C)'), * from (values
  (1, 'Cấu tạo hợp âm C', 'Hợp âm Đô trưởng gồm 3 nốt: Đô - Mi - Sol, chính là hợp âm 3 dựng trên nốt Đô.',
     '{"kind":"chord","notes":["C","E","G"]}'::jsonb, '{"type":"chord","notes":["C","E","G"],"label":"Nghe hợp âm C"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Nhạc sĩ Việt Nam tiêu biểu'), * from (values
  (1, 'Đóng góp cho nhạc thiếu nhi', 'Nhiều nhạc sĩ Việt Nam đã sáng tác hàng trăm ca khúc thiếu nhi quen thuộc, trở thành 1 phần tuổi thơ của nhiều thế hệ học sinh.',
     '{"kind":"milestone"}'::jsonb),
  (2, 'Vì sao nên tìm hiểu', 'Hiểu bối cảnh sáng tác giúp bạn cảm nhạc sâu sắc hơn, không chỉ đọc đúng nốt mà còn hát đúng cảm xúc.', null)
) as p(order_index, heading, body, media);

-- THE KHAI NIEM TRUNG CAP 1
insert into concepts (module_id, term, sub, audio_note, icon_index)
select (select id from modules where level_id=(select id from levels where name='Trung cấp 1') and name=c.mod_name), c.term, c.sub, c.audio_note, c.icon_index
from (values
  ('Nhạc lý','Quãng 2','2 nốt liền bậc','D',1),
  ('Nhạc lý','Quãng 3','cách nhau 1 nốt','E',2),
  ('Nhạc lý','Hóa biểu','thăng/giáng sau khóa Sol',null,3),
  ('Tiết tấu','Nhịp 6/8','6 phách đơn, nhóm 2x3',null,5),
  ('Tiết tấu','Chấm dôi + móc đơn','mẫu tiết tấu phổ biến',null,6),
  ('Xướng âm','Gam Đô trưởng','đủ 7 nốt lên xuống','C',7),
  ('Xướng âm','Nhảy quãng 3','Đô-Mi-Sol','G',9),
  ('Hòa âm','Hợp âm 3','3 nốt xếp chồng',null,10),
  ('Hòa âm','Hợp âm C','Đô-Mi-Sol','C',10),
  ('Thường thức','Nhạc sĩ Việt Nam','đóng góp cho nhạc thiếu nhi',null,11)
) as c(mod_name, term, sub, audio_note, icon_index);

-- NGAN HANG CAU HOI TRUNG CAP 1
insert into questions (level_id, type, question_text, options, correct_answer)
select (select id from levels where name='Trung cấp 1'), * from (values
  ('mc','Quãng là gì?','["Tên gọi của 1 nốt nhạc","Khoảng cách cao độ giữa 2 nốt","Một loại nhịp","Một loại hợp âm"]'::jsonb,'Khoảng cách cao độ giữa 2 nốt'),
  ('mc','Đô và Rê cách nhau quãng mấy?','["Quãng 1","Quãng 2","Quãng 3","Quãng 4"]'::jsonb,'Quãng 2'),
  ('mc','Đô và Mi cách nhau quãng mấy?','["Quãng 2","Quãng 3","Quãng 4","Quãng 5"]'::jsonb,'Quãng 3'),
  ('match','Hóa biểu được đặt ở vị trí nào trên khuông nhạc?','["Cuối khuông nhạc","Ngay sau khóa Sol","Giữa khuông nhạc","Không có vị trí cố định"]'::jsonb,'Ngay sau khóa Sol'),
  ('mc','Giọng Đô trưởng có hóa biểu như thế nào?','["1 dấu thăng","1 dấu giáng","Không có dấu hóa nào","2 dấu thăng"]'::jsonb,'Không có dấu hóa nào'),
  ('mc','Nhịp 6/8 có bao nhiêu phách đơn mỗi ô nhịp?','["4 phách","6 phách","8 phách","3 phách"]'::jsonb,'6 phách'),
  ('match','6 phách đơn trong nhịp 6/8 thường nhóm thành mấy nhóm?','["2 nhóm 3","3 nhóm 2","6 nhóm riêng lẻ","1 nhóm duy nhất"]'::jsonb,'2 nhóm 3'),
  ('mc','Hợp âm 3 được tạo từ mấy nốt?','["2 nốt","3 nốt","4 nốt","5 nốt"]'::jsonb,'3 nốt'),
  ('mc','Hợp âm Đô trưởng (C) gồm những nốt nào?','["Đô - Rê - Mi","Đô - Mi - Sol","Đô - Fa - Sol","Rê - Fa - La"]'::jsonb,'Đô - Mi - Sol'),
  ('match','Điểm khác biệt chính giữa giai điệu và hợp âm là gì?','["Giai điệu phát lần lượt, hợp âm phát cùng lúc","Giai điệu chỉ có 1 nốt, hợp âm có nhiều nốt","Không có gì khác nhau","Hợp âm chỉ dùng trong nhịp 6/8"]'::jsonb,'Giai điệu phát lần lượt, hợp âm phát cùng lúc'),
  ('mc','Xướng âm gam Đô trưởng đi lên bắt đầu và kết thúc bằng nốt gì?','["Đô và Đô","Đô và Si","Rê và Rê","Sol và Sol"]'::jsonb,'Đô và Đô')
) as q(type, question_text, options, correct_answer);
