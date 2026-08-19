import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

// Trang xử lý link đặt lại mật khẩu gửi qua email (Supabase tự chuyển hướng về đây
// kèm 1 phiên đăng nhập tạm thời — chỉ đủ quyền để đổi mật khẩu, không phải quyền đầy đủ).
export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) return setMsg({ type: 'error', text: 'Mật khẩu cần ít nhất 6 ký tự.' })
    if (password !== confirm) return setMsg({ type: 'error', text: 'Mật khẩu nhập lại không khớp.' })
    setBusy(true); setMsg(null)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) setMsg({ type: 'error', text: error.message })
    else { setDone(true); setMsg({ type: 'success', text: 'Đổi mật khẩu thành công! Quay lại app và đăng nhập bằng mật khẩu mới.' }) }
  }

  return (
    <div className="admin-login">
      <h2 style={{ color: 'var(--navy)', marginBottom: 4 }}>Đặt lại mật khẩu</h2>
      <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 18 }}>Học nhạc cùng Mr.Thành</p>

      {!ready ? (
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          Đang xác thực liên kết… nếu trang này không tự chuyển sau vài giây, hãy quay lại email và bấm lại đúng liên kết vừa nhận.
        </p>
      ) : done ? (
        <a href="/" className="admin-btn" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>Về trang chủ</a>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="admin-field" style={{ marginBottom: 10 }}>
            <label>Mật khẩu mới</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div className="admin-field" style={{ marginBottom: 14 }}>
            <label>Nhập lại mật khẩu mới</label>
            <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} style={{ width: '100%' }} />
          </div>
          <button className="admin-btn" style={{ width: '100%' }} disabled={busy} type="submit">Đổi mật khẩu</button>
        </form>
      )}
      {msg && <div className={'admin-msg ' + msg.type} style={{ marginTop: 12 }}>{msg.text}</div>}
    </div>
  )
}
