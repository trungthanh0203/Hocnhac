-- ============================================================
-- DU LIEU TAM DE TEST activation_codes
-- Chạy trong Supabase SQL Editor. Đây là dữ liệu thử, xóa đi khi
-- không cần nữa (xem lệnh DELETE ở cuối file).
-- Lưu ý: cần đã chạy supabase/migrate_multi_level_codes.sql trước
-- (hoặc dùng schema.sql bản mới nếu cài từ đầu) để có cột unlock_level_ids.
-- ============================================================

insert into activation_codes (code, unlock_level_ids, expires_at, note) values
-- 1) Mã mở Sơ cấp 1, còn hạn 30 ngày -- dùng để test luồng redeem thành công
('SOCAP1-TEST01', array[1], now() + interval '30 days', 'Mã test - mở Sơ cấp 1'),

-- 2) Mã mở TOÀN BỘ 9 cấp (unlock_level_ids = null nghĩa là mở hết), còn hạn 7 ngày
('ALLACCESS-TEST', null, now() + interval '7 days', 'Mã test - mở tất cả 9 cấp'),

-- 3) Mã ĐÃ HẾT HẠN -- dùng để test app báo đúng lỗi "Mã đã hết hạn"
('EXPIRED-TEST', array[1], now() - interval '1 day', 'Mã test - cố tình hết hạn để kiểm tra xử lý lỗi'),

-- 4) Mã mở Trung cấp 1, còn hạn 14 ngày
('TRUNGCAP1-TEST', array[4], now() + interval '14 days', 'Mã test - mở Trung cấp 1'),

-- 5) Mã mở NHIỀU cấp cùng lúc: Sơ cấp 1 + Sơ cấp 2 + Sơ cấp 3
('SOCAP-TRON-BO', array[1,2,3], now() + interval '60 days', 'Mã test - mở trọn bộ 3 cấp Sơ cấp');

-- Kiểm tra lại đã chèn đúng chưa:
select code, unlock_level_ids, expires_at, used_by, note from activation_codes order by id;

-- ============================================================
-- Khi muốn xóa hết mã test (không ảnh hưởng mã thật bạn đã cấp cho học viên):
-- delete from activation_codes where code like '%-TEST%' or code like '%-TEST01' or code like 'SOCAP-TRON-BO';
-- ============================================================
