import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient.js'

// Hook quản lý trạng thái đăng nhập + quyền truy cập (student_access) —
// hỗ trợ CẢ 2 kiểu quyền: theo cấp (level_id) và theo module (module_name).
// Tự tính ra "accountMode" để App.jsx quyết định khóa cứng giao diện hay
// vẫn cho phép chuyển đổi (chỉ tài khoản demo/chưa mua gì mới được chuyển đổi).
export function useAuth() {
  const [user, setUser] = useState(null)
  const [unlockedLevelIds, setUnlockedLevelIds] = useState([])
  const [unlockedModuleNames, setUnlockedModuleNames] = useState([])
  const [loadingAuth, setLoadingAuth] = useState(true)

  const loadAccess = useCallback(async (userId) => {
    if (!userId) { setUnlockedLevelIds([]); setUnlockedModuleNames([]); return }
    const { data } = await supabase.from('student_access').select('level_id, module_name').eq('user_id', userId)
    const rows = data || []
    const levelRows = rows.filter(r => !r.module_name)
    const moduleRows = rows.filter(r => r.module_name)
    // level_id = null (trong 1 dòng KHÔNG có module_name) nghĩa là mã đó mở TẤT CẢ 9 cấp
    const hasAllLevels = levelRows.some(r => r.level_id === null)
    setUnlockedLevelIds(hasAllLevels ? 'all' : levelRows.map(r => r.level_id))
    setUnlockedModuleNames(moduleRows.map(r => r.module_name))
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
      else { setUnlockedLevelIds([]); setUnlockedModuleNames([]) }
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
  function isModuleUnlocked(moduleName) {
    return unlockedModuleNames.includes(moduleName)
  }

  // 'level'  = tài khoản đã mua ít nhất 1 cấp -> khóa cứng giao diện "Học theo cấp"
  // 'module' = chỉ có quyền theo module (chưa mua cấp nào) -> khóa cứng "Học theo module"
  // 'demo'   = chưa đăng nhập hoặc đăng nhập nhưng chưa mua gì -> vẫn cho chuyển đổi 2 kiểu
  const hasLevelAccess = unlockedLevelIds === 'all' || unlockedLevelIds.length > 0
  const hasModuleAccess = unlockedModuleNames.length > 0
  const accountMode = hasLevelAccess ? 'level' : (hasModuleAccess ? 'module' : 'demo')

  return {
    user, loadingAuth, unlockedLevelIds, unlockedModuleNames, accountMode,
    isLevelUnlocked, isModuleUnlocked,
    signUp, signIn, signOut, redeemCode,
  }
}
