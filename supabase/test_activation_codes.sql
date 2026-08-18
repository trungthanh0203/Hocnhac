-- ============================================================
-- DU LIEU TAM DE TEST activation_codes
-- Chạy trong Supabase SQL Editor. Đây là dữ liệu thử, xóa đi khi
-- không cần nữa (xem lệnh DELETE ở cuối file).
-- ============================================================

insert into activation_codes (code, unlock_level_id, expires_at, note) values
-- 1) Mã mở Sơ cấp 1, còn hạn 30 ngày -- dùng để test luồng redeem thành công
('SOCAP1-TEST01', 1, now() + interval '30 days', 'Mã test - mở Sơ cấp 1'),

-- 2) Mã mở TOÀN BỘ 9 cấp (unlock_level_id = null nghĩa là mở hết), còn hạn 7 ngày
('ALLACCESS-TEST', null, now() + interval '7 days', 'Mã test - mở tất cả 9 cấp'),

-- 3) Mã ĐÃ HẾT HẠN -- dùng để test app báo đúng lỗi "Mã đã hết hạn"
('EXPIRED-TEST', 1, now() - interval '1 day', 'Mã test - cố tình hết hạn để kiểm tra xử lý lỗi'),

-- 4) Mã mở Trung cấp 1 (level_id = 4 theo thứ tự seed 9 cấp), còn hạn 14 ngày
('TRUNGCAP1-TEST', 4, now() + interval '14 days', 'Mã test - mở Trung cấp 1');

-- Kiểm tra lại đã chèn đúng chưa:
select code, unlock_level_id, expires_at, used_by, note from activation_codes order by id;

-- ============================================================
-- Khi muốn xóa hết mã test (không ảnh hưởng mã thật bạn đã cấp cho học viên):
-- delete from activation_codes where code like '%-TEST%' or code like '%-TEST01';
-- ============================================================
