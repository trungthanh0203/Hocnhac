import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // bỏ ký tự dễ nhầm (I, O, 0, 1)
  let s = 'MTH-'
  for (let i = 0; i < 8; i++) {
    if (i === 4) s += '-'
    s += chars[Math.floor(Math.random() * chars.length)]
  }
  return s
}

export default function CodesAdmin() {
  const [levels, setLevels] = useState([])
  const [codes, setCodes] = useState([])
  const [newLevelId, setNewLevelId] = useState('all')
  const [newDays, setNewDays] = useState(30)
  const [newNote, setNewNote] = useState('')
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    supabase.from('levels').select('id, name').order('order_index').then(({ data }) => setLevels(data || []))
    reload()
  }, [])

  function reload() {
    supabase.from('activation_codes').select('*, levels(name)').order('created_at', { ascending: false }).then(({ data }) => setCodes(data || []))
  }

  async function createCode() {
    const code = generateCode()
    const expiresAt = new Date(Date.now() + newDays * 86400000).toISOString()
    const { error } = await supabase.from('activation_codes').insert({
      code,
      unlock_level_id: newLevelId === 'all' ? null : Number(newLevelId),
      expires_at: expiresAt,
      note: newNote || null,
    })
    setMsg({ type: error ? 'error' : 'success', text: error ? error.message : `Đã tạo mã: ${code}` })
    if (!error) { setNewNote(''); reload() }
  }

  async function revoke(id) {
    if (!confirm('Thu hồi (xóa) mã này?')) return
    await supabase.from('activation_codes').delete().eq('id', id)
    reload()
  }

  function statusOf(c) {
    if (c.used_by) return { label: 'Đã dùng', cls: 'used' }
    if (c.expires_at && new Date(c.expires_at) < new Date()) return { label: 'Hết hạn', cls: 'expired' }
    return { label: 'Còn hiệu lực', cls: 'active' }
  }

  return (
    <div className="admin-panel">
      <h3 style={{ fontSize: 14, color: 'var(--navy)', marginBottom: 10 }}>Tạo mã kích hoạt mới</h3>
      <div className="admin-row">
        <div className="admin-field">
          <label>Mở cấp</label>
          <select value={newLevelId} onChange={e => setNewLevelId(e.target.value)}>
            <option value="all">Tất cả 9 cấp</option>
            {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
        <div className="admin-field">
          <label>Hạn dùng (số ngày)</label>
          <input type="number" min="1" value={newDays} onChange={e => setNewDays(Number(e.target.value))} style={{ width: 90 }} />
        </div>
        <div className="admin-field" style={{ flex: 1 }}>
          <label>Ghi chú (tùy chọn, ví dụ tên học viên)</label>
          <input value={newNote} onChange={e => setNewNote(e.target.value)} style={{ width: '100%' }} />
        </div>
        <button className="admin-btn" onClick={createCode}>+ Tạo mã ngẫu nhiên</button>
      </div>
      {msg && <div className={'admin-msg ' + msg.type}>{msg.text}</div>}

      <h3 style={{ fontSize: 14, color: 'var(--navy)', margin: '22px 0 10px' }}>Danh sách mã ({codes.length})</h3>
      <table className="admin-table">
        <thead><tr><th>Mã</th><th>Mở cấp</th><th>Hạn dùng</th><th>Trạng thái</th><th>Ghi chú</th><th></th></tr></thead>
        <tbody>
          {codes.map(c => {
            const s = statusOf(c)
            return (
              <tr key={c.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.code}</td>
                <td>{c.levels?.name || 'Tất cả 9 cấp'}</td>
                <td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('vi-VN') : '—'}</td>
                <td><span className={'admin-badge ' + s.cls}>{s.label}</span></td>
                <td>{c.note || ''}</td>
                <td><button className="admin-btn danger" onClick={() => revoke(c.id)}>Thu hồi</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {codes.length === 0 && <div className="admin-empty">Chưa có mã kích hoạt nào.</div>}
    </div>
  )
}
