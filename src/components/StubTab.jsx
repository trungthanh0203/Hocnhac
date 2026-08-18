// Khung tạm cho các tab chưa port đầy đủ sang Supabase.
// Logic hiển thị + tương tác của các tab này ĐÃ được kiểm chứng đầy đủ trong bản demo
// (file demo-app-nhac-v2.html) — việc còn lại chỉ là thay dữ liệu cứng (hard-code) bằng
// truy vấn Supabase, theo đúng mẫu đã làm ở LessonTab.jsx. Đây là việc lặp lại có khuôn mẫu,
// không phải thiết kế lại từ đầu.
export default function StubTab({ title, note }) {
  return (
    <div className="panel">
      <div className="lesson-box">
        <div className="lesson-title">{title}</div>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{note}</p>
      </div>
    </div>
  )
}
