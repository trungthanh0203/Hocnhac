import { useState } from 'react'
import { useAdminAuth } from './admin/useAdminAuth.js'
import AdminLogin from './admin/AdminLogin.jsx'
import LessonsAdmin from './admin/LessonsAdmin.jsx'
import QuestionsAdmin from './admin/QuestionsAdmin.jsx'
import CodesAdmin from './admin/CodesAdmin.jsx'
import StudentsAdmin from './admin/StudentsAdmin.jsx'

const TABS = [
  { key: 'lessons', label: 'Bài học', Comp: LessonsAdmin },
  { key: 'questions', label: 'Câu hỏi', Comp: QuestionsAdmin },
  { key: 'codes', label: 'Mã kích hoạt', Comp: CodesAdmin },
  { key: 'students', label: 'Học viên', Comp: StudentsAdmin },
]

export default function AdminApp() {
  const auth = useAdminAuth()
  const [tab, setTab] = useState('lessons')

  if (auth.loading) return <div className="admin-shell"><p>Đang tải…</p></div>
  if (!auth.user || !auth.isAdmin) return <AdminLogin auth={auth} />

  const Active = TABS.find(t => t.key === tab).Comp

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <h1>Quản trị · Học nhạc cùng Mr.Thành</h1>
        <div className="who">
          {auth.user.email} &nbsp;
          <button className="admin-btn secondary" onClick={auth.signOut}>Đăng xuất</button>
        </div>
      </div>
      <div className="admin-tabs">
        {TABS.map(t => (
          <div key={t.key} className={'admin-tab' + (tab === t.key ? ' active' : '')} onClick={() => setTab(t.key)}>
            {t.label}
          </div>
        ))}
      </div>
      <Active />
    </div>
  )
}
