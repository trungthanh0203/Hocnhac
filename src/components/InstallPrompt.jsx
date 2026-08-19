import { useEffect, useState } from 'react'

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}
function isStandalone() {
  return (window.navigator.standalone === true) || window.matchMedia('(display-mode: standalone)').matches
}

// Dải mời cài đặt app — Android/Desktop bắt được sự kiện beforeinstallprompt nên có nút bấm
// cài trực tiếp; iPhone/iPad (Safari) không hỗ trợ sự kiện này nên chỉ hiện hướng dẫn thao tác tay.
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [iosHint, setIosHint] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    if (localStorage.getItem('installPromptDismissed') === '1') return

    function handler(e) {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    if (isIos()) setIosHint(true)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShowBanner(false)
  }

  function dismiss() {
    setShowBanner(false)
    setIosHint(false)
    localStorage.setItem('installPromptDismissed', '1')
  }

  if (isStandalone() || (!showBanner && !iosHint)) return null

  return (
    <div style={{ background: 'var(--gold-soft)', borderBottom: '1.5px solid var(--line)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ flex: 1, fontSize: 12, color: 'var(--navy)', lineHeight: 1.4 }}>
        {showBanner
          ? 'Cài app này vào máy để mở nhanh như 1 app thật, không cần mở trình duyệt.'
          : 'Trên iPhone/iPad: bấm nút Chia sẻ (hình vuông có mũi tên) → "Thêm vào MH chính" để cài app.'}
      </span>
      {showBanner && <button className="nav-btn" style={{ padding: '6px 12px', fontSize: 12, flex: 'none' }} onClick={handleInstall}>Cài đặt</button>}
      <button onClick={dismiss} aria-label="Đóng" style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 18, cursor: 'pointer', lineHeight: 1, flex: 'none' }}>×</button>
    </div>
  )
}
