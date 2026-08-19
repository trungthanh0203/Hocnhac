import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

const ROLE_LABEL = { admin: 'Admin', super_admin: 'Super Admin' }

// Quản lý các tài khoản Admin/Super Admin. Chỉ Super Admin mới thấy các nút
// thăng/hạ quyền — Admin thường chỉ xem được danh sách (không sửa được ai).
export default function AdminsAdmin({ isSuperAdmin }) {
  const [admins, setAdmins] = useState([])
  const [promoteEmail, setPromoteEmail] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  function reload() {
    supabase.from('profiles').select('*').in('role', ['admin', 'super_admin']).order('created_at', { ascending: false })
      .then(({ data }) => setAdmins(data || []))
  }
  useEffect(reload, [])

  async function promote() {
    setBusy(true); setMsg(null)
    const { data: target, error: findErr } = await supabase.from('profiles').select('id, role').eq('email', promoteEmail.trim()).single()
    if (findErr || !target) { setBusy(false); return setMsg({ type: 'error', text: 'Không tìm thấy tài khoản với email này (họ cần đăng ký trước qua app học viên).' }) }
    const { data, error } = await supabase.rpc('set_user_role', { target_user_id: target.id, new_role: 'admin' })
    setBusy(false)
    if (error) return setMsg({ type: 'error', text: error.message })
    setMsg({ type: data.success ? 'success' : 'error', text: data.message || (data.success ? 'Đã cấp quyền admin.' : 'Có lỗi xảy ra') })
    if (data.success) { setPromoteEmail(''); reload() }
  }

  async function demote(userId) {
    if (!confirm('Hạ tài khoản này xuống Học viên (bỏ quyền quản trị)?')) return
    const { data, error } = await supabase.rpc('set_user_role', { target_user_id: userId, new_role: 'student' })
    if (error) return setMsg({ type: 'error', text: error.message })
    setMsg({ type: data.success ? 'success' : 'error', text: data.message || (data.success ? 'Đã hạ quyền.' : 'Có lỗi xảy ra') })
    reload()
  }

  return (
    <div className="admin-panel">
      <h3 style={{ fontSize: 14, color: 'var(--navy)', marginBottom: 10 }}>Danh sách quản trị viên ({admins.length})</h3>
      <table className="admin-table">
        <thead><tr><th>Email</th><th>Vai trò</th><th>Ngày cấp quyền</th>{isSuperAdmin && <th></th>}</tr></thead>
        <tbody>
          {admins.map(a => (
            <tr key={a.id}>
              <td>{a.email}</td>
              <td><span className={'admin-badge ' + (a.role === 'super_admin' ? 'active' : 'used')}>{ROLE_LABEL[a.role]}</span></td>
              <td>{new Date(a.created_at).toLocaleDateString('vi-VN')}</td>
              {isSuperAdmin && (
                <td>
                  {a.role === 'admin' && <button className="admin-btn danger" onClick={() => demote(a.id)}>Hạ xuống Học viên</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isSuperAdmin ? (
        <>
          <h3 style={{ fontSize: 14, color: 'var(--navy)', margin: '22px 0 10px' }}>Cấp quyền Admin mới</h3>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 10 }}>
            Người được cấp quyền cần đã đăng ký tài khoản trước (qua app học viên, nút Đăng nhập → Đăng ký), sau đó nhập đúng email họ đã dùng vào đây.
          </p>
          <div className="admin-row">
            <div className="admin-field" style={{ flex: 1 }}>
              <label>Email tài khoản đã đăng ký</label>
              <input value={promoteEmail} onChange={e => setPromoteEmail(e.target.value)} style={{ width: '100%' }} placeholder="ten@vidu.com" />
            </div>
            <button className="admin-btn" disabled={busy} onClick={promote}>Cấp quyền Admin</button>
          </div>
        </>
      ) : (
        <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 16 }}>Chỉ Super Admin mới cấp/hạ được quyền quản trị viên.</p>
      )}

      {msg && <div className={'admin-msg ' + msg.type}>{msg.text}</div>}
    </div>
  )
}
