import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { renderMediaFullV3 as renderMediaFull } from '../lib/staffSvg.js'
import { playAudioAction } from '../lib/audio.js'

// Tab "Bài học" — lấy dữ liệu THẬT từ Supabase (bảng lessons + lesson_points)
// Đây là tab đã được nối dây đầy đủ để chứng minh luồng Supabase -> React hoạt động.
// Các tab còn lại (Ôn tập, Luyện âm, Bài test, Thực hành) dùng cùng cách lấy dữ liệu này,
// xem TODO ở mỗi file component tương ứng để port tiếp theo mẫu này.

export default function LessonTab({ levelId = 1, isPaidAccount = false }) {
  const [lessons, setLessons] = useState([])
  const [pointsByLesson, setPointsByLesson] = useState({})
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      // 1) Lấy các module thuộc cấp này, rồi lấy bài học thuộc các module đó
      const { data: modules, error: modErr } = await supabase
        .from('modules')
        .select('id, name, order_index')
        .eq('level_id', levelId)
        .order('order_index')

      if (modErr) { setError(modErr.message); setLoading(false); return }

      const moduleIds = modules.map(m => m.id)
      const moduleNameById = Object.fromEntries(modules.map(m => [m.id, m.name]))

      const { data: lessonRows, error: lesErr } = await supabase
        .from('lessons')
        .select('id, module_id, order_index, title, goal, is_demo_free')
        .in('module_id', moduleIds)
        .order('module_id')
        .order('order_index')

      if (lesErr) { setError(lesErr.message); setLoading(false); return }

      const lessonsWithModule = lessonRows.map(l => ({ ...l, moduleName: moduleNameById[l.module_id] }))

      // 2) Lấy toàn bộ lesson_points cho các bài học này trong 1 lần gọi
      const lessonIds = lessonsWithModule.map(l => l.id)
      const { data: pointRows, error: ptErr } = await supabase
        .from('lesson_points')
        .select('*')
        .in('lesson_id', lessonIds)
        .order('order_index')

      if (ptErr) { setError(ptErr.message); setLoading(false); return }

      const grouped = {}
      pointRows.forEach(p => {
        if (!grouped[p.lesson_id]) grouped[p.lesson_id] = []
        grouped[p.lesson_id].push(p)
      })

      setLessons(lessonsWithModule)
      setPointsByLesson(grouped)
      setLoading(false)
    }
    load()
  }, [levelId])

  if (loading) return <div className="loading">Đang tải bài học…</div>
  if (error) return <div className="error-box">Lỗi tải dữ liệu: {error}</div>
  if (lessons.length === 0) return <div className="loading">Chưa có bài học nào cho cấp này.</div>

  const lesson = lessons[index]
  const points = pointsByLesson[lesson.id] || []
  const locked = !isPaidAccount && !lesson.is_demo_free

  return (
    <div className="panel">
      <select value={index} onChange={e => setIndex(Number(e.target.value))} style={{width:'100%', padding:10, borderRadius:10, border:'1.5px solid var(--line)', marginBottom:12}}>
        {lessons.map((l, i) => (
          <option key={l.id} value={i}>Bài {i + 1}: {l.title}</option>
        ))}
      </select>

      <div className="lesson-box">
        <div className="lesson-eyebrow">{lesson.moduleName}</div>
        <div className="lesson-title">{lesson.title}</div>
        {lesson.goal && <div className="lesson-goal">🎯 Mục tiêu: {lesson.goal}</div>}

        {points.map((p, i) => (
          <div className="point" key={p.id}>
            <div className="num">{i + 1}</div>
            <div className="point-body">
              <h4>{p.heading}</h4>
              <p>{p.body}</p>
              {p.media && <div className="point-img" dangerouslySetInnerHTML={{ __html: renderMediaFull(p.media) }} />}
              {p.audio && (
                <span className="mini-play" onClick={() => playAudioAction(p.audio)}>
                  🔊 {p.audio.label}
                </span>
              )}
              {p.example_tag && <div className="example-tag">🎵 {p.example_tag}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="lesson-nav">
        <button className="nav-btn" disabled={index === 0} onClick={() => setIndex(i => i - 1)}>← Trước</button>
        <span className="progress">Bài {index + 1} / {lessons.length}</span>
        <button className="nav-btn" disabled={index === lessons.length - 1} onClick={() => setIndex(i => i + 1)}>Sau →</button>
      </div>

      {locked && <div className="lock">Bài này cần nâng cấp tài khoản để mở khóa</div>}
    </div>
  )
}
