import { useState } from 'react'

// Panel đăng nhập / đăng ký / nhập mã kích hoạt / đổi mật khẩu — mở ra dạng thả xuống từ Banner.
export default function AuthPanel({ auth, open, onClose }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  const [showRedeemMore, setShowRedeemMore] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [showChangePw, setShowChangePw] = useState(false)
  const [newPw, setNewPw] = useState('')
  const [newPwConfirm, setNewPwConfirm] = useState('')

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

  async function handleForgot(e) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    const err = await auth.resetPasswordForEmail(forgotEmail.trim())
    setBusy(false)
    setMsg({
      type: err ? 'error' : 'success',
      text: err ? err.message : 'Đã gửi email đặt lại mật khẩu — kiểm tra hộp thư (kể cả mục Spam). Nếu không nhận được sau vài phút, nhắn Zalo cho Mr.Thành để được hỗ trợ trực tiếp.',
    })
  }

  async function handleChangePw(e) {
    e.preventDefault()
    if (newPw.length < 6) return setMsg({ type: 'error', text: 'Mật khẩu mới cần ít nhất 6 ký tự.' })
    if (newPw !== newPwConfirm) return setMsg({ type: 'error', text: 'Mật khẩu nhập lại không khớp.' })
    setBusy(true); setMsg(null)
    const err = await auth.updatePassword(newPw)
    setBusy(false)
    setMsg({ type: err ? 'error' : 'success', text: err ? err.message : 'Đổi mật khẩu thành công!' })
    if (!err) { setNewPw(''); setNewPwConfirm(''); setShowChangePw(false) }
  }

  const isActivated = auth.accountMode === 'level' || auth.accountMode === 'module'

  return (
    <div className="roadmap-panel">
      <div style={{ padding: 16 }}>
        {!auth.user ? (
          <>
            <div className="chip-row">
              <div className={'chip' + (mode === 'signin' ? ' active' : '')} onClick={() => { setMode('signin'); setShowForgot(false) }}>Đăng nhập</div>
              <div className={'chip' + (mode === 'signup' ? ' active' : '')} onClick={() => { setMode('signup'); setShowForgot(false) }}>Đăng ký</div>
            </div>

            {!showForgot ? (
              <>
                <form onSubmit={handleAuth}>
                  <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 8, border: '1.5px solid var(--line)' }} />
                  <input type="password" required placeholder="Mật khẩu (tối thiểu 6 ký tự)" value={password} onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1.5px solid var(--line)' }} />
                  <button className="next-btn" disabled={busy} type="submit">{mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản'}</button>
                </form>
                {mode === 'signin' && (
                  <div style={{ textAlign: 'center', marginTop: 10 }}>
                    <span style={{ fontSize: 12, color: 'var(--navy)', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { setShowForgot(true); setMsg(null) }}>
                      Quên mật khẩu?
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <form onSubmit={handleForgot}>
                  <input type="email" required placeholder="Nhập email đã đăng ký" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                    style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1.5px solid var(--line)' }} />
                  <button className="next-btn" disabled={busy} type="submit">Gửi email đặt lại mật khẩu</button>
                </form>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { setShowForgot(false); setMsg(null) }}>
                    ← Quay lại đăng nhập
                  </span>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, marginBottom: 4 }}><strong>{auth.user.email}</strong></div>
            {isActivated && (
              <div style={{ fontSize: 12.5, color: 'var(--green)', fontWeight: 600, marginBottom: 12 }}>
                Đã kích hoạt {auth.accountMode === 'module' ? 'theo module' : 'theo cấp học'}
              </div>
            )}

            {isActivated && !showRedeemMore && (
              <button className="nav-btn" style={{ width: '100%', marginBottom: 8 }} onClick={() => setShowRedeemMore(true)}>Nhập mã khác</button>
            )}
            {(!isActivated || showRedeemMore) && (
              <form onSubmit={handleRedeem} style={{ marginBottom: 8 }}>
                <input type="text" required placeholder="Nhập mã kích hoạt" value={code} onChange={e => setCode(e.target.value)}
                  style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1.5px solid var(--line)' }} />
                <button className="next-btn" disabled={busy} type="submit">Kích hoạt mã</button>
              </form>
            )}

            {!showChangePw ? (
              <button className="nav-btn" style={{ width: '100%', marginBottom: 8 }} onClick={() => setShowChangePw(true)}>Đổi mật khẩu</button>
            ) : (
              <form onSubmit={handleChangePw} style={{ marginBottom: 8 }}>
                <input type="password" required placeholder="Mật khẩu mới (tối thiểu 6 ký tự)" value={newPw} onChange={e => setNewPw(e.target.value)}
                  style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 8, border: '1.5px solid var(--line)' }} />
                <input type="password" required placeholder="Nhập lại mật khẩu mới" value={newPwConfirm} onChange={e => setNewPwConfirm(e.target.value)}
                  style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1.5px solid var(--line)' }} />
                <button className="next-btn" disabled={busy} type="submit">Lưu mật khẩu mới</button>
              </form>
            )}

            <button className="nav-btn" style={{ width: '100%' }} onClick={auth.signOut}>Đăng xuất</button>
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
