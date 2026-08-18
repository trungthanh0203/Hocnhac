import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { renderIcon, renderStaffNotes } from '../lib/staffSvg.js'
import { playNote } from '../lib/audio.js'

function shuffle(arr) { return arr.slice().sort(() => Math.random() - 0.5) }

export default function ReviewTab({ levelId }) {
  const [deck, setDeck] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: modules } = await supabase.from('modules').select('id, name').eq('level_id', levelId)
      const moduleIds = (modules || []).map(m => m.id)
      const moduleNameById = Object.fromEntries((modules || []).map(m => [m.id, m.name]))

      const { data: concepts } = await supabase.from('concepts').select('*').in('module_id', moduleIds)
      const { data: questions } = await supabase.from('questions').select('*').eq('level_id', levelId)

      const conceptItems = (concepts || []).map(c => ({
        iconIdx: c.icon_index || 0,
        eyebrow: moduleNameById[c.module_id] || '',
        term: c.term,
        sub: c.sub,
        audioNote: c.audio_note,
        staffImg: null,
      }))
      const questionItems = (questions || []).map((q, i) => ({
        iconIdx: i % 12,
        eyebrow: 'Ôn câu hỏi',
        term: q.question_text,
        sub: `Đáp án đúng: ${q.correct_answer || (q.answers && q.answers[0]) || ''}`,
        audioNote: q.type === 'audio' ? q.note : null,
        staffImg: q.type === 'staff' ? renderStaffNotes([q.note], 150) : null,
      }))

      setDeck(shuffle([...conceptItems, ...questionItems]))
      setIndex(0)
      setLoading(false)
    }
    load()
  }, [levelId])

  if (loading) return <div className="loading">Đang tải…</div>
  if (deck.length === 0) return <div className="loading">Chưa có nội dung ôn tập cho cấp này.</div>

  const it = deck[index]

  return (
    <div className="panel">
      <div className="lesson-eyebrow" style={{ marginBottom: 8 }}>
        Lướt xem lại toàn bộ khái niệm và câu hỏi đã học · không chấm điểm
      </div>
      <div className="card" style={{ padding: '22px 18px', textAlign: 'center', background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--line)' }}>
        <div dangerouslySetInnerHTML={{ __html: renderIcon(it.iconIdx, 40) }} style={{ marginBottom: 6 }} />
        {it.staffImg && <div style={{ margin: '4px 0' }} dangerouslySetInnerHTML={{ __html: it.staffImg }} />}
        <div className="lesson-eyebrow">{it.eyebrow}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', margin: '4px 0' }}>{it.term}</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 12 }}>{it.sub}</div>
        {it.audioNote && (
          <button className="play-btn" style={{ display: 'inline-flex' }} onClick={() => playNote(it.audioNote, 1.0)}>▶</button>
        )}
        <div className="lesson-nav">
          <button className="nav-btn" disabled={index === 0} onClick={() => setIndex(i => i - 1)}>←</button>
          <span className="progress">{index + 1}/{deck.length}</span>
          <button className="nav-btn" disabled={index === deck.length - 1} onClick={() => setIndex(i => i + 1)}>→</button>
        </div>
      </div>
    </div>
  )
}
