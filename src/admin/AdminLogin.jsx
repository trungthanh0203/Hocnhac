import { useState } from 'react'

export default function AdminLogin({ auth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    const err = await auth.signIn(email, password)
    setBusy(false)
    if (err) setMsg(err.message)
  }

  return (
    <div className="admin-login">
      <h2 style={{ color: 'var(--navy)', marginBottom: 4 }}>Trang quản trị</h2>
      <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 18 }}>Học nhạc cùng Mr.Thành</p>
      <form onSubmit={handleSubmit}>
        <div className="admin-field" style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div className="admin-field" style={{ marginBottom: 14 }}>
          <label>Mật khẩu</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} />
        </div>
        <button className="admin-btn" style={{ width: '100%' }} disabled={busy} type="submit">Đăng nhập</button>
      </form>
      {msg && <div className="admin-msg error">{msg}</div>}
      {auth.user && !auth.isAdmin && (
        <div className="admin-msg error">Tài khoản này không có quyền quản trị.</div>
      )}
    </div>
  )
}
