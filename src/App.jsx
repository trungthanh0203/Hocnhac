import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'
import TabBar from './components/TabBar.jsx'
import RoadmapPanel from './components/RoadmapPanel.jsx'
import AuthPanel from './components/AuthPanel.jsx'
import Footer from './components/Footer.jsx'
import InstallPrompt from './components/InstallPrompt.jsx'
import LessonTab from './components/LessonTab.jsx'
import ReviewTab from './components/ReviewTab.jsx'
import EarTrainingTab from './components/EarTrainingTab.jsx'
import TestTab from './components/TestTab.jsx'
import PracticeTab from './components/PracticeTab.jsx'
import ModuleExplorer from './components/ModuleExplorer.jsx'
import ModuleReviewTab from './components/ModuleReviewTab.jsx'
import { useAuth } from './hooks/useAuth.js'

export default function App() {
  const [tab, setTab] = useState('lesson')
  const [learnMode, setLearnMode] = useState('level') // 'level' | 'module' — mặc định, sẽ tự khóa nếu tài khoản đã mua
  const [authOpen, setAuthOpen] = useState(false)
  const [roadmapOpen, setRoadmapOpen] = useState(false)
  const [activeLevelId, setActiveLevelId] = useState(1) // Sơ cấp 1 làm mặc định khi mở app
  const [activeLevelName, setActiveLevelName] = useState('Sơ cấp 1')
  const [activeLevelTier, setActiveLevelTier] = useState('Sơ cấp')
  const auth = useAuth()
  const isPaidAccount = auth.isLevelUnlocked(activeLevelId)

  // Tài khoản đã mua theo CẤP hoặc theo MODULE -> khóa cứng đúng kiểu giao diện đó, ẩn công tắc.
  // Tài khoản demo / chưa mua gì -> vẫn giữ công tắc để tự do khám phá cả 2 kiểu.
  const canSwitchMode = auth.accountMode === 'demo'
  useEffect(() => {
    if (!canSwitchMode) setLearnMode(auth.accountMode)
  }, [canSwitchMode, auth.accountMode])

  useEffect(() => {
    supabase.from('levels').select('id, name, tier').eq('id', activeLevelId).single()
      .then(({ data }) => { if (data) { setActiveLevelName(data.name); setActiveLevelTier(data.tier) } })
  }, [activeLevelId])

  function handleSelectLevel(levelId) {
    setActiveLevelId(levelId)
    setRoadmapOpen(false)
  }

  return (
    <div className="phone">
      <InstallPrompt />
      <div className="banner">
        <h1>Học nhạc cùng Mr.Thành</h1>
        <p>
          {learnMode === 'module' ? 'Học theo module' : activeLevelName} ·{' '}
          {auth.accountMode === 'demo' ? 'chế độ demo, 3 bài mỗi mục' : 'đã kích hoạt'}
        </p>
        <div className="banner-row" style={{ flexWrap: 'wrap', rowGap: 8 }}>
          <span className="badge">
            {!auth.user
              ? 'Tài khoản Demo · 3 bài / mục'
              : auth.accountMode === 'level' ? `${auth.user.email} đã kích hoạt theo cấp học`
              : auth.accountMode === 'module' ? `${auth.user.email} đã kích hoạt theo module`
              : `${auth.user.email} chưa kích hoạt`}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {learnMode === 'level' && (
              <button className="roadmap-btn" onClick={() => setRoadmapOpen(o => !o)}>
                Lộ trình <span style={{ fontSize: 9, marginLeft: 3 }}>{roadmapOpen ? '▲' : '▼'}</span>
              </button>
            )}
            <button className="roadmap-btn" onClick={() => setAuthOpen(o => !o)}>
              {auth.user ? 'Tài khoản' : 'Đăng nhập'} <span style={{ fontSize: 9, marginLeft: 3 }}>{authOpen ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>
      </div>

      {learnMode === 'level' && (
        <RoadmapPanel auth={auth} currentLevelId={activeLevelId} open={roadmapOpen} onSelectLevel={handleSelectLevel} />
      )}
      <AuthPanel auth={auth} open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Công tắc chuyển chế độ CHỈ hiện cho tài khoản demo/chưa mua gì.
          Tài khoản đã mua theo cấp hoặc theo module bị khóa cứng đúng kiểu đã mua. */}
      {canSwitchMode && (
        <div className="chip-row" style={{ padding: '14px 16px 0' }}>
          <div className={'chip' + (learnMode === 'level' ? ' active' : '')} onClick={() => setLearnMode('level')}>Học theo cấp</div>
          <div className={'chip' + (learnMode === 'module' ? ' active' : '')} onClick={() => setLearnMode('module')}>Học theo module</div>
        </div>
      )}

      {learnMode === 'module' ? (
        <>
          <TabBar active={tab} onChange={setTab} />
          <div style={{ display: tab === 'lesson' ? 'block' : 'none' }}>
            <ModuleExplorer auth={auth} />
          </div>
          <div style={{ display: tab === 'review' ? 'block' : 'none' }}>
            <ModuleReviewTab auth={auth} />
          </div>
          <div style={{ display: tab === 'ear' ? 'block' : 'none' }}>
            {/* Tài khoản module là tài khoản trả phí -> luôn mở độ khó Nâng cao nhất */}
            <EarTrainingTab levelName="Nâng cao 3" levelTier="Nâng cao" />
          </div>
          <div style={{ display: tab === 'test' ? 'block' : 'none' }}>
            <TestTab allLevels />
          </div>
          <div style={{ display: tab === 'practice' ? 'block' : 'none' }}>
            <PracticeTab allLevels />
          </div>
        </>
      ) : (
        <>
          <TabBar active={tab} onChange={setTab} />

          {/* Giữ cả 5 tab trong bộ nhớ (chỉ ẩn/hiện bằng CSS) để chuyển tab không phải tải lại dữ liệu mỗi lần */}
          <div style={{ display: tab === 'lesson' ? 'block' : 'none' }}>
            <LessonTab levelId={activeLevelId} isPaidAccount={isPaidAccount} />
          </div>
          <div style={{ display: tab === 'review' ? 'block' : 'none' }}>
            <ReviewTab levelId={activeLevelId} />
          </div>
          <div style={{ display: tab === 'ear' ? 'block' : 'none' }}>
            <EarTrainingTab levelId={activeLevelId} levelName={activeLevelName} levelTier={activeLevelTier} />
          </div>
          <div style={{ display: tab === 'test' ? 'block' : 'none' }}>
            <TestTab levelId={activeLevelId} />
          </div>
          <div style={{ display: tab === 'practice' ? 'block' : 'none' }}>
            <PracticeTab levelId={activeLevelId} />
          </div>
        </>
      )}

      <Footer />
    </div>
  )
}
