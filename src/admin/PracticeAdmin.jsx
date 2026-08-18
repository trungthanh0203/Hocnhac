import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

export default function PracticeAdmin() {
  const [levels, setLevels] = useState([])
  const [levelId, setLevelId] = useState(null)
  const [scores, setScores] = useState([])
  const [form, setForm] = useState({ title: '', measures: '' })
  const [editingId, setEditingId] = useState(null)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    supabase.from('levels').select('id, name').order('order_index').then(({ data }) => {
      setLevels(data || [])
      if (data?.length) setLevelId(data[0].id)
    })
  }, [])

  function reload() {
    if (!levelId) return
    supabase.from('practice_scores').select('*').eq('level_id', levelId).order('order_index').then(({ data }) => setScores(data || []))
  }
  useEffect(reload, [levelId])

  function edit(s) {
    setEditingId(s.id)
    setForm({ title: s.title, measures: JSON.stringify(s.measures) })
  }
  function resetForm() { setForm({ title: '', measures: '' }); setEditingId(null) }

  async function save() {
    let measuresJson
    try { measuresJson = JSON.parse(form.measures) } catch { return setMsg({ type: 'error', text: 'Measures JSON không hợp lệ' }) }

    let error
    if (editingId) {
      ({ error } = await supabase.from('practice_scores').update({ title: form.title, measures: measuresJson }).eq('id', editingId))
    } else {
      const nextOrder = (scores[scores.length - 1]?.order_index || 0) + 1
      ({ error } = await supabase.from('practice_scores').insert({ level_id: levelId, order_index: nextOrder, title: form.title, measures: measuresJson }))
    }
    setMsg({ type: error ? 'error' : 'success', text: error ? error.message : 'Đã lưu giai điệu.' })
    if (!error) { resetForm(); reload() }
  }
  async function del(id) {
    if (!confirm('Xóa giai điệu này?')) return
    await supabase.from('practice_scores').delete().eq('id', id)
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
        <thead><tr><th>Tên bài</th><th>Số ô nhịp</th><th></th></tr></thead>
        <tbody>
          {scores.map(s => (
            <tr key={s.id}>
              <td>{s.title}</td>
              <td>{(s.measures || []).length}</td>
              <td>
                <button className="admin-btn secondary" style={{ marginRight: 6 }} onClick={() => edit(s)}>Sửa</button>
                <button className="admin-btn danger" onClick={() => del(s.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {scores.length === 0 && <div className="admin-empty">Cấp này chưa có giai điệu thực hành nào.</div>}

      <h4 style={{ fontSize: 13, color: 'var(--navy)', margin: '18px 0 8px' }}>{editingId ? 'Sửa giai điệu' : 'Thêm giai điệu mới'}</h4>
      <div className="admin-row">
        <div className="admin-field" style={{ flex: 1 }}>
          <label>Tên bài</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ width: '100%' }} />
        </div>
      </div>
      <div className="admin-row">
        <div className="admin-field" style={{ flex: 1 }}>
          <label>Measures (JSON — mảng các ô nhịp, mỗi ô nhịp là mảng nốt {"{note, dur}"})</label>
          <textarea rows={4} style={{ width: '100%' }}
            placeholder='[[{"note":"C","dur":1},{"note":"D","dur":1}],[{"note":"E","dur":2}]]'
            value={form.measures} onChange={e => setForm(f => ({ ...f, measures: e.target.value }))} />
        </div>
      </div>
      <div className="admin-row">
        <button className="admin-btn" onClick={save}>{editingId ? 'Lưu thay đổi' : 'Thêm giai điệu'}</button>
        {editingId && <button className="admin-btn secondary" onClick={resetForm}>Hủy sửa</button>}
      </div>
      {msg && <div className={'admin-msg ' + msg.type}>{msg.text}</div>}
    </div>
  )
}
