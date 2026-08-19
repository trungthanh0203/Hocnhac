import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminApp from './AdminApp.jsx'
import ResetPasswordPage from './ResetPasswordPage.jsx'
import { primeAudio } from './lib/audio.js'
import './index.css'
import './admin/admin.css'

const path = window.location.pathname
const isAdmin = path.startsWith('/admin')
const isResetPassword = path.startsWith('/reset-password')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdmin ? <AdminApp /> : isResetPassword ? <ResetPasswordPage /> : <App />}
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

// Mở khóa âm thanh ngay từ lượt chạm/bấm đầu tiên của người dùng — quan trọng nhất trên iOS/Safari
function unlockAudioOnce() {
  primeAudio()
  window.removeEventListener('touchend', unlockAudioOnce)
  window.removeEventListener('mousedown', unlockAudioOnce)
}
window.addEventListener('touchend', unlockAudioOnce, { once: true })
window.addEventListener('mousedown', unlockAudioOnce, { once: true })
