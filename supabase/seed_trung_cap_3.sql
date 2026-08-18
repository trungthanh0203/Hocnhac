-- ============================================================
-- SEED DU LIEU: TRUNG CAP 3 — tổng hợp, chuẩn bị Nâng cao
-- Chạy SAU khi đã chạy seed_trung_cap_2.sql
-- ============================================================

insert into modules (level_id, name, order_index)
select id, m.name, m.order_index from levels,
  (values ('Nhạc lý',1), ('Tiết tấu',2), ('Xướng âm',3), ('Hòa âm',4), ('Thường thức',5)) as m(name, order_index)
where levels.name = 'Trung cấp 3';

insert into lessons (module_id, order_index, title, goal, is_demo_free)
select (select id from modules where level_id = (select id from levels where name='Trung cấp 3') and name = l.mod_name),
       l.order_index, l.title, l.goal, l.is_demo_free
from (values
  ('Nhạc lý', 1, 'Hóa biểu Sol trưởng', 'Sau bài này, bạn nhận biết hóa biểu 1 dấu thăng của giọng Sol trưởng.', true),
  ('Nhạc lý', 2, 'Hóa biểu Fa trưởng', 'Sau bài này, bạn nhận biết hóa biểu 1 dấu giáng của giọng Fa trưởng.', false),
  ('Nhạc lý', 3, 'Khái niệm dịch giọng', 'Sau bài này, bạn hiểu dịch giọng là gì và vì sao người ta cần dịch giọng.', false),
  ('Tiết tấu', 1, 'Ôn tập tổng hợp các loại nhịp', 'Sau bài này, bạn phân biệt nhanh nhịp 2/4, 3/4, 4/4 và 6/8.', true),
  ('Xướng âm', 1, 'Xướng âm giọng Sol trưởng', 'Sau bài này, bạn xướng âm được gam Sol trưởng.', true),
  ('Xướng âm', 2, 'Bài tập tổng hợp cuối Trung cấp', 'Sau bài này, bạn ôn lại toàn bộ kỹ năng xướng âm đã tích lũy ở Trung cấp.', false),
  ('Hòa âm', 1, 'Vòng hòa âm cơ bản I - IV - V', 'Sau bài này, bạn nhận biết vòng hòa âm 3 hợp âm phổ biến nhất trong âm nhạc.', true),
  ('Thường thức', 1, 'Nhạc sĩ và tác phẩm Việt Nam tiêu biểu (mở rộng)', 'Sau bài này, bạn biết thêm về các tác phẩm âm nhạc Việt Nam có giá trị lâu dài.', true),
  ('Thường thức', 2, 'Ôn tập tổng hợp Trung cấp', 'Sau bài này, bạn đã sẵn sàng bước vào chương trình Nâng cao.', false)
) as l(mod_name, order_index, title, goal, is_demo_free);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Hóa biểu Sol trưởng'), * from (values
  (1, 'Hóa biểu 1 dấu thăng', 'Giọng Sol trưởng có 1 dấu thăng ở nốt Fa (Fa♯), đặt ngay sau khóa Sol.',
     '{"kind":"key_signature","items":[{"note":"F","sym":"♯"}]}'::jsonb),
  (2, 'Vì sao cần dấu thăng', 'Để giữ đúng công thức cung/nửa cung của giọng trưởng khi âm chủ chuyển từ Đô sang Sol.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Hóa biểu Fa trưởng'), * from (values
  (1, 'Hóa biểu 1 dấu giáng', 'Giọng Fa trưởng có 1 dấu giáng ở nốt Si (Si♭), đặt ngay sau khóa Sol.',
     '{"kind":"key_signature","items":[{"note":"B","sym":"♭"}]}'::jsonb),
  (2, 'So với Sol trưởng', 'Sol trưởng dùng dấu thăng, Fa trưởng dùng dấu giáng — mỗi giọng trưởng có 1 hóa biểu riêng biệt.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Khái niệm dịch giọng'), * from (values
  (1, 'Dịch giọng là gì', 'Chuyển toàn bộ bài hát lên cao hoặc xuống thấp 1 khoảng cố định, giữ nguyên các quãng giữa các nốt.',
     '{"kind":"forward"}'::jsonb),
  (2, 'Vì sao cần dịch giọng', 'Giúp bài hát vừa với tầm giọng của người hát, hoặc dễ chơi hơn trên 1 nhạc cụ cụ thể.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Ôn tập tổng hợp các loại nhịp'), * from (values
  (1, 'Nhịp 2/4 và 3/4', 'Nhịp 2/4: mạnh-nhẹ. Nhịp 3/4: mạnh-nhẹ-nhẹ, cảm giác đung đưa nhẹ.', '{"kind":"meter","num":2,"den":4}'::jsonb),
  (2, 'Nhịp 4/4 và 6/8', 'Nhịp 4/4: phổ biến nhất, mạnh-nhẹ-vừa-nhẹ. Nhịp 6/8: 6 phách đơn, nhóm 2x3, cảm giác đung đưa rõ hơn.', '{"kind":"meter","num":6,"den":8}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Xướng âm giọng Sol trưởng'), * from (values
  (1, 'Gam Sol trưởng', 'Xướng âm từ Sol lên Sol cao — lưu ý nốt Fa trong giọng này thực chất phải hát thăng (Fa♯); app hiện phát âm Fa tự nhiên để đơn giản hóa, khi tập với nhạc cụ thật bạn cần chơi đúng Fa♯.',
     '{"kind":"staff_notes","notes":["G","A","B","C","D","E","F","G"]}'::jsonb, '{"type":"sequence","notes":["G","A","B","C","D","E","F","G"],"label":"Nghe gam Sol trưởng"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Bài tập tổng hợp cuối Trung cấp'), * from (values
  (1, 'Ôn lại toàn diện', 'Kết hợp quãng, giọng, tiết tấu đã học vào 1 câu nhạc hoàn chỉnh.',
     '{"kind":"staff_notes","notes":["C","E","G","F","D","C"]}'::jsonb, '{"type":"sequence","notes":["C","E","G","F","D","C"],"label":"Nghe câu nhạc"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Vòng hòa âm cơ bản I - IV - V'), * from (values
  (1, 'Vòng hòa âm I-IV-V-I', 'Đây là vòng hòa âm phổ biến nhất trong âm nhạc phổ thông — hầu hết các bài hát đơn giản đều dùng được vòng này.',
     '{"kind":"progression","chords":["C","F","G","C"]}'::jsonb, null::jsonb),
  (2, 'Ý nghĩa các bậc', 'I là hợp âm chủ (ổn định), IV và V tạo cảm giác "chuyển động", quay về I tạo cảm giác kết thúc trọn vẹn.', null,
     '{"type":"chord","notes":["C","E","G"],"label":"Nghe hợp âm chủ (I)"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Nhạc sĩ và tác phẩm Việt Nam tiêu biểu (mở rộng)'), * from (values
  (1, 'Giá trị lâu dài', 'Nhiều tác phẩm âm nhạc Việt Nam đã tồn tại qua nhiều thế hệ, trở thành 1 phần của văn hóa và giáo dục âm nhạc trong nước.',
     '{"kind":"milestone"}'::jsonb),
  (2, 'Học hỏi từ tác phẩm', 'Phân tích cách 1 tác phẩm hay được xây dựng (giai điệu, hòa âm, cấu trúc) giúp bạn tiến bộ nhanh hơn.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Ôn tập tổng hợp Trung cấp'), * from (values
  (1, 'Chúc mừng bạn!', 'Bạn đã hoàn thành Trung cấp: quãng, giọng trưởng/thứ, hóa biểu, hợp âm 3, vòng hòa âm cơ bản.', '{"kind":"milestone"}'::jsonb),
  (2, 'Sẵn sàng cho Nâng cao', 'Nâng cao sẽ đưa bạn tới giọng thứ hòa thanh, hợp âm 7, đọc nhạc 2 bè và ứng dụng đệm hát thực tế.', '{"kind":"forward"}'::jsonb)
) as p(order_index, heading, body, media);

insert into concepts (module_id, term, sub, audio_note, icon_index)
select (select id from modules where level_id=(select id from levels where name='Trung cấp 3') and name=c.mod_name), c.term, c.sub, c.audio_note, c.icon_index
from (values
  ('Nhạc lý','Sol trưởng','1 dấu thăng (Fa♯)',null,3),
  ('Nhạc lý','Fa trưởng','1 dấu giáng (Si♭)',null,3),
  ('Nhạc lý','Dịch giọng','chuyển cao độ, giữ nguyên quãng',null,1),
  ('Tiết tấu','4 loại nhịp','2/4, 3/4, 4/4, 6/8',null,5),
  ('Xướng âm','Gam Sol trưởng','7 nốt, 1 dấu thăng','G',7),
  ('Hòa âm','Vòng I-IV-V','vòng hòa âm phổ biến nhất',null,10),
  ('Thường thức','Tác phẩm Việt Nam','giá trị văn hóa lâu dài',null,11),
  ('Thường thức','Tổng kết Trung cấp','sẵn sàng lên Nâng cao',null,11)
) as c(mod_name, term, sub, audio_note, icon_index);

insert into questions (level_id, type, question_text, options, correct_answer)
select (select id from levels where name='Trung cấp 3'), * from (values
  ('mc','Giọng Sol trưởng có hóa biểu như thế nào?','["Không có dấu hóa","1 dấu thăng (Fa♯)","1 dấu giáng","2 dấu thăng"]'::jsonb,'1 dấu thăng (Fa♯)'),
  ('mc','Giọng Fa trưởng có hóa biểu như thế nào?','["1 dấu thăng","1 dấu giáng (Si♭)","Không có dấu hóa","2 dấu giáng"]'::jsonb,'1 dấu giáng (Si♭)'),
  ('mc','Dịch giọng là gì?','["Đổi lời bài hát","Chuyển cao độ cả bài, giữ nguyên các quãng","Đổi nhịp bài hát","Đổi tốc độ bài hát"]'::jsonb,'Chuyển cao độ cả bài, giữ nguyên các quãng'),
  ('match','Nhịp nào có cảm giác đung đưa rõ nhất trong 4 loại đã học?','["2/4","3/4","4/4","6/8"]'::jsonb,'6/8'),
  ('mc','Nhịp nào phổ biến nhất trong âm nhạc hiện đại?','["2/4","3/4","4/4","6/8"]'::jsonb,'4/4'),
  ('mc','Vòng hòa âm I-IV-V-I có đặc điểm gì?','["Ít dùng trong thực tế","Phổ biến nhất trong âm nhạc phổ thông","Chỉ dùng cho nhạc cổ điển","Không có hợp âm chủ"]'::jsonb,'Phổ biến nhất trong âm nhạc phổ thông'),
  ('match','Trong vòng I-IV-V, hợp âm nào tạo cảm giác ổn định, kết thúc?','["I","IV","V","Cả 3 đều như nhau"]'::jsonb,'I'),
  ('mc','Sau khi hoàn thành Trung cấp, bạn sẽ học tiếp cấp nào?','["Sơ cấp 1","Trung cấp 1","Nâng cao 1","Không có cấp tiếp theo"]'::jsonb,'Nâng cao 1'),
  ('mc','Ở Nâng cao, bạn sẽ được học thêm về loại hợp âm nào?','["Hợp âm 3","Hợp âm 7","Chỉ ôn lại hợp âm đã học","Không học thêm hợp âm mới"]'::jsonb,'Hợp âm 7')
) as q(type, question_text, options, correct_answer);
