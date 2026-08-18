import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { renderMediaFullV4 as renderMediaFull } from '../lib/staffSvg.js'
import { playAudioAction } from '../lib/audio.js'

// Tab "Bài học" — chọn theo 2 bước Module -> Bài học, giống hệt kiểu chọn trong trang quản trị
export default function LessonTab({ levelId, isPaidAccount }) {
  const [modules, setModules] = useState([])
  const [moduleId, setModuleId] = useState(null)
  const [lessons, setLessons] = useState([])
  const [lessonIndex, setLessonIndex] = useState(0)
  const [pointsByLesson, setPointsByLesson] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Bước 1: tải danh sách module của cấp đang xem
  useEffect(() => {
    async function loadModules() {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase.from('modules').select('id, name, order_index').eq('level_id', levelId).order('order_index')
      if (error) { setError(error.message); setLoading(false); return }
      setModules(data || [])
      setModuleId(data?.[0]?.id || null)
    }
    loadModules()
  }, [levelId])

  // Bước 2: khi đổi module, tải lại bài học + nội dung thuộc module đó
  useEffect(() => {
    if (!moduleId) return
    async function loadLessons() {
      setLoading(true)
      setError(null)
      const { data: lessonRows, error: lesErr } = await supabase
        .from('lessons').select('id, order_index, title, goal, is_demo_free')
        .eq('module_id', moduleId).order('order_index')
      if (lesErr) { setError(lesErr.message); setLoading(false); return }

      setLessons(lessonRows || [])
      setLessonIndex(0)

      const lessonIds = (lessonRows || []).map(l => l.id)
      if (lessonIds.length) {
        const { data: pointRows, error: ptErr } = await supabase
          .from('lesson_points').select('*').in('lesson_id', lessonIds).order('order_index')
        if (ptErr) { setError(ptErr.message); setLoading(false); return }
        const grouped = {}
        pointRows.forEach(p => { if (!grouped[p.lesson_id]) grouped[p.lesson_id] = []; grouped[p.lesson_id].push(p) })
        setPointsByLesson(grouped)
      } else {
        setPointsByLesson({})
      }
      setLoading(false)
    }
    loadLessons()
  }, [moduleId])

  if (loading) return <div className="loading">Đang tải…</div>
  if (error) return <div className="error-box">Lỗi tải dữ liệu: {error}</div>
  if (modules.length === 0) return <div className="loading">Chưa có nội dung nào cho cấp này.</div>

  const lesson = lessons[lessonIndex]
  const points = lesson ? (pointsByLesson[lesson.id] || []) : []
  const locked = lesson ? (!isPaidAccount && !lesson.is_demo_free) : false

  return (
    <div className="panel">
      <div className="select-row">
        <div className="select-field narrow">
          <label>Module</label>
          <select value={moduleId || ''} onChange={e => setModuleId(Number(e.target.value))}>
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
          <div className="lesson-box">
            <div className="lesson-eyebrow">{modules.find(m => m.id === moduleId)?.name}</div>
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
            <button className="nav-btn" disabled={lessonIndex === 0} onClick={() => setLessonIndex(i => i - 1)}>← Trước</button>
            <span className="progress">Bài {lessonIndex + 1} / {lessons.length}</span>
            <button className="nav-btn" disabled={lessonIndex === lessons.length - 1} onClick={() => setLessonIndex(i => i + 1)}>Sau →</button>
          </div>

          {locked && <div className="lock">Bài này cần nâng cấp tài khoản để mở khóa</div>}
        </>
      )}
    </div>
  )
}
