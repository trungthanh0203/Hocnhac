import { useState } from 'react'

// Panel đăng nhập / đăng ký / nhập mã kích hoạt — mở ra dạng thả xuống từ Banner
export default function AuthPanel({ auth, open, onClose }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  if (!open) return null

  async function handleAuth(e) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    const err = mode === 'signin' ? await auth.signIn(email, password) : await auth.signUp(email, password)
    setBusy(false)
    if (err) setMsg({ type: 'error', text: err.message })
    else if (mode === 'signup') setMsg({ type: 'success', text: 'Đăng ký thành công! Kiểm tra email để xác nhận (nếu Supabase yêu cầu), sau đó đăng nhập.' })
  }

  async function handleRedeem(e) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    const result = await auth.redeemCode(code.trim())
    setBusy(false)
    setMsg({ type: result.success ? 'success' : 'error', text: result.message || (result.success ? 'Kích hoạt thành công!' : 'Có lỗi xảy ra') })
    if (result.success) setCode('')
  }

  return (
    <div className="roadmap-panel">
      <div style={{ padding: 16 }}>
        {!auth.user ? (
          <>
            <div className="chip-row">
              <div className={'chip' + (mode === 'signin' ? ' active' : '')} onClick={() => setMode('signin')}>Đăng nhập</div>
              <div className={'chip' + (mode === 'signup' ? ' active' : '')} onClick={() => setMode('signup')}>Đăng ký</div>
            </div>
            <form onSubmit={handleAuth}>
              <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 8, border: '1.5px solid var(--line)' }} />
              <input type="password" required placeholder="Mật khẩu (tối thiểu 6 ký tự)" value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1.5px solid var(--line)' }} />
              <button className="next-btn" disabled={busy} type="submit">{mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản'}</button>
            </form>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, marginBottom: 10 }}>Đang đăng nhập: <strong>{auth.user.email}</strong></div>
            <form onSubmit={handleRedeem}>
              <input type="text" required placeholder="Nhập mã kích hoạt" value={code} onChange={e => setCode(e.target.value)}
                style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1.5px solid var(--line)' }} />
              <button className="next-btn" disabled={busy} type="submit">Kích hoạt mã</button>
            </form>
            <button className="nav-btn" style={{ marginTop: 10, width: '100%' }} onClick={auth.signOut}>Đăng xuất</button>
          </>
        )}
        {msg && (
          <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 600, color: msg.type === 'error' ? 'var(--red)' : 'var(--green)' }}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  )
}
