import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { notePos } from '../lib/staffSvg.js'
import { playScore } from '../lib/audio.js'

const SOLFEGE = { C: 'Đô', D: 'Rê', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' }

function buildFlatNotes(measuresRaw) {
  let gid = 0
  const measuresGid = measuresRaw.map(m => m.map(n => ({ ...n, gid: gid++ })))
  return { measuresGid, flatNotes: measuresGid.flat() }
}

function renderScoreRow(measures, highlightGid) {
  const beatW = 46, startX = 14 + 34
  let x = startX, els = ''
  measures.forEach(measure => {
    measure.forEach(n => {
      const y = notePos[n.note]
      const noteW = n.dur * beatW
      const cx = x + noteW / 2
      const isCurrent = n.gid === highlightGid
      const col = isCurrent ? '#e8b64a' : '#0f2a52'
      const filled = n.dur === 1
      els += `<g>`
      els += filled
        ? `<ellipse cx="${cx}" cy="${y}" rx="7" ry="5.5" fill="${col}"/>`
        : `<ellipse cx="${cx}" cy="${y}" rx="7" ry="5.5" fill="${isCurrent ? '#fbf1d9' : 'none'}" stroke="${col}" stroke-width="1.8"/>`
      els += `<line x1="${cx + 6.5}" y1="${y}" x2="${cx + 6.5}" y2="${y - 30}" stroke="${col}" stroke-width="1.4"/>`
      if (n.note === 'C') els += `<line x1="${cx - 9}" y1="86" x2="${cx + 9}" y2="86" stroke="#1c2333" stroke-width="1"/>`
      els += `<text x="${cx}" y="98" font-size="10" fill="${isCurrent ? '#93701f' : '#5c6270'}" text-anchor="middle" font-weight="${isCurrent ? '700' : '400'}">${SOLFEGE[n.note]}</text>`
      els += `</g>`
      x += noteW
    })
    els += `<line x1="${x + 4}" y1="15" x2="${x + 4}" y2="75" stroke="#1c2333" stroke-width="1"/>`
    x += 14
  })
  const totalW = x + 10
  const staffLines = `<g stroke="#1c2333" stroke-width="1"><line x1="10" y1="15" x2="${totalW - 10}" y2="15"/><line x1="10" y1="30" x2="${totalW - 10}" y2="30"/><line x1="10" y1="45" x2="${totalW - 10}" y2="45"/><line x1="10" y1="60" x2="${totalW - 10}" y2="60"/><line x1="10" y1="75" x2="${totalW - 10}" y2="75"/></g>`
  const clef = `<text x="14" y="58" font-size="42" fill="#0f2a52">&#119070;</text>`
  return `<svg viewBox="0 0 ${totalW} 108" width="100%" style="display:block;margin-bottom:10px">${staffLines}${clef}${els}</svg>`
}

export default function PracticeTab({ levelId }) {
  const [scores, setScores] = useState([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [highlightGid, setHighlightGid] = useState(-1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    supabase.from('practice_scores').select('*').eq('level_id', levelId).order('order_index').then(({ data }) => {
      setScores(data || [])
      setActiveIdx(0)
      setHighlightGid(-1)
      setLoading(false)
    })
  }, [levelId])

  const current = scores[activeIdx]
  const { measuresGid, flatNotes } = useMemo(
    () => current ? buildFlatNotes(current.measures) : { measuresGid: [], flatNotes: [] },
    [current]
  )

  if (loading) return <div className="loading">Đang tải…</div>
  if (scores.length === 0) return <div className="loading">Chưa có giai điệu thực hành cho cấp này.</div>

  const rows = []
  for (let i = 0; i < measuresGid.length; i += 4) rows.push(measuresGid.slice(i, i + 4))
  const scoreHtml = rows.map(r => renderScoreRow(r, highlightGid)).join('')

  function playFull() {
    playScore(flatNotes, gid => setHighlightGid(gid))
  }

  return (
    <div className="panel">
      <div className="lesson-eyebrow" style={{ marginBottom: 8 }}>Thực hành · chọn 1 trong {scores.length} giai điệu</div>
      <div className="chip-row">
        {scores.map((s, i) => (
          <div key={s.id} className={'chip' + (activeIdx === i ? ' active' : '')} onClick={() => { setActiveIdx(i); setHighlightGid(-1) }}>
            {s.title}
          </div>
        ))}
      </div>
      <div className="lesson-goal">🎯 Đọc và hát đúng cao độ cả bài "{current.title}".</div>

      <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 10px', marginBottom: 14 }}
        dangerouslySetInnerHTML={{ __html: scoreHtml }} />

      <div style={{ textAlign: 'center' }}>
        <button className="play-btn" style={{ display: 'inline-flex' }} onClick={playFull}>▶</button>
        <div className="sub" style={{ marginTop: 6 }}>Nghe cả bài — nốt đang vang sẽ sáng lên trên bản nhạc</div>
      </div>
    </div>
  )
}
