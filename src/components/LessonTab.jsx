import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import LessonContent from './LessonContent.jsx'

// Tab "Bài học" — chọn theo 2 bước Module -> Bài học.
// TỐI ƯU: toàn bộ module + bài học + nội dung của 1 cấp được tải trong ĐÚNG 1 LƯỢT GỌI DUY NHẤT
// (dùng nested select của Supabase) thay vì 3 lượt tuần tự như trước. Sau lượt tải đầu tiên,
// đổi qua lại giữa các Module hay Bài học không cần gọi mạng nữa — dữ liệu đã có sẵn trong bộ nhớ.
export default function LessonTab({ levelId, isPaidAccount }) {
  const [modules, setModules] = useState([])
  const [moduleId, setModuleId] = useState(null)
  const [lessonIndex, setLessonIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('modules')
        .select('id, name, order_index, lessons(id, order_index, title, goal, is_demo_free, lesson_points(*))')
        .eq('level_id', levelId)

      if (error) { setError(error.message); setLoading(false); return }

      // Sắp xếp lại ở client (Supabase không đảm bảo thứ tự các bảng lồng nhau)
      const sorted = (data || [])
        .slice().sort((a, b) => a.order_index - b.order_index)
        .map(m => ({
          ...m,
          lessons: (m.lessons || []).slice().sort((a, b) => a.order_index - b.order_index)
            .map(l => ({ ...l, lesson_points: (l.lesson_points || []).slice().sort((a, b) => a.order_index - b.order_index) })),
        }))

      setModules(sorted)
      setModuleId(sorted?.[0]?.id ?? null)
      setLessonIndex(0)
      setLoading(false)
    }
    load()
  }, [levelId])

  const currentModule = useMemo(() => modules.find(m => m.id === moduleId), [modules, moduleId])
  const lessons = currentModule?.lessons || []
  const lesson = lessons[lessonIndex]

  function handleModuleChange(id) {
    setModuleId(id)
    setLessonIndex(0) // chỉ đổi state cục bộ, không gọi mạng
  }

  if (loading) return <div className="loading">Đang tải…</div>
  if (error) return <div className="error-box">Lỗi tải dữ liệu: {error}</div>
  if (modules.length === 0) return <div className="loading">Chưa có nội dung nào cho cấp này.</div>

  const points = lesson?.lesson_points || []
  const locked = lesson ? (!isPaidAccount && !lesson.is_demo_free) : false

  return (
    <div className="panel">
      <div className="select-row">
        <div className="select-field narrow">
          <label>Module</label>
          <select value={moduleId || ''} onChange={e => handleModuleChange(Number(e.target.value))}>
            {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="select-field wide">
          <label>Bài học</label>
          <select value={lessons.length ? lessonIndex : ''} onChange={e => setLessonIndex(Number(e.target.value))} disabled={lessons.length === 0}>
            {lessons.length === 0
              ? <option>— chưa có bài —</option>
              : lessons.map((l, i) => <option key={l.id} value={i}>Bài {i + 1}: {l.title}</option>)}
          </select>
        </div>
      </div>

      {lesson && (
        <>
          <LessonContent lesson={lesson} points={points} locked={locked} eyebrow={currentModule?.name} />

          <div className="lesson-nav">
            <button className="nav-btn" disabled={lessonIndex === 0} onClick={() => setLessonIndex(i => i - 1)}>← Trước</button>
            <span className="progress">Bài {lessonIndex + 1} / {lessons.length}</span>
            <button className="nav-btn" disabled={lessonIndex === lessons.length - 1} onClick={() => setLessonIndex(i => i + 1)}>Sau →</button>
          </div>
        </>
      )}
    </div>
  )
}
