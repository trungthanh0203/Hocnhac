-- ============================================================
-- SEED DU LIEU: NANG CAO 3 — tổng kết toàn khóa (cấp cuối cùng)
-- Chạy SAU khi đã chạy seed_nang_cao_2.sql
-- ============================================================

insert into modules (level_id, name, order_index)
select id, m.name, m.order_index from levels,
  (values ('Nhạc lý',1), ('Tiết tấu',2), ('Xướng âm',3), ('Hòa âm',4), ('Thường thức',5)) as m(name, order_index)
where levels.name = 'Nâng cao 3';

insert into lessons (module_id, order_index, title, goal, is_demo_free)
select (select id from modules where level_id = (select id from levels where name='Nâng cao 3') and name = l.mod_name),
       l.order_index, l.title, l.goal, l.is_demo_free
from (values
  ('Nhạc lý', 1, 'Ôn tập tổng hợp nhạc lý toàn khóa', 'Sau bài này, bạn tự tổng kết được toàn bộ kiến thức nhạc lý đã học qua 9 cấp.', true),
  ('Tiết tấu', 1, 'Ôn tập tổng hợp tiết tấu toàn khóa', 'Sau bài này, bạn nhận diện nhanh mọi loại nhịp và hình tiết tấu đã học.', true),
  ('Xướng âm', 1, 'Xướng âm tổng hợp nhiều giọng', 'Sau bài này, bạn xướng âm linh hoạt qua nhiều giọng khác nhau.', true),
  ('Xướng âm', 2, 'Xướng âm tổng hợp nhiều loại nhịp', 'Sau bài này, bạn xướng âm chính xác dù bài chuyển đổi nhiều loại nhịp.', false),
  ('Hòa âm', 1, 'Ứng dụng hòa âm vào 1 giai điệu hoàn chỉnh', 'Sau bài này, bạn biết cách đặt hợp âm đệm cho 1 giai điệu có sẵn.', true),
  ('Hòa âm', 2, 'Hoàn thiện vòng hòa âm cho cả bài', 'Sau bài này, bạn mở rộng vòng hòa âm cơ bản thành vòng phong phú hơn.', false),
  ('Thường thức', 1, 'Lịch sử âm nhạc Việt Nam', 'Sau bài này, bạn nắm được các mốc quan trọng của âm nhạc Việt Nam.', true),
  ('Thường thức', 2, 'Lịch sử âm nhạc thế giới', 'Sau bài này, bạn biết sơ lược các thời kỳ lớn của âm nhạc thế giới.', true),
  ('Thường thức', 3, 'Định hướng học tiếp', 'Sau bài này, bạn có hướng đi rõ ràng để tiếp tục hành trình âm nhạc của mình.', false)
) as l(mod_name, order_index, title, goal, is_demo_free);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Ôn tập tổng hợp nhạc lý toàn khóa'), * from (values
  (1, 'Nền tảng từ Sơ cấp', 'Khuông nhạc, 7 nốt, vị trí nốt, dấu hóa, hình nốt, dấu lặng, dấu chấm dôi, nhịp 2/4-3/4-4/4.', '{"kind":"staff_blank"}'::jsonb),
  (2, 'Mở rộng ở Trung cấp', 'Quãng, hóa biểu, giọng trưởng/thứ, hợp âm 3, vòng hòa âm cơ bản.', '{"kind":"key_signature","items":[{"note":"F","sym":"♯"}]}'::jsonb),
  (3, 'Nâng cao ở Nâng cao', 'Giọng thứ hòa thanh, dấu hóa bất thường, quãng thuận/nghịch, hợp âm 7, đọc 2 bè.', '{"kind":"accidental","note":"G","symbol":"♯"}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Ôn tập tổng hợp tiết tấu toàn khóa'), * from (values
  (1, 'Các loại nhịp đã học', '2/4, 3/4, 4/4, 6/8, và tham khảo thêm 5/4, 7/8 — mỗi loại có cảm giác trọng âm riêng.', '{"kind":"meter","num":4,"den":4}'::jsonb),
  (2, 'Các kiểu tiết tấu đặc biệt', 'Đảo phách, chùm ba, móc kép — những "gia vị" giúp tiết tấu sinh động hơn nhịp đều đặn thông thường.', '{"kind":"triplet"}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Xướng âm tổng hợp nhiều giọng'), * from (values
  (1, 'Giọng Đô trưởng', 'Giọng nền tảng nhất, không hóa biểu.', '{"kind":"staff_notes","notes":["C","D","E","F","G","A","B","C"]}'::jsonb, '{"type":"sequence","notes":["C","D","E","F","G","A","B","C"],"label":"Nghe Đô trưởng"}'::jsonb),
  (2, 'Giọng La thứ', 'Giọng song song với Đô trưởng, cùng hóa biểu nhưng âm chủ khác.', '{"kind":"staff_notes","notes":["A","B","C","D","E","F","G","A"]}'::jsonb, '{"type":"sequence","notes":["A","B","C","D","E","F","G","A"],"label":"Nghe La thứ"}'::jsonb),
  (3, 'Giọng Sol trưởng', 'Giọng có 1 dấu thăng, xa Đô trưởng hơn 1 bậc trong vòng hóa biểu.', '{"kind":"staff_notes","notes":["G","A","B","C","D","E","F","G"]}'::jsonb, '{"type":"sequence","notes":["G","A","B","C","D","E","F","G"],"label":"Nghe Sol trưởng"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Xướng âm tổng hợp nhiều loại nhịp'), * from (values
  (1, 'Luyện chuyển đổi', 'Thử xướng âm 1 câu ở nhịp 3/4 rồi chuyển ngay sang cảm giác nhịp 4/4 — phản xạ này rất cần thiết khi đọc bản nhạc thực tế.',
     '{"kind":"staff_notes","notes":["C","E","G","C"]}'::jsonb, '{"type":"sequence","notes":["C","E","G","C"],"label":"Nghe ví dụ"}'::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media, audio)
select (select id from lessons where title = 'Ứng dụng hòa âm vào 1 giai điệu hoàn chỉnh'), * from (values
  (1, 'Giai điệu mẫu', 'Đây là 1 giai điệu ngắn — bước đầu tiên là xác định giọng và các nốt trọng tâm của từng ô nhịp.',
     '{"kind":"staff_notes","notes":["C","E","G","F"]}'::jsonb, '{"type":"sequence","notes":["C","E","G","F"],"label":"Nghe giai điệu"}'::jsonb),
  (2, 'Đặt hợp âm đệm', 'Dựa vào nốt trọng tâm mỗi ô nhịp, ta chọn hợp âm phù hợp — ở đây là vòng quen thuộc I-IV-V-I.',
     '{"kind":"progression","chords":["C","F","G","C"]}'::jsonb, null::jsonb)
) as p(order_index, heading, body, media, audio);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Hoàn thiện vòng hòa âm cho cả bài'), * from (values
  (1, 'Mở rộng vòng cơ bản', 'Thay vì chỉ dùng I-IV-V, thêm hợp âm vi (La thứ) sẽ tạo màu sắc phong phú hơn cho cả bài — vòng I-vi-IV-V rất phổ biến.',
     '{"kind":"progression","chords":["C","Am","F","G"]}'::jsonb)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Lịch sử âm nhạc Việt Nam'), * from (values
  (1, 'Từ dân ca đến hiện đại', 'Âm nhạc Việt Nam trải qua hành trình dài: dân ca truyền miệng, nhạc cung đình, tân nhạc đầu thế kỷ 20, đến các thể loại hiện đại ngày nay.', '{"kind":"milestone"}'::jsonb),
  (2, 'Giá trị cần gìn giữ', 'Nhiều làn điệu dân ca, nhạc cụ dân tộc đang được nỗ lực bảo tồn như 1 phần di sản văn hóa quý giá.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Lịch sử âm nhạc thế giới'), * from (values
  (1, 'Các thời kỳ lớn', 'Từ nhạc Baroque, cổ điển (Classical), lãng mạn (Romantic) đến hiện đại — mỗi thời kỳ có phong cách sáng tác đặc trưng riêng.', '{"kind":"milestone"}'::jsonb),
  (2, 'Ảnh hưởng đến âm nhạc ngày nay', 'Nhiều kỹ thuật hòa âm, cấu trúc bạn đã học (hợp âm, vòng hòa âm) đều bắt nguồn từ nền tảng lý thuyết âm nhạc phương Tây qua các thời kỳ này.', null)
) as p(order_index, heading, body, media);

insert into lesson_points (lesson_id, order_index, heading, body, media)
select (select id from lessons where title = 'Định hướng học tiếp'), * from (values
  (1, 'Chúc mừng bạn đã hoàn thành toàn bộ 9 cấp!', 'Từ những nốt nhạc đầu tiên đến hợp âm 7 và đọc 2 bè — đây là 1 hành trình dài và bạn đã đi trọn vẹn.', '{"kind":"milestone"}'::jsonb),
  (2, 'Bước tiếp theo', 'Giờ là lúc chọn 1 nhạc cụ cụ thể để luyện tập chuyên sâu, tham gia dàn hợp xướng, hoặc thử tự sáng tác giai điệu của riêng bạn.', '{"kind":"forward"}'::jsonb)
) as p(order_index, heading, body, media);

insert into concepts (module_id, term, sub, audio_note, icon_index)
select (select id from modules where level_id=(select id from levels where name='Nâng cao 3') and name=c.mod_name), c.term, c.sub, c.audio_note, c.icon_index
from (values
  ('Nhạc lý','Tổng kết nhạc lý','9 cấp kiến thức',null,0),
  ('Tiết tấu','Tổng kết tiết tấu','mọi loại nhịp và hình tiết tấu',null,4),
  ('Xướng âm','Đa giọng','Đô trưởng, La thứ, Sol trưởng',null,7),
  ('Hòa âm','Đặt hợp âm đệm','dựa vào nốt trọng tâm',null,10),
  ('Hòa âm','Vòng I-vi-IV-V','vòng hòa âm phong phú hơn',null,10),
  ('Thường thức','Lịch sử âm nhạc VN','dân ca đến hiện đại',null,11),
  ('Thường thức','Lịch sử âm nhạc thế giới','Baroque đến hiện đại',null,11),
  ('Thường thức','Hoàn thành khóa học','9/9 cấp',null,11)
) as c(mod_name, term, sub, audio_note, icon_index);

insert into questions (level_id, type, question_text, options, correct_answer)
select (select id from levels where name='Nâng cao 3'), * from (values
  ('mc','Giọng nào là nền tảng, không có hóa biểu?','["Sol trưởng","Fa trưởng","Đô trưởng","Rê trưởng"]'::jsonb,'Đô trưởng'),
  ('match','La thứ có quan hệ gì với Đô trưởng?','["Không liên quan gì","Giọng song song (cùng hóa biểu)","Giọng đối lập hoàn toàn","Cùng âm chủ"]'::jsonb,'Giọng song song (cùng hóa biểu)'),
  ('mc','Đảo phách, chùm ba, móc kép có vai trò gì trong tiết tấu?','["Làm tiết tấu đơn điệu hơn","Tạo sự sinh động, đa dạng cho tiết tấu","Không có tác dụng gì đặc biệt","Chỉ dùng trong nhạc cổ điển"]'::jsonb,'Tạo sự sinh động, đa dạng cho tiết tấu'),
  ('mc','Vòng hòa âm I-vi-IV-V có gì khác I-IV-V cơ bản?','["Bớt đi 1 hợp âm","Thêm hợp âm vi (thứ) tạo màu sắc phong phú hơn","Đổi hoàn toàn các hợp âm","Không có gì khác nhau"]'::jsonb,'Thêm hợp âm vi (thứ) tạo màu sắc phong phú hơn'),
  ('mc','Âm nhạc Việt Nam bắt nguồn từ đâu?','["Nhạc cung đình","Dân ca truyền miệng","Tân nhạc đầu TK 20","Nhạc hiện đại"]'::jsonb,'Dân ca truyền miệng'),
  ('match','Thời kỳ nào KHÔNG thuộc lịch sử âm nhạc thế giới đã học?','["Baroque","Cổ điển (Classical)","Lãng mạn (Romantic)","Kỷ Jura"]'::jsonb,'Kỷ Jura'),
  ('mc','Sau khi hoàn thành 9 cấp, bạn nên làm gì tiếp theo?','["Dừng học nhạc hoàn toàn","Chọn 1 nhạc cụ để luyện chuyên sâu","Học lại từ Sơ cấp 1","Không cần làm gì thêm"]'::jsonb,'Chọn 1 nhạc cụ để luyện chuyên sâu'),
  ('mc','Chương trình học gồm tổng cộng bao nhiêu cấp?','["6 cấp","9 cấp","12 cấp","3 cấp"]'::jsonb,'9 cấp')
) as q(type, question_text, options, correct_answer);

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Nâng cao 3'), 1, 'Tổng kết hành trình',
'[[{"note":"C","dur":1},{"note":"E","dur":1}],[{"note":"G","dur":1},{"note":"C","dur":1}],[{"note":"B","dur":2}],[{"note":"A","dur":1},{"note":"G","dur":1}],[{"note":"F","dur":1},{"note":"E","dur":1}],[{"note":"D","dur":2}],[{"note":"E","dur":1},{"note":"G","dur":1}],[{"note":"C","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Nâng cao 3'), 2, 'Lời chào tạm biệt',
'[[{"note":"G","dur":1},{"note":"E","dur":1}],[{"note":"C","dur":1},{"note":"E","dur":1}],[{"note":"G","dur":2}],[{"note":"F","dur":1},{"note":"D","dur":1}],[{"note":"B","dur":1},{"note":"D","dur":1}],[{"note":"F","dur":2}],[{"note":"E","dur":1},{"note":"C","dur":1}],[{"note":"C","dur":2}]]'::jsonb;
