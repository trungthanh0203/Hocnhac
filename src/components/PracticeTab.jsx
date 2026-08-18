import { useMemo, useState } from 'react'
import { notePos } from '../lib/staffSvg.js'
import { playNote, playScore } from '../lib/audio.js'

// Bản nhạc gốc "Vui đến trường" — sáng tác riêng cho app (không dùng lại bài hát có sẵn
// để tránh vấn đề bản quyền), chỉ dùng 5 nốt Đô-Rê-Mi-Fa-Sol đúng chương trình Sơ cấp 1.
const SCORE_RAW = [
  [{ note: 'C', dur: 1 }, { note: 'D', dur: 1 }],
  [{ note: 'E', dur: 1 }, { note: 'F', dur: 1 }],
  [{ note: 'G', dur: 2 }],
  [{ note: 'G', dur: 1 }, { note: 'F', dur: 1 }],
  [{ note: 'E', dur: 1 }, { note: 'D', dur: 1 }],
  [{ note: 'C', dur: 2 }],
  [{ note: 'E', dur: 1 }, { note: 'G', dur: 1 }],
  [{ note: 'C', dur: 2 }],
]
const SOLFEGE = { C: 'Đô', D: 'Rê', E: 'Mi', F: 'Fa', G: 'Sol' }

function buildScoreWithGid() {
  let gid = 0
  return SCORE_RAW.map(measure => measure.map(n => ({ ...n, gid: gid++ })))
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

export default function PracticeTab() {
  const scoreMeasures = useMemo(() => buildScoreWithGid(), [])
  const flatNotes = useMemo(() => scoreMeasures.flat(), [scoreMeasures])
  const [highlightGid, setHighlightGid] = useState(-1)
  const [practiceIdx, setPracticeIdx] = useState(0)

  const rows = []
  for (let i = 0; i < scoreMeasures.length; i += 4) rows.push(scoreMeasures.slice(i, i + 4))
  const scoreHtml = rows.map(r => renderScoreRow(r, highlightGid)).join('')

  function playFull() {
    playScore(flatNotes, gid => setHighlightGid(gid))
  }

  const current = flatNotes[practiceIdx]

  return (
    <div className="panel">
      <div className="lesson-eyebrow" style={{ marginBottom: 6 }}>Thực hành · Giai điệu "Vui đến trường" · sáng tác riêng cho Sơ cấp 1</div>
      <div className="lesson-goal">🎯 Mục tiêu: đọc và hát đúng cao độ cả bài, ôn lại toàn bộ 5 nốt Đô-Rê-Mi-Fa-Sol đã học.</div>

      <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 10px', marginBottom: 14 }}
        dangerouslySetInnerHTML={{ __html: scoreHtml }} />

      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <button className="play-btn" style={{ display: 'inline-flex' }} onClick={playFull}>▶</button>
        <div className="sub" style={{ marginTop: 6 }}>Nghe cả bài — nốt đang vang sẽ sáng lên trên bản nhạc</div>
      </div>

      <div className="lesson-box">
        <div className="lesson-title" style={{ marginBottom: 12 }}>Đọc từng nốt</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>{SOLFEGE[current.note]}</div>
          <button className="play-btn" style={{ display: 'inline-flex' }} onClick={() => { playNote(current.note, current.dur * 0.7); setHighlightGid(current.gid) }}>▶</button>
          <div className="lesson-nav" style={{ marginTop: 14 }}>
            <button className="nav-btn" disabled={practiceIdx === 0} onClick={() => { const i = practiceIdx - 1; setPracticeIdx(i); setHighlightGid(flatNotes[i].gid) }}>← Nốt trước</button>
            <span className="progress">{practiceIdx + 1}/{flatNotes.length}</span>
            <button className="nav-btn" disabled={practiceIdx === flatNotes.length - 1} onClick={() => { const i = practiceIdx + 1; setPracticeIdx(i); setHighlightGid(flatNotes[i].gid) }}>Nốt sau →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
