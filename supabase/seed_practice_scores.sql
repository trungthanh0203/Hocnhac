-- ============================================================
-- SEED: 2 giai điệu thực hành RIÊNG cho mỗi cấp (Sơ cấp 1-3, Trung cấp 1-3)
-- Chạy SAU khi đã chạy migrate_practice_scores.sql
-- Nguyên tắc: chỉ dùng dur 1 (đen) hoặc 2 (trắng); phạm vi nốt đúng những gì cấp đó đã dạy
-- Toàn bộ đều là giai điệu GỐC do app tự soạn, không dùng lại bài hát có sẵn nào (an toàn bản quyền)
-- ============================================================

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Sơ cấp 1'), 1, 'Vui đến trường',
'[[{"note":"C","dur":1},{"note":"D","dur":1}],[{"note":"E","dur":1},{"note":"F","dur":1}],[{"note":"G","dur":2}],[{"note":"G","dur":1},{"note":"F","dur":1}],[{"note":"E","dur":1},{"note":"D","dur":1}],[{"note":"C","dur":2}],[{"note":"E","dur":1},{"note":"G","dur":1}],[{"note":"C","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Sơ cấp 1'), 2, 'Nắng mai',
'[[{"note":"C","dur":1},{"note":"D","dur":1}],[{"note":"E","dur":1},{"note":"F","dur":1}],[{"note":"G","dur":2}],[{"note":"G","dur":1},{"note":"F","dur":1}],[{"note":"E","dur":1},{"note":"D","dur":1}],[{"note":"C","dur":2}],[{"note":"D","dur":1},{"note":"F","dur":1}],[{"note":"C","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Sơ cấp 2'), 1, 'Chiều quê',
'[[{"note":"E","dur":1},{"note":"F","dur":1}],[{"note":"G","dur":1},{"note":"A","dur":1}],[{"note":"B","dur":2}],[{"note":"B","dur":1},{"note":"A","dur":1}],[{"note":"G","dur":1},{"note":"F","dur":1}],[{"note":"E","dur":2}],[{"note":"F","dur":1},{"note":"A","dur":1}],[{"note":"E","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Sơ cấp 2'), 2, 'Bước chân vui',
'[[{"note":"G","dur":1},{"note":"A","dur":1}],[{"note":"B","dur":1},{"note":"C","dur":1}],[{"note":"D","dur":2}],[{"note":"D","dur":1},{"note":"C","dur":1}],[{"note":"B","dur":1},{"note":"A","dur":1}],[{"note":"G","dur":2}],[{"note":"A","dur":1},{"note":"C","dur":1}],[{"note":"G","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Sơ cấp 3'), 1, 'Trăng rằm',
'[[{"note":"C","dur":1},{"note":"D","dur":1}],[{"note":"E","dur":1},{"note":"F","dur":1}],[{"note":"G","dur":2}],[{"note":"G","dur":1},{"note":"F","dur":1}],[{"note":"E","dur":1},{"note":"D","dur":1}],[{"note":"C","dur":2}],[{"note":"E","dur":1},{"note":"G","dur":1}],[{"note":"C","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Sơ cấp 3'), 2, 'Đường về nhà',
'[[{"note":"D","dur":1},{"note":"E","dur":1}],[{"note":"F","dur":1},{"note":"G","dur":1}],[{"note":"A","dur":2}],[{"note":"A","dur":1},{"note":"G","dur":1}],[{"note":"F","dur":1},{"note":"E","dur":1}],[{"note":"D","dur":2}],[{"note":"E","dur":1},{"note":"G","dur":1}],[{"note":"D","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Trung cấp 1'), 1, 'Nhịp bước quãng ba',
'[[{"note":"C","dur":1},{"note":"E","dur":1}],[{"note":"G","dur":1},{"note":"E","dur":1}],[{"note":"C","dur":2}],[{"note":"D","dur":1},{"note":"F","dur":1}],[{"note":"A","dur":1},{"note":"F","dur":1}],[{"note":"D","dur":2}],[{"note":"E","dur":1},{"note":"G","dur":1}],[{"note":"C","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Trung cấp 1'), 2, 'Gam Đô trưởng dạo chơi',
'[[{"note":"E","dur":1},{"note":"F","dur":1}],[{"note":"G","dur":1},{"note":"A","dur":1}],[{"note":"B","dur":2}],[{"note":"B","dur":1},{"note":"A","dur":1}],[{"note":"G","dur":1},{"note":"F","dur":1}],[{"note":"E","dur":2}],[{"note":"F","dur":1},{"note":"A","dur":1}],[{"note":"E","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Trung cấp 2'), 1, 'Quãng bốn dạo bước',
'[[{"note":"C","dur":1},{"note":"F","dur":1}],[{"note":"D","dur":1},{"note":"G","dur":1}],[{"note":"C","dur":2}],[{"note":"G","dur":1},{"note":"D","dur":1}],[{"note":"F","dur":1},{"note":"C","dur":1}],[{"note":"G","dur":2}],[{"note":"C","dur":1},{"note":"F","dur":1}],[{"note":"C","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Trung cấp 2'), 2, 'Quãng năm vươn xa',
'[[{"note":"C","dur":1},{"note":"G","dur":1}],[{"note":"D","dur":1},{"note":"A","dur":1}],[{"note":"C","dur":2}],[{"note":"A","dur":1},{"note":"D","dur":1}],[{"note":"G","dur":1},{"note":"C","dur":1}],[{"note":"G","dur":2}],[{"note":"C","dur":1},{"note":"G","dur":1}],[{"note":"C","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Trung cấp 3'), 1, 'Giai điệu Sol trưởng',
'[[{"note":"G","dur":1},{"note":"A","dur":1}],[{"note":"B","dur":1},{"note":"C","dur":1}],[{"note":"D","dur":2}],[{"note":"D","dur":1},{"note":"C","dur":1}],[{"note":"B","dur":1},{"note":"A","dur":1}],[{"note":"G","dur":2}],[{"note":"B","dur":1},{"note":"D","dur":1}],[{"note":"G","dur":2}]]'::jsonb;

insert into practice_scores (level_id, order_index, title, measures)
select (select id from levels where name='Trung cấp 3'), 2, 'Câu kết vòng hòa âm',
'[[{"note":"C","dur":1},{"note":"E","dur":1}],[{"note":"G","dur":1},{"note":"F","dur":1}],[{"note":"A","dur":2}],[{"note":"G","dur":1},{"note":"F","dur":1}],[{"note":"E","dur":1},{"note":"D","dur":1}],[{"note":"G","dur":2}],[{"note":"B","dur":1},{"note":"D","dur":1}],[{"note":"C","dur":2}]]'::jsonb;
