import { Fragment, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

const MODULE_NAMES = ['Nhạc lý', 'Tiết tấu', 'Xướng âm', 'Hòa âm', 'Thường thức']

export default function StudentsAdmin() {
  const [students, setStudents] = useState([])
  const [levels, setLevels] = useState([])
  const [access, setAccess] = useState([])       // toàn bộ dòng student_access, tải thô
  const [codes, setCodes] = useState([])         // toàn bộ activation_codes đã dùng, tải thô
  const [expanded, setExpanded] = useState(null) // id học viên đang mở rộng
  const [nameDraft, setNameDraft] = useState('')
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
    const levelRows = rows.filter(r => !r.module_name)
    const moduleRows = rows.filter(r => r.module_name)
    const hasAll = levelRows.some(r => r.level_id === null)
    const levelIds = levelRows.filter(r => r.level_id !== null).map(r => r.level_id)
    const moduleNames = moduleRows.map(r => r.module_name)
    return { hasAll, levelIds, moduleNames }
  }
  function codesOf(userId) {
    return codes.filter(c => c.used_by === userId)
  }

  async function toggleAll(userId, checked) {
    if (checked) {
      const { error } = await supabase.from('student_access').insert({ user_id: userId, level_id: null })
      if (error) return setMsg({ type: 'error', text: error.message })
    } else {
      await supabase.from('student_access').delete().eq('user_id', userId).is('level_id', null).is('module_name', null)
    }
    reload()
  }
  async function toggleLevel(userId, levelId, checked) {
    if (checked) {
      const { error } = await supabase.from('student_access').insert({ user_id: userId, level_id: levelId })
      if (error) return setMsg({ type: 'error', text: error.message })
    } else {
      await supabase.from('student_access').delete().eq('user_id', userId).eq('level_id', levelId).is('module_name', null)
    }
    reload()
  }
  async function toggleModule(userId, moduleName, checked) {
    if (checked) {
      const { error } = await supabase.from('student_access').insert({ user_id: userId, level_id: null, module_name: moduleName })
      if (error) return setMsg({ type: 'error', text: error.message })
    } else {
      await supabase.from('student_access').delete().eq('user_id', userId).eq('module_name', moduleName)
    }
    reload()
  }

  async function detachCode(codeId) {
    if (!confirm('Gỡ mã này khỏi học viên? (mã sẽ trở thành chưa dùng, có thể cấp lại cho người khác — không tự động thu hồi quyền đã mở)')) return
    const { error } = await supabase.from('activation_codes').update({ used_by: null, used_at: null }).eq('id', codeId)
    if (error) setMsg({ type: 'error', text: error.message })
    reload()
  }

  async function sendPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    })
    setMsg({
      type: error ? 'error' : 'success',
      text: error ? error.message : `Đã gửi email đặt lại mật khẩu tới ${email}.`,
    })
  }

  async function saveName(userId) {
    const { data, error } = await supabase.rpc('admin_update_profile', { target_user_id: userId, new_full_name: nameDraft.trim() || null })
    if (error) return setMsg({ type: 'error', text: error.message })
    setMsg({ type: data.success ? 'success' : 'error', text: data.success ? 'Đã lưu tên.' : (data.message || 'Có lỗi xảy ra') })
    reload()
  }

  async function deactivate(userId) {
    if (!confirm('Vô hiệu hóa học viên này? Sẽ gỡ TOÀN BỘ quyền (cấp + module) đang có — tài khoản vẫn đăng nhập được nhưng trở về trạng thái demo. Muốn xóa hẳn tài khoản, dùng Supabase Dashboard.')) return
    await supabase.from('student_access').delete().eq('user_id', userId)
    setMsg({ type: 'success', text: 'Đã vô hiệu hóa — học viên trở về trạng thái tài khoản demo.' })
    reload()
  }

  return (
    <div className="admin-panel">
      <h3 style={{ fontSize: 14, color: 'var(--navy)', marginBottom: 10 }}>Danh sách học viên ({students.length})</h3>
      {msg && <div className={'admin-msg ' + msg.type}>{msg.text}</div>}

      <table className="admin-table">
        <thead><tr><th>Tên</th><th>Email</th><th>Ngày đăng ký</th><th>Quyền đang có</th><th></th></tr></thead>
        <tbody>
          {students.map(s => {
            const acc = accessOf(s.id)
            const levelSummary = acc.hasAll ? 'Tất cả 9 cấp' : levels.filter(l => acc.levelIds.includes(l.id)).map(l => l.name).join(', ')
            const moduleSummary = acc.moduleNames.join(', ')
            const summary = [levelSummary, moduleSummary].filter(Boolean).join(' · ') || 'Chưa mở gì'
            const isOpen = expanded === s.id
            return (
              <Fragment key={s.id}>
                <tr key={s.id}>
                  <td>{s.full_name || <span style={{ color: 'var(--muted)' }}>(chưa đặt)</span>}</td>
                  <td>{s.email || '(chưa rõ)'}</td>
                  <td>{new Date(s.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>{summary}</td>
                  <td>
                    <button className="admin-btn secondary" onClick={() => { setExpanded(isOpen ? null : s.id); setNameDraft(s.full_name || '') }}>
                      {isOpen ? 'Đóng' : 'Quản lý'}
                    </button>
                  </td>
                </tr>
                {isOpen && (
                  <tr key={s.id + '-detail'}>
                    <td colSpan={5} style={{ background: 'var(--bg)' }}>
                      <div style={{ padding: '12px 8px' }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Tên hiển thị</div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                          <input value={nameDraft} onChange={e => setNameDraft(e.target.value)} placeholder="Chưa đặt tên" style={{ flex: 1, padding: 8, borderRadius: 8, border: '1.5px solid var(--line)', fontSize: 13 }} />
                          <button className="admin-btn secondary" onClick={() => saveName(s.id)}>Lưu tên</button>
                        </div>

                        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Quyền theo cấp</div>
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

                        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Quyền theo module</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px', marginBottom: 14 }}>
                          {MODULE_NAMES.map(name => (
                            <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                              <input type="checkbox" checked={acc.moduleNames.includes(name)} onChange={e => toggleModule(s.id, name, e.target.checked)} />
                              {name}
                            </label>
                          ))}
                        </div>

                        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Mật khẩu</div>
                        <button className="admin-btn secondary" style={{ marginBottom: 14 }} onClick={() => sendPasswordReset(s.email)}>
                          Gửi email đặt lại mật khẩu
                        </button>
                        <br />

                        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Mã đã nhập</div>
                        {codesOf(s.id).length === 0 && <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Học viên này chưa nhập mã nào (quyền có thể do admin cấp trực tiếp ở trên).</div>}
                        {codesOf(s.id).map(c => (
                          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, marginBottom: 4 }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.code}</span>
                            <button className="admin-btn danger" style={{ padding: '4px 10px', fontSize: 11.5 }} onClick={() => detachCode(c.id)}>Gỡ mã</button>
                          </div>
                        ))}

                        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                          <button className="admin-btn danger" onClick={() => deactivate(s.id)}>Vô hiệu hóa học viên (gỡ toàn bộ quyền)</button>
                          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6 }}>
                            Muốn xóa hẳn tài khoản (không đăng nhập được nữa): vào Supabase Dashboard → Authentication → Users.
                          </div>
                        </div>
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
