import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import LessonContent from './LessonContent.jsx'

const MODULE_NAMES = ['Nhạc lý', 'Tiết tấu', 'Xướng âm', 'Hòa âm', 'Thường thức']

// Chế độ "Học theo module": nối toàn bộ bài học của 1 module XUYÊN SUỐT cả 9 cấp
// thành 1 chuỗi bài liên tục theo đúng thứ tự tăng dần độ khó. Giao diện chọn theo
// đúng kiểu 2 dropdown như tab "Bài học" (Module -> Bài học) cho quen mắt, gọn hơn dãy chip.
export default function ModuleExplorer({ auth }) {
  const [moduleName, setModuleName] = useState(null)
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)

  // Tài khoản đã mua THEO MODULE -> chỉ hiện đúng (những) module đã mua trong dropdown.
  // Tài khoản demo/chưa đăng nhập -> vẫn hiện đủ 5 module để chọn (chỉ giới hạn ở dropdown Bài học).
  const availableModules = useMemo(() => {
    if (auth.accountMode === 'module' && auth.unlockedModuleNames.length > 0) {
      return MODULE_NAMES.filter(n => auth.unlockedModuleNames.includes(n))
    }
    return MODULE_NAMES
  }, [auth.accountMode, auth.unlockedModuleNames])

  useEffect(() => {
    if (!moduleName || !availableModules.includes(moduleName)) {
      setModuleName(availableModules[0] || null)
    }
  }, [availableModules]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const isDemo = auth.accountMode === 'demo'
  // Demo/chưa đăng nhập: dropdown chỉ liệt kê ĐÚNG 3 bài đầu tiên trong cả chuỗi
  // (không hiện hết rồi khóa từng bài — gọn và rõ ràng hơn hẳn).
  const visibleTimeline = isDemo ? timeline.slice(0, 3) : timeline

  const item = visibleTimeline[index]
  const isPaidForThisLevel = item ? auth.isLevelUnlocked(item.levelId) : false
  const isPaidForThisModule = auth.isModuleUnlocked(moduleName)
  const locked = item && !isDemo
    ? (!isPaidForThisLevel && !isPaidForThisModule && !item.lesson.is_demo_free)
    : false

  return (
    <div className="panel">
      <div className="lesson-eyebrow" style={{ marginBottom: 8 }}>Học theo module · xuyên suốt cả 9 cấp</div>

      <div className="select-row">
        <div className="select-field narrow">
          <label>Module</label>
          <select value={moduleName || ''} onChange={e => setModuleName(e.target.value)}>
            {availableModules.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <div className="select-field wide">
          <label>Bài học</label>
          <select value={visibleTimeline.length ? index : ''} onChange={e => setIndex(Number(e.target.value))} disabled={visibleTimeline.length === 0}>
            {visibleTimeline.length === 0
              ? <option>— chưa có bài —</option>
              : visibleTimeline.map((it, i) => (
                <option key={`${it.levelId}-${it.lesson.id}`} value={i}>
                  {it.levelName} · Bài {i + 1}: {it.lesson.title}
                </option>
              ))}
          </select>
        </div>
      </div>

      {visibleTimeline.length === 0 ? (
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
            <span className="progress">{index + 1} / {visibleTimeline.length}{isDemo ? ` (demo · tổng ${timeline.length} bài)` : ''}</span>
            <button className="nav-btn" disabled={index === visibleTimeline.length - 1} onClick={() => setIndex(i => i + 1)}>Sau →</button>
          </div>
        </>
      )}
    </div>
  )
}
