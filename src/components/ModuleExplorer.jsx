import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import LessonContent from './LessonContent.jsx'

const MODULE_NAMES = ['Nhạc lý', 'Tiết tấu', 'Xướng âm', 'Hòa âm', 'Thường thức']

// Chế độ "Học theo module": nối toàn bộ bài học của 1 module XUYÊN SUỐT cả 9 cấp
// thành 1 chuỗi bài liên tục theo đúng thứ tự tăng dần độ khó. Giao diện chọn theo
// đúng kiểu 2 dropdown như tab "Bài học" (Module -> Bài học) cho quen mắt, gọn hơn dãy chip.
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

  const item = timeline[index]
  const isPaidForThisLevel = item ? auth.isLevelUnlocked(item.levelId) : false
  const isPaidForThisModule = auth.isModuleUnlocked(moduleName)
  const locked = item ? (!isPaidForThisLevel && !isPaidForThisModule && !item.lesson.is_demo_free) : false

  return (
    <div className="panel">
      <div className="lesson-eyebrow" style={{ marginBottom: 8 }}>Học theo module · xuyên suốt cả 9 cấp</div>

      <div className="select-row">
        <div className="select-field narrow">
          <label>Module</label>
          <select value={moduleName} onChange={e => setModuleName(e.target.value)}>
            {MODULE_NAMES.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <div className="select-field wide">
          <label>Bài học</label>
          <select value={timeline.length ? index : ''} onChange={e => setIndex(Number(e.target.value))} disabled={timeline.length === 0}>
            {timeline.length === 0
              ? <option>— chưa có bài —</option>
              : timeline.map((it, i) => (
                <option key={`${it.levelId}-${it.lesson.id}`} value={i}>
                  {it.levelName} · Bài {i + 1}: {it.lesson.title}
                </option>
              ))}
          </select>
        </div>
      </div>

      {timeline.length === 0 ? (
        <div className="loading">Chưa có nội dung cho module này.</div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
