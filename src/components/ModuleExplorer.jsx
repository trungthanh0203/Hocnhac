import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import LessonContent from './LessonContent.jsx'

const MODULE_NAMES = ['Nhạc lý', 'Tiết tấu', 'Xướng âm', 'Hòa âm', 'Thường thức']

// Chế độ "Học theo module": nối toàn bộ bài học của 1 module XUYÊN SUỐT cả 9 cấp
// thành 1 chuỗi bài liên tục theo đúng thứ tự tăng dần độ khó — dành cho người học
// chỉ muốn tập trung luyện 1 kỹ năng (ví dụ chỉ Xướng âm) mà không phải nhảy qua từng cấp.
// Toàn bộ dữ liệu tải trong 1 lượt gọi duy nhất (giống cách đã tối ưu ở tab Bài học).
export default function ModuleExplorer({ auth }) {
  const [moduleName, setModuleName] = useState('Xướng âm')
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('levels')
        .select('id, name, order_index, modules(id, name, lessons(id, order_index, title, goal, is_demo_free, lesson_points(*)))')

      if (!error) {
        const sorted = (data || []).slice().sort((a, b) => a.order_index - b.order_index)
        setLevels(sorted)
      }
      setLoading(false)
    }
    load()
  }, [])

  // Ghép toàn bộ bài học của module đang chọn thành 1 chuỗi xuyên suốt 9 cấp
  const timeline = useMemo(() => {
    const items = []
    levels.forEach(level => {
      const mod = (level.modules || []).find(m => m.name === moduleName)
      if (!mod) return
      const lessons = (mod.lessons || []).slice().sort((a, b) => a.order_index - b.order_index)
      lessons.forEach(lesson => {
        items.push({
          levelId: level.id,
          levelName: level.name,
          lesson: {
            ...lesson,
            lesson_points: (lesson.lesson_points || []).slice().sort((a, b) => a.order_index - b.order_index),
          },
        })
      })
    })
    return items
  }, [levels, moduleName])

  useEffect(() => { setIndex(0) }, [moduleName])

  if (loading) return <div className="loading">Đang tải…</div>
  if (timeline.length === 0) return <div className="loading">Chưa có nội dung cho module này.</div>

  const item = timeline[index]
  const isPaidForThisLevel = auth.isLevelUnlocked(item.levelId)
  const locked = !isPaidForThisLevel && !item.lesson.is_demo_free

  return (
    <div className="panel">
      <div className="lesson-eyebrow" style={{ marginBottom: 8 }}>Học theo module · xuyên suốt cả 9 cấp</div>
      <div className="chip-row">
        {MODULE_NAMES.map(name => (
          <div key={name} className={'chip' + (moduleName === name ? ' active' : '')} onClick={() => setModuleName(name)}>
            {name}
          </div>
        ))}
      </div>

      <LessonContent
        lesson={item.lesson}
        points={item.lesson.lesson_points}
        locked={locked}
        eyebrow={`${item.levelName} · ${moduleName}`}
      />

      <div className="lesson-nav">
        <button className="nav-btn" disabled={index === 0} onClick={() => setIndex(i => i - 1)}>← Trước</button>
        <span className="progress">{index + 1} / {timeline.length}</span>
        <button className="nav-btn" disabled={index === timeline.length - 1} onClick={() => setIndex(i => i + 1)}>Sau →</button>
      </div>
    </div>
  )
}
