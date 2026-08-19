import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient.js'

// Hook đăng nhập riêng cho trang quản trị: sau khi đăng nhập, kiểm tra
// profiles.role có phải 'admin' hoặc 'super_admin' không — nếu không thì coi
// như chưa đăng nhập (không cho vào trang quản trị dù đăng nhập Supabase thành công).
export function useAdminAuth() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null) // 'student' | 'admin' | 'super_admin' | null
  const [loading, setLoading] = useState(true)

  const checkRole = useCallback(async (userId) => {
    if (!userId) { setRole(null); return }
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single()
    setRole(data?.role || null)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) await checkRole(session.user.id)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null)
      if (session?.user) await checkRole(session.user.id)
      else setRole(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [checkRole])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }
  async function signOut() {
    await supabase.auth.signOut()
  }

  const isAdmin = role === 'admin' || role === 'super_admin'
  const isSuperAdmin = role === 'super_admin'

  return { user, role, isAdmin, isSuperAdmin, loading, signIn, signOut }
}
