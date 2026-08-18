import { Fragment, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

export default function StudentsAdmin() {
  const [students, setStudents] = useState([])
  const [levels, setLevels] = useState([])
  const [access, setAccess] = useState([])       // toàn bộ dòng student_access, tải thô
  const [codes, setCodes] = useState([])         // toàn bộ activation_codes đã dùng, tải thô
  const [expanded, setExpanded] = useState(null) // id học viên đang mở rộng
  const [msg, setMsg] = useState(null)

  function reload() {
    supabase.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false }).then(({ data }) => setStudents(data || []))
    supabase.from('levels').select('id, name').order('order_index').then(({ data }) => setLevels(data || []))
    supabase.from('student_access').select('*').then(({ data }) => setAccess(data || []))
    supabase.from('activation_codes').select('*').not('used_by', 'is', null).then(({ data }) => setCodes(data || []))
  }
  useEffect(reload, [])

  function accessOf(userId) {
    const rows = access.filter(a => a.user_id === userId)
    const hasAll = rows.some(r => r.level_id === null)
    const levelIds = rows.filter(r => r.level_id !== null).map(r => r.level_id)
    return { hasAll, levelIds }
  }
  function codesOf(userId) {
    return codes.filter(c => c.used_by === userId)
  }

  async function toggleAll(userId, checked) {
    if (checked) {
      const { error } = await supabase.from('student_access').insert({ user_id: userId, level_id: null })
      if (error) return setMsg({ type: 'error', text: error.message })
    } else {
      await supabase.from('student_access').delete().eq('user_id', userId).is('level_id', null)
    }
    reload()
  }

  async function toggleLevel(userId, levelId, checked) {
    if (checked) {
      const { error } = await supabase.from('student_access').insert({ user_id: userId, level_id: levelId })
      if (error) return setMsg({ type: 'error', text: error.message })
    } else {
      await supabase.from('student_access').delete().eq('user_id', userId).eq('level_id', levelId)
    }
    reload()
  }

  async function detachCode(codeId) {
    if (!confirm('Gỡ mã này khỏi học viên? (mã sẽ trở thành chưa dùng, có thể cấp lại cho người khác — không tự động thu hồi quyền đã mở)')) return
    const { error } = await supabase.from('activation_codes').update({ used_by: null, used_at: null }).eq('id', codeId)
    if (error) setMsg({ type: 'error', text: error.message })
    reload()
  }

  return (
    <div className="admin-panel">
      <h3 style={{ fontSize: 14, color: 'var(--navy)', marginBottom: 10 }}>Danh sách học viên ({students.length})</h3>
      {msg && <div className={'admin-msg ' + msg.type}>{msg.text}</div>}

      <table className="admin-table">
        <thead><tr><th>Email</th><th>Ngày đăng ký</th><th>Các cấp đã mở</th><th></th></tr></thead>
        <tbody>
          {students.map(s => {
            const acc = accessOf(s.id)
            const summary = acc.hasAll ? 'Tất cả 9 cấp' : (levels.filter(l => acc.levelIds.includes(l.id)).map(l => l.name).join(', ') || 'Chưa mở cấp nào')
            const isOpen = expanded === s.id
            return (
              <Fragment key={s.id}>
                <tr key={s.id}>
                  <td>{s.email || '(chưa rõ)'}</td>
                  <td>{new Date(s.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>{summary}</td>
                  <td>
                    <button className="admin-btn secondary" onClick={() => setExpanded(isOpen ? null : s.id)}>
                      {isOpen ? 'Đóng' : 'Quản lý'}
                    </button>
                  </td>
                </tr>
                {isOpen && (
                  <tr key={s.id + '-detail'}>
                    <td colSpan={4} style={{ background: 'var(--bg)' }}>
                      <div style={{ padding: '12px 8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                          <input type="checkbox" checked={acc.hasAll} onChange={e => toggleAll(s.id, e.target.checked)} />
                          Mở tất cả 9 cấp
                        </label>
                        {!acc.hasAll && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px 14px', marginBottom: 14 }}>
                            {levels.map(l => (
                              <label key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                                <input type="checkbox" checked={acc.levelIds.includes(l.id)} onChange={e => toggleLevel(s.id, l.id, e.target.checked)} />
                                {l.name}
                              </label>
                            ))}
                          </div>
                        )}

                        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Mã đã nhập</div>
                        {codesOf(s.id).length === 0 && <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Học viên này chưa nhập mã nào (quyền có thể do admin cấp trực tiếp ở trên).</div>}
                        {codesOf(s.id).map(c => (
                          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, marginBottom: 4 }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.code}</span>
                            <button className="admin-btn danger" style={{ padding: '4px 10px', fontSize: 11.5 }} onClick={() => detachCode(c.id)}>Gỡ mã</button>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
      {students.length === 0 && <div className="admin-empty">Chưa có học viên nào đăng ký.</div>}
    </div>
  )
}
