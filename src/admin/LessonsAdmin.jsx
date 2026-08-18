import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

// Ghi chú: media/audio của lesson_points nhập dạng JSON thô (đúng cấu trúc mô tả
// trong supabase/schema.sql, ví dụ {"kind":"staff_notes","notes":["C","D","E"]}).
// Đây là đánh đổi hợp lý cho bản đầu tiên — soạn nội dung mới vẫn cần biết qua
// cấu trúc dữ liệu, nhưng không còn phải mở SQL Editor để gõ lệnh INSERT nữa.

export default function LessonsAdmin() {
  const [levels, setLevels] = useState([])
  const [levelId, setLevelId] = useState(null)
  const [modules, setModules] = useState([])
  const [moduleId, setModuleId] = useState(null)
  const [lessons, setLessons] = useState([])
  const [lessonId, setLessonId] = useState(null)
  const [points, setPoints] = useState([])
  const [msg, setMsg] = useState(null)

  const [lessonForm, setLessonForm] = useState({ title: '', goal: '', is_demo_free: false })
  const [pointForm, setPointForm] = useState({ heading: '', body: '', media: '', audio: '', example_tag: '' })
  const [editingPointId, setEditingPointId] = useState(null)

  useEffect(() => {
    supabase.from('levels').select('*').order('order_index').then(({ data }) => {
      setLevels(data || [])
      if (data?.length) setLevelId(data[0].id)
    })
  }, [])

  useEffect(() => {
    if (!levelId) return
    supabase.from('modules').select('*').eq('level_id', levelId).order('order_index').then(({ data }) => {
      setModules(data || [])
      setModuleId(data?.[0]?.id || null)
    })
  }, [levelId])

  function reloadLessons(modId) {
    supabase.from('lessons').select('*').eq('module_id', modId).order('order_index').then(({ data }) => {
      setLessons(data || [])
    })
  }
  useEffect(() => { if (moduleId) reloadLessons(moduleId) }, [moduleId])

  function reloadPoints(lesId) {
    supabase.from('lesson_points').select('*').eq('lesson_id', lesId).order('order_index').then(({ data }) => {
      setPoints(data || [])
    })
  }
  useEffect(() => {
    if (lessonId) {
      const l = lessons.find(x => x.id === lessonId)
      if (l) setLessonForm({ title: l.title, goal: l.goal || '', is_demo_free: l.is_demo_free })
      reloadPoints(lessonId)
    } else {
      setPoints([])
    }
  }, [lessonId, lessons])

  async function addLesson() {
    const nextOrder = (lessons[lessons.length - 1]?.order_index || 0) + 1
    const { data, error } = await supabase.from('lessons').insert({
      module_id: moduleId, order_index: nextOrder, title: 'Bài học mới', goal: '', is_demo_free: false,
    }).select().single()
    if (error) return setMsg({ type: 'error', text: error.message })
    reloadLessons(moduleId)
    setLessonId(data.id)
  }

  async function saveLesson() {
    const { error } = await supabase.from('lessons').update(lessonForm).eq('id', lessonId)
    setMsg({ type: error ? 'error' : 'success', text: error ? error.message : 'Đã lưu bài học.' })
    if (!error) reloadLessons(moduleId)
  }

  async function deleteLesson() {
    if (!confirm('Xóa bài học này (và toàn bộ nội dung bên trong)?')) return
    const { error } = await supabase.from('lessons').delete().eq('id', lessonId)
    if (error) return setMsg({ type: 'error', text: error.message })
    setLessonId(null)
    reloadLessons(moduleId)
  }

  function resetPointForm() {
    setPointForm({ heading: '', body: '', media: '', audio: '', example_tag: '' })
    setEditingPointId(null)
  }
  function editPoint(p) {
    setEditingPointId(p.id)
    setPointForm({
      heading: p.heading, body: p.body,
      media: p.media ? JSON.stringify(p.media) : '',
      audio: p.audio ? JSON.stringify(p.audio) : '',
      example_tag: p.example_tag || '',
    })
  }
  async function savePoint() {
    let mediaJson = null, audioJson = null
    try { mediaJson = pointForm.media ? JSON.parse(pointForm.media) : null } catch { return setMsg({ type: 'error', text: 'Media JSON không hợp lệ' }) }
    try { audioJson = pointForm.audio ? JSON.parse(pointForm.audio) : null } catch { return setMsg({ type: 'error', text: 'Audio JSON không hợp lệ' }) }

    const payload = { heading: pointForm.heading, body: pointForm.body, media: mediaJson, audio: audioJson, example_tag: pointForm.example_tag || null }

    let error
    if (editingPointId) {
      ({ error } = await supabase.from('lesson_points').update(payload).eq('id', editingPointId))
    } else {
      const nextOrder = (points[points.length - 1]?.order_index || 0) + 1
      ({ error } = await supabase.from('lesson_points').insert({ ...payload, lesson_id: lessonId, order_index: nextOrder }))
    }
    setMsg({ type: error ? 'error' : 'success', text: error ? error.message : 'Đã lưu ý.' })
    if (!error) { resetPointForm(); reloadPoints(lessonId) }
  }
  async function deletePoint(id) {
    if (!confirm('Xóa ý này?')) return
    await supabase.from('lesson_points').delete().eq('id', id)
    reloadPoints(lessonId)
  }

  return (
    <div className="admin-panel">
      <div className="admin-row">
        <div className="admin-field">
          <label>Cấp</label>
          <select value={levelId || ''} onChange={e => setLevelId(Number(e.target.value))}>
            {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
        <div className="admin-field">
          <label>Module</label>
          <select value={moduleId || ''} onChange={e => { setModuleId(Number(e.target.value)); setLessonId(null) }}>
            {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="admin-field">
          <label>Bài học</label>
          <select value={lessonId || ''} onChange={e => setLessonId(Number(e.target.value) || null)}>
            <option value="">— chọn bài —</option>
            {lessons.map(l => <option key={l.id} value={l.id}>Bài {l.order_index}: {l.title}</option>)}
          </select>
        </div>
        <button className="admin-btn secondary" onClick={addLesson}>+ Thêm bài mới</button>
      </div>

      {lessonId && (
        <>
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--line)' }} />
          <div className="admin-row">
            <div className="admin-field" style={{ flex: 1 }}>
              <label>Tiêu đề bài học</label>
              <input value={lessonForm.title} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} style={{ width: '100%' }} />
            </div>
          </div>
          <div className="admin-row">
            <div className="admin-field" style={{ flex: 1 }}>
              <label>Mục tiêu bài học</label>
              <input value={lessonForm.goal} onChange={e => setLessonForm(f => ({ ...f, goal: e.target.value }))} style={{ width: '100%' }} />
            </div>
          </div>
          <div className="admin-row">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <input type="checkbox" checked={lessonForm.is_demo_free} onChange={e => setLessonForm(f => ({ ...f, is_demo_free: e.target.checked }))} />
              Mở cho tài khoản Demo (3 bài đầu mỗi module)
            </label>
          </div>
          <div className="admin-row">
            <button className="admin-btn" onClick={saveLesson}>Lưu bài học</button>
            <button className="admin-btn danger" onClick={deleteLesson}>Xóa bài học</button>
          </div>

          <h3 style={{ fontSize: 14, color: 'var(--navy)', margin: '20px 0 10px' }}>Các ý trong bài ({points.length})</h3>
          <table className="admin-table">
            <thead><tr><th>#</th><th>Tiêu đề ý</th><th>Nội dung</th><th></th></tr></thead>
            <tbody>
              {points.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{p.heading}</td>
                  <td style={{ maxWidth: 300 }}>{p.body}</td>
                  <td>
                    <button className="admin-btn secondary" style={{ marginRight: 6 }} onClick={() => editPoint(p)}>Sửa</button>
                    <button className="admin-btn danger" onClick={() => deletePoint(p.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 style={{ fontSize: 13, color: 'var(--navy)', margin: '16px 0 8px' }}>{editingPointId ? 'Sửa ý' : 'Thêm ý mới'}</h4>
          <div className="admin-row">
            <div className="admin-field" style={{ flex: 1 }}>
              <label>Tiêu đề ý</label>
              <input value={pointForm.heading} onChange={e => setPointForm(f => ({ ...f, heading: e.target.value }))} style={{ width: '100%' }} />
            </div>
          </div>
          <div className="admin-row">
            <div className="admin-field" style={{ flex: 1 }}>
              <label>Nội dung</label>
              <textarea rows={2} value={pointForm.body} onChange={e => setPointForm(f => ({ ...f, body: e.target.value }))} style={{ width: '100%' }} />
            </div>
          </div>
          <div className="admin-row">
            <div className="admin-field">
              <label>Media (JSON, để trống nếu không có)</label>
              <textarea rows={2} placeholder='{"kind":"staff_notes","notes":["C","D","E"]}' value={pointForm.media} onChange={e => setPointForm(f => ({ ...f, media: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>Audio (JSON, để trống nếu không có)</label>
              <textarea rows={2} placeholder='{"type":"note","note":"C","label":"Nghe nốt Đô"}' value={pointForm.audio} onChange={e => setPointForm(f => ({ ...f, audio: e.target.value }))} />
            </div>
          </div>
          <div className="admin-row">
            <div className="admin-field" style={{ flex: 1 }}>
              <label>Ví dụ liên hệ (tùy chọn)</label>
              <input value={pointForm.example_tag} onChange={e => setPointForm(f => ({ ...f, example_tag: e.target.value }))} style={{ width: '100%' }} />
            </div>
          </div>
          <div className="admin-row">
            <button className="admin-btn" onClick={savePoint}>{editingPointId ? 'Lưu thay đổi' : 'Thêm ý'}</button>
            {editingPointId && <button className="admin-btn secondary" onClick={resetPointForm}>Hủy sửa</button>}
          </div>
        </>
      )}

      {msg && <div className={'admin-msg ' + msg.type}>{msg.text}</div>}
    </div>
  )
}
