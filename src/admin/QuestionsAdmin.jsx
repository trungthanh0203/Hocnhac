import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

const TYPES = ['mc', 'staff', 'audio', 'match', 'fill']

const emptyForm = { type: 'mc', question_text: '', options: '', correct_answer: '', answers: '', note: '', explanation: '' }

export default function QuestionsAdmin() {
  const [levels, setLevels] = useState([])
  const [levelId, setLevelId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    supabase.from('levels').select('*').order('order_index').then(({ data }) => {
      setLevels(data || [])
      if (data?.length) setLevelId(data[0].id)
    })
  }, [])

  function reload() {
    if (!levelId) return
    supabase.from('questions').select('*').eq('level_id', levelId).then(({ data }) => setQuestions(data || []))
  }
  useEffect(reload, [levelId])

  function edit(q) {
    setEditingId(q.id)
    setForm({
      type: q.type, question_text: q.question_text,
      options: (q.options || []).join(', '),
      correct_answer: q.correct_answer || '',
      answers: (q.answers || []).join(', '),
      note: q.note || '', explanation: q.explanation || '',
    })
  }
  function resetForm() { setForm(emptyForm); setEditingId(null) }

  async function save() {
    const payload = {
      level_id: levelId,
      type: form.type,
      question_text: form.question_text,
      options: form.type === 'fill' ? null : form.options.split(',').map(s => s.trim()).filter(Boolean),
      correct_answer: form.type === 'fill' ? null : form.correct_answer,
      answers: form.type === 'fill' ? form.answers.split(',').map(s => s.trim()).filter(Boolean) : null,
      note: (form.type === 'staff' || form.type === 'audio') ? form.note : null,
      explanation: form.explanation || null,
    }
    let error
    if (editingId) ({ error } = await supabase.from('questions').update(payload).eq('id', editingId))
    else ({ error } = await supabase.from('questions').insert(payload))
    setMsg({ type: error ? 'error' : 'success', text: error ? error.message : 'Đã lưu câu hỏi.' })
    if (!error) { resetForm(); reload() }
  }
  async function del(id) {
    if (!confirm('Xóa câu hỏi này?')) return
    await supabase.from('questions').delete().eq('id', id)
    reload()
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
      </div>

      <table className="admin-table">
        <thead><tr><th>Loại</th><th>Câu hỏi</th><th>Đáp án đúng</th><th></th></tr></thead>
        <tbody>
          {questions.map(q => (
            <tr key={q.id}>
              <td>{q.type}</td>
              <td style={{ maxWidth: 320 }}>{q.question_text}</td>
              <td>{q.correct_answer || (q.answers || []).join(', ')}</td>
              <td>
                <button className="admin-btn secondary" style={{ marginRight: 6 }} onClick={() => edit(q)}>Sửa</button>
                <button className="admin-btn danger" onClick={() => del(q.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {questions.length === 0 && <div className="admin-empty">Chưa có câu hỏi nào cho cấp này.</div>}

      <h4 style={{ fontSize: 13, color: 'var(--navy)', margin: '18px 0 8px' }}>{editingId ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</h4>
      <div className="admin-row">
        <div className="admin-field">
          <label>Loại câu hỏi</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {(form.type === 'staff' || form.type === 'audio') && (
          <div className="admin-field">
            <label>Tên nốt (C/D/E/F/G/A/B)</label>
            <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} style={{ width: 80 }} />
          </div>
        )}
      </div>
      <div className="admin-row">
        <div className="admin-field" style={{ flex: 1 }}>
          <label>Nội dung câu hỏi</label>
          <textarea rows={2} value={form.question_text} onChange={e => setForm(f => ({ ...f, question_text: e.target.value }))} style={{ width: '100%' }} />
        </div>
      </div>

      {form.type === 'fill' ? (
        <div className="admin-row">
          <div className="admin-field" style={{ flex: 1 }}>
            <label>Các đáp án chấp nhận (cách nhau bởi dấu phẩy)</label>
            <input value={form.answers} onChange={e => setForm(f => ({ ...f, answers: e.target.value }))} style={{ width: '100%' }} placeholder="G, g" />
          </div>
        </div>
      ) : (
        <>
          <div className="admin-row">
            <div className="admin-field" style={{ flex: 1 }}>
              <label>Các lựa chọn (cách nhau bởi dấu phẩy)</label>
              <input value={form.options} onChange={e => setForm(f => ({ ...f, options: e.target.value }))} style={{ width: '100%' }} placeholder="Đô, Rê, Mi, Fa" />
            </div>
          </div>
          <div className="admin-row">
            <div className="admin-field" style={{ flex: 1 }}>
              <label>Đáp án đúng (phải khớp đúng chữ với 1 trong các lựa chọn trên)</label>
              <input value={form.correct_answer} onChange={e => setForm(f => ({ ...f, correct_answer: e.target.value }))} style={{ width: '100%' }} />
            </div>
          </div>
        </>
      )}

      <div className="admin-row">
        <button className="admin-btn" onClick={save}>{editingId ? 'Lưu thay đổi' : 'Thêm câu hỏi'}</button>
        {editingId && <button className="admin-btn secondary" onClick={resetForm}>Hủy sửa</button>}
      </div>
      {msg && <div className={'admin-msg ' + msg.type}>{msg.text}</div>}
    </div>
  )
}
