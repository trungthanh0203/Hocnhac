import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { notePos } from '../lib/staffSvg.js'
import { playScore } from '../lib/audio.js'

function buildFlatNotes(measuresRaw) {
  let gid = 0
  const measuresGid = measuresRaw.map(m => m.map(n => ({ ...n, gid: gid++ })))
  return { measuresGid, flatNotes: measuresGid.flat() }
}

// Vẽ khuông nhạc kèm LỜI ngay dưới mỗi nốt (thay vì tên nốt như ở Thực hành) —
// khi phát, nốt VÀ lời cùng sáng lên đồng thời -> hiệu ứng "karaoke".
function renderSingingRow(measures, highlightGid, lyricByGid) {
  const beatW = 50, startX = 14 + 34
  let x = startX, els = ''
  measures.forEach(measure => {
    measure.forEach(n => {
      const y = notePos[n.note]
      const noteW = n.dur * beatW
      const cx = x + noteW / 2
      const isCurrent = n.gid === highlightGid
      const col = isCurrent ? '#e8a933' : '#1a1614'
      const filled = n.dur === 1
      els += `<g>`
      els += filled
        ? `<ellipse cx="${cx}" cy="${y}" rx="7" ry="5.5" fill="${col}"/>`
        : `<ellipse cx="${cx}" cy="${y}" rx="7" ry="5.5" fill="${isCurrent ? '#fff2d6' : 'none'}" stroke="${col}" stroke-width="1.8"/>`
      els += `<line x1="${cx + 6.5}" y1="${y}" x2="${cx + 6.5}" y2="${y - 30}" stroke="${col}" stroke-width="1.4"/>`
      if (n.note === 'C') els += `<line x1="${cx - 9}" y1="86" x2="${cx + 9}" y2="86" stroke="#1a1614" stroke-width="1"/>`
      els += `<text x="${cx}" y="99" font-size="12" fill="${isCurrent ? '#b8791f' : '#6b7280'}" text-anchor="middle" font-weight="${isCurrent ? '800' : '600'}">${lyricByGid[n.gid] || ''}</text>`
      els += `</g>`
      x += noteW
    })
    els += `<line x1="${x + 4}" y1="15" x2="${x + 4}" y2="75" stroke="#1a1614" stroke-width="1"/>`
    x += 14
  })
  const totalW = x + 10
  const staffLines = `<g stroke="#1a1614" stroke-width="1"><line x1="10" y1="15" x2="${totalW - 10}" y2="15"/><line x1="10" y1="30" x2="${totalW - 10}" y2="30"/><line x1="10" y1="45" x2="${totalW - 10}" y2="45"/><line x1="10" y1="60" x2="${totalW - 10}" y2="60"/><line x1="10" y1="75" x2="${totalW - 10}" y2="75"/></g>`
  const clef = `<text x="14" y="58" font-size="42" fill="#1a1614">&#119070;</text>`
  return `<svg viewBox="0 0 ${totalW} 112" width="100%" style="display:block;margin-bottom:10px">${staffLines}${clef}${els}</svg>`
}

// Tab "Luyện hát" — 9 bài hát gốc, mỗi cấp 1 bài, luôn hiện đủ 9 trong dropdown
// (không tách theo chế độ Học theo cấp/module — đây là 1 kho bài hát riêng, xuyên suốt).
// Tài khoản demo chỉ HÁT được 3 bài đầu, các bài sau hiện khóa để mời nâng cấp.
export default function SingingTab({ auth }) {
  const [songs, setSongs] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [highlightGid, setHighlightGid] = useState(-1)

  useEffect(() => {
    supabase.from('practice_scores').select('*, levels(name, order_index)').eq('kind', 'singing')
      .then(({ data }) => {
        const sorted = (data || []).slice().sort((a, b) => (a.levels?.order_index || 0) - (b.levels?.order_index || 0))
        setSongs(sorted)
        setLoading(false)
      })
  }, [])

  const isDemo = auth.accountMode === 'demo'
  const isModuleAccount = auth.accountMode === 'module'

  function isLocked(song, i) {
    if (isModuleAccount) return false // tài khoản mua theo module: mở hết, giống Bài test/Thực hành
    if (isDemo) return i >= 3
    return !auth.isLevelUnlocked(song.level_id) // tài khoản mua theo cấp: đúng cấp đã mua
  }

  const current = songs[index]
  const locked = current ? isLocked(current, index) : false

  const { measuresGid, flatNotes } = useMemo(
    () => current && !locked ? buildFlatNotes(current.measures) : { measuresGid: [], flatNotes: [] },
    [current, locked]
  )
  const lyricByGid = useMemo(() => {
    if (!current?.lyrics) return {}
    const map = {}
    current.lyrics.forEach((word, i) => { map[i] = word })
    return map
  }, [current])

  useEffect(() => { setHighlightGid(-1) }, [index])

  if (loading) return <div className="loading">Đang tải…</div>
  if (songs.length === 0) return <div className="loading">Chưa có bài hát nào.</div>

  const rows = []
  for (let i = 0; i < measuresGid.length; i += 4) rows.push(measuresGid.slice(i, i + 4))
  const scoreHtml = rows.map(r => renderSingingRow(r, highlightGid, lyricByGid)).join('')

  function playSing() {
    playScore(flatNotes, gid => setHighlightGid(gid))
  }

  return (
    <div className="panel">
      <div className="lesson-eyebrow" style={{ marginBottom: 8 }}>Luyện hát · 9 bài, mỗi cấp 1 bài</div>

      <div className="select-row">
        <div className="select-field wide" style={{ flex: 1 }}>
          <label>Chọn bài hát</label>
          <select value={index} onChange={e => setIndex(Number(e.target.value))}>
            {songs.map((s, i) => (
              <option key={s.id} value={i}>
                {isLocked(s, i) ? '🔒 ' : ''}{s.levels?.name} · {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {locked ? (
        <div className="lock">Bài hát này cần nâng cấp tài khoản để mở khóa</div>
      ) : (
        <>
          <div className="lesson-goal">🎯 Nghe giai điệu mẫu rồi hát theo — lời sẽ sáng lên đúng lúc từng nốt vang lên.</div>

          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 10px', marginBottom: 14 }}
            dangerouslySetInnerHTML={{ __html: scoreHtml }} />

          <div style={{ textAlign: 'center' }}>
            <button className="play-btn" style={{ display: 'inline-flex' }} onClick={playSing}>🎤</button>
            <div className="sub" style={{ marginTop: 6 }}>Bấm "Hát" — nốt và lời sẽ sáng lên theo đúng nhịp, kiểu karaoke</div>
          </div>
        </>
      )}
    </div>
  )
}
