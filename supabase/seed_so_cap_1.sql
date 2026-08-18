-- ============================================================
-- SEED DU LIEU: 9 cap (khung) + noi dung day du So cap 1
-- Chay SAU khi da chay schema.sql
-- ============================================================

-- 9 CAP
insert into levels (tier, name, order_index, focus_text) values
('Sơ cấp','Sơ cấp 1',1,'Khuông nhạc, 7 nốt, phách, nhịp 2/4 — nhập môn'),
('Sơ cấp','Sơ cấp 2',2,'Mở rộng đủ 7 nốt, dấu lặng, nhịp 3/4'),
('Sơ cấp','Sơ cấp 3',3,'Nhịp 4/4, đảo phách cơ bản, hoàn thiện nền tảng'),
('Trung cấp','Trung cấp 1',4,'Quãng, giọng Đô trưởng, hợp âm 3 cơ bản'),
('Trung cấp','Trung cấp 2',5,'Giọng thứ, hợp âm thứ, nhịp 6/8'),
('Trung cấp','Trung cấp 3',6,'Hóa biểu, dịch giọng, vòng hòa âm cơ bản'),
('Nâng cao','Nâng cao 1',7,'Giọng thứ hòa thanh, hợp âm 7, đọc nhạc 2 bè'),
('Nâng cao','Nâng cao 2',8,'Hóa biểu mở rộng, ứng dụng đệm hát'),
('Nâng cao','Nâng cao 3',9,'Tổng kết và ứng dụng thực tế toàn khóa');

-- 4 MODULE CUA SO CAP 1 (level_id = 1)
insert into modules (level_id, name, order_index) values
(1,'Nhạc lý',1),
(1,'Tiết tấu',2),
(1,'Xướng âm',3),
(1,'Thường thức',4);

-- 12 BAI HOC SO CAP 1
-- module_id: 1=Nhạc lý, 2=Tiết tấu, 3=Xướng âm, 4=Thường thức (theo thứ tự insert ở trên)
insert into lessons (module_id, order_index, title, goal, is_demo_free) values
(1,1,'Khuông nhạc và khóa Sol','Sau bài này, bạn nhận diện được khuông nhạc và biết khóa Sol dùng để làm gì.', true),
(1,2,'Tên gọi 7 nốt nhạc','Sau bài này, bạn đọc đúng tên 7 nốt nhạc cơ bản theo thứ tự.', true),
(1,3,'Vị trí nốt trên khuông nhạc','Sau bài này, bạn xác định được 1 nốt bất kỳ là trên dòng hay trong khe.', true),
(1,4,'Dấu hóa cơ bản','Sau bài này, bạn hiểu và nhận biết được 3 dấu hóa cơ bản.', false),
(2,1,'Làm quen phách','Sau bài này, bạn cảm nhận và đếm được phách đều trong 1 đoạn nhạc.', true),
(2,2,'Nhịp 2/4','Sau bài này, bạn hiểu ý nghĩa số chỉ nhịp 2/4 và phân biệt phách mạnh-nhẹ.', true),
(2,3,'Hình nốt đen và nốt trắng','Sau bài này, bạn phân biệt được nốt đen và nốt trắng qua hình dạng và trường độ.', false),
(3,1,'Đọc nốt Đô - Rê - Mi','Sau bài này, bạn xướng âm đúng cao độ 3 nốt Đô-Rê-Mi.', true),
(3,2,'Xướng âm bài tập 3 nốt','Sau bài này, bạn tự xướng âm được 1 câu nhạc ngắn 3 nốt.', true),
(3,3,'Xướng âm 5 nốt Đô-Rê-Mi-Fa-Sol','Sau bài này, bạn xướng âm trôi chảy trong phạm vi 5 nốt Đô đến Sol.', false),
(4,1,'Âm nhạc là gì?','Sau bài này, bạn gọi tên được 3 yếu tố cơ bản tạo nên âm nhạc.', true),
(4,2,'Nhạc cụ quen thuộc','Sau bài này, bạn nhận biết được 4 nhạc cụ quen thuộc qua hình dáng và âm sắc.', false);

-- LESSON POINTS
-- Bài 1: Khuông nhạc và khóa Sol (lesson_id = 1)
insert into lesson_points (lesson_id, order_index, heading, body, media, audio) values
(1,1,'Khuông nhạc là gì','Gồm 5 dòng kẻ song song và 4 khe ở giữa, dùng để ghi vị trí cao độ của nốt nhạc.',
   '{"kind":"staff_blank"}', null),
(1,2,'Khóa Sol','Đặt ở đầu khuông nhạc, vòng của khóa Sol khoanh quanh dòng kẻ số 2, xác định đó là nốt Sol.',
   '{"kind":"clef_highlight"}', '{"type":"note","note":"G","label":"Nghe nốt Sol"}');

-- Bài 2: Tên gọi 7 nốt nhạc (lesson_id = 2)
insert into lesson_points (lesson_id, order_index, heading, body, media, audio, example_tag) values
(2,1,'7 nốt cơ bản','Đô - Rê - Mi - Fa - Sol - La - Si, theo thứ tự cao dần.',
   '{"kind":"staff_notes","notes":["C","D","E","F","G","A","B"]}',
   '{"type":"sequence","notes":["C","D","E","F","G","A","B"],"label":"Nghe cả 7 nốt"}', null),
(2,2,'Quãng 8','Sau nốt Si, chuỗi 7 nốt lặp lại từ Đô ở quãng cao hơn (hoặc thấp hơn).',
   '{"kind":"icon","index":1}', null, null);

-- Bài 3: Vị trí nốt trên khuông nhạc (lesson_id = 3)
insert into lesson_points (lesson_id, order_index, heading, body, media, audio) values
(3,1,'Nốt trên dòng','Đầu nốt nằm đè lên 1 trong 5 dòng kẻ, ví dụ nốt Sol nằm trên dòng kẻ số 2.',
   '{"kind":"staff_notes","notes":["G"]}', '{"type":"note","note":"G","label":"Nghe nốt Sol"}'),
(3,2,'Nốt trong khe','Đầu nốt nằm giữa 2 dòng kẻ, ví dụ nốt Fa nằm trong khe thứ nhất.',
   '{"kind":"staff_notes","notes":["F"]}', '{"type":"note","note":"F","label":"Nghe nốt Fa"}'),
(3,3,'Đọc từ dưới lên','Cao độ tăng dần khi vị trí nốt di chuyển lên phía trên khuông nhạc.',
   '{"kind":"icon","index":1}', null);

-- Bài 4: Dấu hóa cơ bản (lesson_id = 4)
insert into lesson_points (lesson_id, order_index, heading, body, media) values
(4,1,'Dấu thăng (♯)','Nâng cao độ nốt lên nửa cung.', '{"kind":"accidental","note":"F","symbol":"♯"}'),
(4,2,'Dấu giáng (♭)','Hạ thấp độ cao nốt xuống nửa cung.', '{"kind":"accidental","note":"B","symbol":"♭"}'),
(4,3,'Dấu bình (♮)','Hủy bỏ hiệu lực của dấu thăng hoặc giáng trước đó.', '{"kind":"accidental","note":"F","symbol":"♮"}');

-- Bài 5: Làm quen phách (lesson_id = 5)
insert into lesson_points (lesson_id, order_index, heading, body, media, audio, example_tag) values
(5,1,'Phách là gì','Đơn vị thời gian đều nhau lặp lại trong bản nhạc, 4 phách đều nhau như hình dưới.',
   '{"kind":"beat_strip","pattern":[1,1,1,1]}', '{"type":"click","pattern":[1,1,1,1],"label":"Nghe 4 phách đều"}',
   'Ví dụ quen thuộc: bài Đội kèn tí hon có phách rất đều, rất hợp để tập vỗ tay đếm phách theo.'),
(5,2,'Luyện tập','Vỗ tay đều đặn theo số đếm 1-2-3-4 để cảm nhận phách.', null, null, null);

-- Bài 6: Nhịp 2/4 (lesson_id = 6)
insert into lesson_points (lesson_id, order_index, heading, body, media, audio, example_tag) values
(6,1,'Số chỉ nhịp','Số 2 trên: mỗi ô nhịp có 2 phách. Số 4 dưới: nốt đen = 1 phách.',
   '{"kind":"icon","index":5}', null, null),
(6,2,'Phách mạnh - nhẹ','Phách 1 luôn mạnh hơn (chấm to), phách 2 nhẹ hơn (chấm nhỏ), tạo cảm giác nhịp nhàng.',
   '{"kind":"beat_strip","pattern":[2,1,2,1]}', '{"type":"click","pattern":[1,0,1,0],"label":"Nghe mạnh - nhẹ"}',
   'Ví dụ quen thuộc: bài Cháu yêu bà được viết ở nhịp 2/4 — thử vừa hát vừa cảm nhận phách mạnh-nhẹ nhé.');

-- Bài 7: Hình nốt đen và nốt trắng (lesson_id = 7)
insert into lesson_points (lesson_id, order_index, heading, body, media) values
(7,1,'Nốt đen','Đầu nốt đặc, có đuôi, giá trị 1 phách.', '{"kind":"notehead","filled":true,"label":"1 phách"}'),
(7,2,'Nốt trắng','Đầu nốt rỗng, có đuôi, giá trị 2 phách.', '{"kind":"notehead","filled":false,"label":"2 phách"}');

-- Bài 8: Đọc nốt Đô - Rê - Mi (lesson_id = 8)
insert into lesson_points (lesson_id, order_index, heading, body, media, audio) values
(8,1,'Xướng âm là gì','Đọc tên nốt kết hợp đúng cao độ, không chỉ đọc chữ.', null, null),
(8,2,'Luyện tập','Đọc chậm rãi Đô - Rê - Mi, nghe kỹ độ cao tăng dần giữa các nốt.',
   '{"kind":"staff_notes","notes":["C","D","E"]}', '{"type":"sequence","notes":["C","D","E"],"label":"Nghe Đô Rê Mi"}');

-- Bài 9: Xướng âm bài tập 3 nốt (lesson_id = 9)
insert into lesson_points (lesson_id, order_index, heading, body, media, audio, example_tag) values
(9,1,'Câu nhạc ngắn','Ghép 3 nốt liền kề (ví dụ Rê-Mi-Rê) thành 1 câu nhạc đơn giản.',
   '{"kind":"staff_notes","notes":["D","E","D"]}', '{"type":"sequence","notes":["D","E","D"],"label":"Nghe câu nhạc"}',
   'Ví dụ quen thuộc: nhiều câu hát trong bài Bắc kim thang cũng chỉ dùng vài nốt liền kề như thế này.'),
(9,2,'Mục tiêu','Luyện phản xạ nghe và đọc đúng cao độ liên tiếp.', null, null, null);

-- Bài 10: Xướng âm 5 nốt (lesson_id = 10)
insert into lesson_points (lesson_id, order_index, heading, body, media, audio) values
(10,1,'Mở rộng quãng','Luyện xướng âm trong phạm vi 5 nốt liền kề.',
   '{"kind":"staff_notes","notes":["C","D","E","F","G"]}', '{"type":"sequence","notes":["C","D","E","F","G"],"label":"Nghe 5 nốt"}'),
(10,2,'Lợi ích','Cảm âm tốt hơn, chuẩn bị nền tảng cho các bài xướng âm dài hơn.', null, null);

-- Bài 11: Âm nhạc là gì? (lesson_id = 11)
insert into lesson_points (lesson_id, order_index, heading, body, media) values
(11,1,'Cao độ','Độ cao thấp của âm thanh.', '{"kind":"pitch_icon"}'),
(11,2,'Trường độ','Độ dài ngắn của âm thanh.', '{"kind":"duration_icon"}'),
(11,3,'Cường độ','Độ to nhỏ của âm thanh.', '{"kind":"volume_icon"}');

-- Bài 12: Nhạc cụ quen thuộc (lesson_id = 12)
insert into lesson_points (lesson_id, order_index, heading, body, media, audio) values
(12,1,'Piano','Phát âm bằng cách gõ phím, dây đàn được búa gõ vào bên trong.', '{"kind":"instrument_icon","name":"piano"}', '{"type":"timbre","name":"piano","label":"Nghe âm piano"}'),
(12,2,'Guitar','Phát âm bằng cách gảy hoặc búng dây.', '{"kind":"instrument_icon","name":"guitar"}', '{"type":"timbre","name":"guitar","label":"Nghe âm guitar"}'),
(12,3,'Trống','Phát âm bằng cách gõ vào mặt trống căng.', '{"kind":"instrument_icon","name":"drum"}', '{"type":"timbre","name":"drum","label":"Nghe âm trống"}'),
(12,4,'Violin','Phát âm bằng cách kéo cung cọ xát lên dây đàn.', '{"kind":"instrument_icon","name":"violin"}', '{"type":"timbre","name":"violin","label":"Nghe âm violin"}');

-- THE KHAI NIEM (On tap) - module_id theo thu tu 4 module So cap 1
insert into concepts (module_id, term, sub, audio_note, icon_index) values
(1,'Khuông nhạc','5 dòng, 4 khe', null, 0),
(1,'Đô Rê Mi Fa Sol La Si','7 tên nốt cơ bản','C',1),
(1,'Dòng & khe','vị trí nốt trên khuông','G',2),
(1,'# ♭ ♮','thăng - giáng - bình', null,3),
(2,'Phách','đơn vị thời gian đều', null,4),
(2,'Nhịp 2/4','2 phách mỗi ô nhịp', null,5),
(2,'Đen = 1 phách, Trắng = 2 phách','trường độ nốt', null,6),
(3,'Đô - Rê - Mi','xướng âm 3 nốt','E',7),
(3,'Câu nhạc ngắn','ghép 3 nốt liền kề','D',8),
(3,'5 nốt liền kề','Đô đến Sol','G',9),
(4,'Cao độ - Trường độ - Cường độ','3 yếu tố âm nhạc', null,10),
(4,'Piano - Guitar - Trống - Violin','nhạc cụ quen thuộc', null,11);

-- NGAN HANG CAU HOI SO CAP 1 (level_id = 1)
insert into questions (level_id, type, question_text, options, correct_answer, note, explanation) values
(1,'mc','Khuông nhạc gồm bao nhiêu dòng kẻ?','["4","5","6","7"]','5', null, null),
(1,'staff','Nhìn khuông nhạc, đây là nốt gì?','["Đô","Mi","Sol","La"]','Sol','G', null),
(1,'audio','Nghe âm thanh và chọn đúng tên nốt bạn vừa nghe:','["Đô","Rê","Mi","Fa"]','Rê','D', null),
(1,'match','Ký hiệu ♭ có nghĩa là gì?','["Nâng nửa cung","Hạ nửa cung","Hủy dấu hóa","Giữ nguyên cao độ"]','Hạ nửa cung', null, null),
(1,'mc','Nốt đen ngân dài bao nhiêu phách?','["1 phách","2 phách","3 phách","4 phách"]','1 phách', null, null),
(1,'staff','Nhìn khuông nhạc, đây là nốt gì?','["Đô","Rê","Mi","Sol"]','Đô','C', null),
(1,'audio','Nghe âm thanh và chọn đúng tên nốt bạn vừa nghe:','["Rê","Mi","Fa","Sol"]','Mi','E', null),
(1,'match','Nhịp 2/4 nghĩa là gì?','["Mỗi ô nhịp có 2 phách","Mỗi ô nhịp có 4 phách","Có 2 dòng nhạc","Có 4 dấu hóa"]','Mỗi ô nhịp có 2 phách', null, null),
(1,'mc','Nốt trắng ngân dài bao nhiêu phách?','["1 phách","2 phách","3 phách","4 phách"]','2 phách', null, null),
(1,'staff','Nhìn khuông nhạc, đây là nốt gì?','["Đô","Fa","Sol","La"]','Fa','F', null),
(1,'audio','Nghe âm thanh và chọn đúng tên nốt bạn vừa nghe:','["Đô","Rê","Fa","Sol"]','Fa','F', null),
(1,'match','Dấu thăng (♯) có nghĩa là gì?','["Nâng nửa cung","Hạ nửa cung","Hủy dấu hóa","Giữ nguyên cao độ"]','Nâng nửa cung', null, null),
(1,'mc','Khóa Sol xác định vị trí nốt nào trên khuông nhạc?','["Đô","Rê","Sol","La"]','Sol', null, null),
(1,'staff','Nhìn khuông nhạc, đây là nốt gì?','["Sol","La","Si","Đô"]','La','A', null),
(1,'audio','Nghe âm thanh và chọn đúng tên nốt bạn vừa nghe:','["Fa","Sol","La","Si"]','Sol','G', null),
(1,'match','3 yếu tố cơ bản của âm nhạc gồm những gì?','["Cao độ - Trường độ - Cường độ","Nhịp - Phách - Tiết tấu","Giai điệu - Hòa âm - Lời ca","Âm sắc - Âm vực - Âm lượng"]','Cao độ - Trường độ - Cường độ', null, null);

insert into questions (level_id, type, question_text, answers, explanation) values
(1,'fill','Nốt Sol viết bằng ký hiệu quốc tế là chữ gì? (viết in hoa 1 chữ cái)','["G"]', null),
(1,'fill','Nhịp 2/4 thì mỗi ô nhịp có bao nhiêu phách? (nhập số)','["2"]', null);
