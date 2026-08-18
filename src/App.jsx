import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'
import TabBar from './components/TabBar.jsx'
import RoadmapPanel from './components/RoadmapPanel.jsx'
import AuthPanel from './components/AuthPanel.jsx'
import Footer from './components/Footer.jsx'
import LessonTab from './components/LessonTab.jsx'
import ReviewTab from './components/ReviewTab.jsx'
import EarTrainingTab from './components/EarTrainingTab.jsx'
import TestTab from './components/TestTab.jsx'
import PracticeTab from './components/PracticeTab.jsx'
import { useAuth } from './hooks/useAuth.js'

export default function App() {
  const [tab, setTab] = useState('lesson')
  const [authOpen, setAuthOpen] = useState(false)
  const [roadmapOpen, setRoadmapOpen] = useState(false)
  const [activeLevelId, setActiveLevelId] = useState(1) // Sơ cấp 1 làm mặc định khi mở app
  const [activeLevelName, setActiveLevelName] = useState('Sơ cấp 1')
  const auth = useAuth()
  const isPaidAccount = auth.isLevelUnlocked(activeLevelId)

  useEffect(() => {
    supabase.from('levels').select('id, name').eq('id', activeLevelId).single()
      .then(({ data }) => { if (data) setActiveLevelName(data.name) })
  }, [activeLevelId])

  function handleSelectLevel(levelId) {
    setActiveLevelId(levelId)
    setRoadmapOpen(false)
  }

  return (
    <div className="phone">
      <div className="banner">
        <h1>Học nhạc cùng Mr.Thành</h1>
        <p>{activeLevelName} · {isPaidAccount ? 'đã kích hoạt' : 'chế độ demo, 3 bài mỗi mục'}</p>
        <div className="banner-row">
          <span className="badge">{isPaidAccount ? 'Tài khoản đã kích hoạt' : 'Tài khoản Demo · 3 bài / mục'}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="roadmap-btn" onClick={() => setRoadmapOpen(o => !o)}>
              Lộ trình <span style={{ fontSize: 9, marginLeft: 3 }}>{roadmapOpen ? '▲' : '▼'}</span>
            </button>
            <button className="roadmap-btn" onClick={() => setAuthOpen(o => !o)}>
              {auth.user ? 'Tài khoản' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>

      <RoadmapPanel auth={auth} currentLevelId={activeLevelId} open={roadmapOpen} onSelectLevel={handleSelectLevel} />
      <AuthPanel auth={auth} open={authOpen} onClose={() => setAuthOpen(false)} />

      <TabBar active={tab} onChange={setTab} />

      {tab === 'lesson' && <LessonTab levelId={activeLevelId} isPaidAccount={isPaidAccount} />}
      {tab === 'review' && <ReviewTab levelId={activeLevelId} />}
      {tab === 'ear' && <EarTrainingTab levelId={activeLevelId} />}
      {tab === 'test' && <TestTab levelId={activeLevelId} />}
      {tab === 'practice' && <PracticeTab />}

      <Footer />
    </div>
  )
}
