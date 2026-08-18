import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

// Nút bấm được điều khiển từ App.jsx (đặt trong banner-row cho đúng màu nền).
// Component này phụ trách phần NỘI DUNG panel khi open = true, đồng thời cho phép
// bấm vào 1 cấp đã mở để CHUYỂN sang xem cấp đó (gọi onSelectLevel).
export default function RoadmapPanel({ auth, currentLevelId, open, onSelectLevel }) {
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('levels').select('*').order('order_index').then(({ data }) => {
      setLevels(data || [])
      setLoading(false)
    })
  }, [])

  // Sơ cấp 1 luôn xem được (chế độ demo 3 bài/mục); các cấp khác cần đã mở qua mã kích hoạt
  function isSelectable(level) {
    return level.id === 1 || auth.isLevelUnlocked(level.id)
  }
  function statusOf(level) {
    if (level.id === currentLevelId) return 'current'
    if (isSelectable(level)) return 'unlocked'
    return 'locked'
  }

  const tiers = ['Sơ cấp', 'Trung cấp', 'Nâng cao']

  if (!open) return null

  return (
    <div className="roadmap-panel">
      <div className="lesson-eyebrow" style={{ margin: '14px 16px 8px' }}>Lộ trình của tôi · 9 cấp</div>
      <div className="sub" style={{ margin: '0 16px 10px' }}>Bấm vào 1 cấp đã mở để chuyển sang xem cấp đó</div>
      <div style={{ padding: '0 16px 16px' }}>
        {loading ? <div className="loading">Đang tải…</div> : tiers.map(tier => (
          <div className="roadmap-tier" key={tier}>
            <div className="roadmap-tier-title">{tier}</div>
            {levels.filter(l => l.tier === tier).map(level => {
              const status = statusOf(level)
              const selectable = isSelectable(level) && status !== 'current'
              return (
                <div
                  className={'roadmap-level' + (status === 'current' ? ' current' : '')}
                  key={level.id}
                  onClick={() => selectable && onSelectLevel(level.id)}
                  style={{ cursor: selectable ? 'pointer' : 'default' }}
                >
                  <div className="roadmap-num">{level.order_index}</div>
                  <div className="roadmap-body">
                    <div className="roadmap-name">{level.name}</div>
                    <div className="roadmap-focus">{level.focus_text}</div>
                  </div>
                  <div className={'roadmap-badge ' + status}>
                    {status === 'current' ? 'Đang xem' : status === 'unlocked' ? 'Đã mở · bấm để xem' : '🔒 Khóa'}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
