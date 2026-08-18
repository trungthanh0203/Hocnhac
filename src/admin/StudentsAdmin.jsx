import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

export default function StudentsAdmin() {
  const [students, setStudents] = useState([])
  const [accessByUser, setAccessByUser] = useState({})

  useEffect(() => {
    supabase.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false }).then(({ data }) => setStudents(data || []))
    supabase.from('student_access').select('*, levels(name)').then(({ data }) => {
      const grouped = {}
      ;(data || []).forEach(a => {
        if (!grouped[a.user_id]) grouped[a.user_id] = []
        grouped[a.user_id].push(a.levels?.name || 'Tất cả 9 cấp')
      })
      setAccessByUser(grouped)
    })
  }, [])

  return (
    <div className="admin-panel">
      <h3 style={{ fontSize: 14, color: 'var(--navy)', marginBottom: 10 }}>Danh sách học viên ({students.length})</h3>
      <table className="admin-table">
        <thead><tr><th>Email</th><th>Ngày đăng ký</th><th>Các cấp đã mở</th></tr></thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.email || '(chưa rõ)'}</td>
              <td>{new Date(s.created_at).toLocaleDateString('vi-VN')}</td>
              <td>{(accessByUser[s.id] || []).join(', ') || <span style={{ color: 'var(--muted)' }}>Chưa kích hoạt cấp nào</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && <div className="admin-empty">Chưa có học viên nào đăng ký.</div>}
    </div>
  )
}
