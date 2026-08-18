import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient.js'

// Hook quản lý trạng thái đăng nhập + danh sách cấp đã mở (student_access)
export function useAuth() {
  const [user, setUser] = useState(null)
  const [unlockedLevelIds, setUnlockedLevelIds] = useState([])
  const [loadingAuth, setLoadingAuth] = useState(true)

  const loadAccess = useCallback(async (userId) => {
    if (!userId) { setUnlockedLevelIds([]); return }
    const { data } = await supabase.from('student_access').select('level_id').eq('user_id', userId)
    // level_id = null nghĩa là mã đó mở TẤT CẢ 9 cấp
    const hasAll = (data || []).some(r => r.level_id === null)
    setUnlockedLevelIds(hasAll ? 'all' : (data || []).map(r => r.level_id))
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) loadAccess(session.user.id)
      setLoadingAuth(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) loadAccess(session.user.id)
      else setUnlockedLevelIds([])
    })
    return () => sub.subscription.unsubscribe()
  }, [loadAccess])

  async function signUp(email, password) {
    const { error } = await supabase.auth.signUp({ email, password })
    return error
  }
  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }
  async function signOut() {
    await supabase.auth.signOut()
  }
  async function redeemCode(code) {
    const { data, error } = await supabase.rpc('redeem_code', { code_input: code })
    if (error) return { success: false, message: error.message }
    if (data?.success && user) await loadAccess(user.id)
    return data
  }

  function isLevelUnlocked(levelId) {
    if (unlockedLevelIds === 'all') return true
    return unlockedLevelIds.includes(levelId)
  }

  return { user, loadingAuth, unlockedLevelIds, isLevelUnlocked, signUp, signIn, signOut, redeemCode }
}
