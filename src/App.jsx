import { useState } from 'react'
import Banner from './components/Banner.jsx'
import TabBar from './components/TabBar.jsx'
import LessonTab from './components/LessonTab.jsx'
import StubTab from './components/StubTab.jsx'

// TODO (giai đoạn tiếp theo):
// - isPaidAccount hiện đang hard-code false (tài khoản demo). Khi làm màn đăng nhập +
//   nhập mã kích hoạt (gọi RPC redeem_code trong schema.sql), thay giá trị này bằng
//   trạng thái đăng nhập thật lấy từ Supabase Auth + bảng student_access.
// - currentLevelId hiện hard-code = 1 (Sơ cấp 1). Sau khi có đăng nhập, lấy cấp cao nhất
//   học viên đã mở từ student_access để hiển thị đúng "Lộ trình của tôi".
// - ReviewTab / EarTrainingTab / TestTab / PracticeTab: port theo đúng mẫu LessonTab.jsx,
//   dùng lib/audio.js + lib/staffSvg.js đã có sẵn. Toàn bộ logic UI/UX đã chốt trong demo.

export default function App() {
  const [tab, setTab] = useState('lesson')
  const currentLevelId = 1
  const isPaidAccount = false

  return (
    <div className="phone">
      <Banner accountLabel={isPaidAccount ? 'Tài khoản đã kích hoạt' : 'Tài khoản Demo · 3 bài / mục'} />
      <TabBar active={tab} onChange={setTab} />

      {tab === 'lesson' && <LessonTab levelId={currentLevelId} isPaidAccount={isPaidAccount} />}
      {tab === 'review' && <StubTab title="Ôn tập" note="TODO: port từ demo — lướt xem gộp concepts + questions từ Supabase, xáo trộn ngẫu nhiên, không chấm điểm." />}
      {tab === 'ear' && <StubTab title="Luyện âm" note="TODO: port từ demo — 5 dạng luyện tai (so sánh cao độ, giống/khác, đoán tên nốt, đếm phách, vỗ tay tiết tấu), sinh câu hỏi ngẫu nhiên phía client dựa trên phạm vi nốt của cấp đang học." />}
      {tab === 'test' && <StubTab title="Bài test" note="TODO: port từ demo — lấy ngẫu nhiên 6 câu từ bảng questions theo levelId, hiện hết trên 1 trang, chấm điểm 1 lần, tô xanh/đỏ + lời khen theo mức điểm." />}
      {tab === 'practice' && <StubTab title="Thực hành" note="TODO: port từ demo — bản nhạc gốc 'Vui đến trường', đọc từng nốt + nghe cả bài kèm hiệu ứng nốt sáng theo giai điệu." />}
    </div>
  )
}
