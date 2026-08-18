import { useEffect, useRef, useState } from 'react'
import { playNote, playSequence, playClick, playRhythmDemo } from '../lib/audio.js'

// TODO: hiện đang cố định phạm vi nốt cho Sơ cấp 1 (đúng như bản demo).
// Khi mở rộng lên các cấp khác, cần map levelId -> notePool tương ứng
// (ví dụ Sơ cấp 2-3 dùng đủ 7 nốt, Trung cấp mở thêm quãng 8 kế tiếp...).
const NOTE_POOL = ['C', 'D', 'E', 'F', 'G']
const SOLFEGE = { C: 'Đô', D: 'Rê', E: 'Mi', F: 'Fa', G: 'Sol' }
const FREQ = { C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.0 }

const TYPES = [
  { key: 'compare', label: 'So sánh cao độ' },
  { key: 'same', label: 'Giống hay khác' },
  { key: 'name', label: 'Đoán tên nốt' },
  { key: 'beat', label: 'Đếm phách' },
  { key: 'clap', label: 'Vỗ tay tiết tấu' },
]

function randPick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle(arr) { return arr.slice().sort(() => Math.random() - 0.5) }

function noteIconSmall(filled) {
  return `<svg viewBox="0 0 30 40" width="24" style="margin:0 3px">
    <ellipse cx="10" cy="30" rx="7" ry="5.5" ${filled ? 'fill="#0f2a52"' : 'fill="none" stroke="#e8b64a" stroke-width="1.6"'}/>
    <line x1="17" y1="30" x2="17" y2="6" stroke="${filled ? '#0f2a52' : '#e8b64a'}" stroke-width="1.6"/>
  </svg>`
}

const RHYTHM_POOL = [[1,1,1,1],[2,1,1],[1,2,1],[1,1,2],[2,2]]

export default function EarTrainingTab({ levelId }) {
  const [type, setType] = useState('compare')
  const [streak, setStreak] = useState(0)
  const [q, setQ] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const clapStart = useRef(null)
  const clapExpected = useRef([])
  const clapTimes = useRef([])
  const [clapProgress, setClapProgress] = useState(null)

  function gen() {
    setAnswered(false); setFeedback(null); setClapProgress(null); clapStart.current = null; clapTimes.current = []
    if (type === 'compare') {
      const n1 = randPick(NOTE_POOL), n2 = randPick(NOTE_POOL.filter(n => n !== n1))
      setQ({ n1, n2, correct: FREQ[n1] < FREQ[n2] ? 'Nốt 2' : 'Nốt 1' })
    } else if (type === 'same') {
      const same = Math.random() < 0.5
      const n1 = randPick(NOTE_POOL), n2 = same ? n1 : randPick(NOTE_POOL.filter(n => n !== n1))
      setQ({ n1, n2, correct: same ? 'Giống nhau' : 'Khác nhau' })
    } else if (type === 'name') {
      const n = randPick(NOTE_POOL)
      const distractors = shuffle(NOTE_POOL.filter(x => x !== n)).slice(0, 3)
      const opts = shuffle([...distractors, n]).map(x => SOLFEGE[x])
      setQ({ n, opts, correct: SOLFEGE[n] })
    } else if (type === 'beat') {
      const n = randPick([2, 3, 4])
      const pattern = Array.from({ length: n }, (_, i) => (i === 0 ? 1 : 0))
      setQ({ pattern, correct: String(n) })
    } else if (type === 'clap') {
      const durations = randPick(RHYTHM_POOL)
      setQ({ durations })
      let cum = 0
      clapExpected.current = durations.map(d => { const t = cum * 1000; cum += d * 0.6; return t })
    }
  }

  useEffect(() => { gen() }, [type])

  function handleAnswer(optText) {
    if (answered || !q) return
    setAnswered(true)
    const correct = optText === q.correct
    setStreak(s => correct ? s + 1 : 0)
    setFeedback({ correct, text: correct ? 'Chính xác!' : `Chưa đúng. Đáp án đúng: ${q.correct}` })
  }

  function startClap() {
    clapTimes.current = [0]
    clapStart.current = performance.now()
    setClapProgress(`Đã vỗ 1/${clapExpected.current.length}`)
  }
  function registerClap() {
    if (clapStart.current === null || clapTimes.current.length >= clapExpected.current.length) return
    clapTimes.current.push(performance.now() - clapStart.current)
    if (clapTimes.current.length >= clapExpected.current.length) {
      const diffs = clapTimes.current.map((t, i) => Math.abs(t - clapExpected.current[i]))
      const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length
      let text, ok
      if (avg < 220) { text = 'Xuất sắc! Vỗ tay rất khớp nhịp.'; ok = true }
      else if (avg < 450) { text = 'Khá ổn, cố gắng đều tay hơn nhé.'; ok = false }
      else { text = 'Chưa khớp nhịp lắm, nghe lại mẫu và thử lại nhé.'; ok = false }
      setStreak(s => ok ? s + 1 : 0)
      setFeedback({ correct: ok, text })
      clapStart.current = null
    } else {
      setClapProgress(`Đã vỗ ${clapTimes.current.length}/${clapExpected.current.length}`)
    }
  }

  if (!q) return null

  return (
    <div className="panel">
      <div className="lesson-eyebrow" style={{ marginBottom: 8 }}>Luyện âm · 5 nốt Đô Rê Mi Fa Sol</div>
      <div className="chip-row">
        {TYPES.map(t => (
          <div key={t.key} className={'chip' + (type === t.key ? ' active' : '')} onClick={() => setType(t.key)}>{t.label}</div>
        ))}
      </div>
      <div className="score-row">
        <span className="lesson-eyebrow">Luyện tập tự do</span>
        <span className="score">Chuỗi đúng: {streak}</span>
      </div>
      <div className="test-card">
        {type === 'compare' && (
          <>
            <div className="test-q">Nghe 2 nốt và cho biết nốt nào cao hơn:</div>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <button className="play-btn" style={{ display: 'inline-flex', margin: '0 6px' }} onClick={() => playNote(q.n1, 0.9)}>1</button>
              <button className="play-btn" style={{ display: 'inline-flex', margin: '0 6px' }} onClick={() => playNote(q.n2, 0.9)}>2</button>
            </div>
            <div className="options">
              {['Nốt 1', 'Nốt 2'].map(opt => (
                <div key={opt} className={'opt' + (answered ? (opt === q.correct ? ' correct' : '') : '')} onClick={() => handleAnswer(opt)}>{opt}</div>
              ))}
            </div>
          </>
        )}
        {type === 'same' && (
          <>
            <div className="test-q">Nghe 2 nốt và cho biết chúng giống hay khác nhau:</div>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <button className="play-btn" style={{ display: 'inline-flex' }} onClick={() => playSequence([q.n1, q.n2])}>▶</button>
            </div>
            <div className="options">
              {['Giống nhau', 'Khác nhau'].map(opt => (
                <div key={opt} className={'opt' + (answered ? (opt === q.correct ? ' correct' : '') : '')} onClick={() => handleAnswer(opt)}>{opt}</div>
              ))}
            </div>
          </>
        )}
        {type === 'name' && (
          <>
            <div className="test-q">Nghe và đoán tên nốt (trong 5 nốt đã học):</div>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <button className="play-btn" style={{ display: 'inline-flex' }} onClick={() => playNote(q.n, 1.0)}>▶</button>
            </div>
            <div className="options">
              {q.opts.map(opt => (
                <div key={opt} className={'opt' + (answered ? (opt === q.correct ? ' correct' : '') : '')} onClick={() => handleAnswer(opt)}>{opt}</div>
              ))}
            </div>
          </>
        )}
        {type === 'beat' && (
          <>
            <div className="test-q">Nghe và đếm số phách bạn nghe được:</div>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <button className="play-btn" style={{ display: 'inline-flex' }} onClick={() => playClick(q.pattern)}>▶</button>
            </div>
            <div className="options">
              {['2', '3', '4'].map(opt => (
                <div key={opt} className={'opt' + (answered ? (opt === q.correct ? ' correct' : '') : '')} onClick={() => handleAnswer(opt)}>{opt}</div>
              ))}
            </div>
          </>
        )}
        {type === 'clap' && (
          <>
            <div className="test-q">Nghe mẫu tiết tấu, sau đó bấm "Bắt đầu" và vỗ đúng theo nhịp:</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}
              dangerouslySetInnerHTML={{ __html: q.durations.map(d => noteIconSmall(d === 1)).join('') }} />
            <div style={{ textAlign: 'center' }}>
              <button className="play-btn" style={{ display: 'inline-flex' }} onClick={() => playRhythmDemo(q.durations)}>▶</button>
              <div style={{ marginTop: 10 }}>
                {clapStart.current === null && !feedback && (
                  <button className="nav-btn" onClick={startClap}>Bắt đầu vỗ tay</button>
                )}
              </div>
              {clapStart.current !== null && (
                <button className="play-btn" style={{ width: '100%', borderRadius: 14, fontSize: 14, marginTop: 10 }} onClick={registerClap}>👏 Vỗ</button>
              )}
              {clapProgress && <div className="sub" style={{ marginTop: 8 }}>{clapProgress}</div>}
              {feedback && <button className="nav-btn" style={{ marginTop: 10 }} onClick={gen}>Vỗ lại</button>}
            </div>
          </>
        )}
        {feedback && type !== 'clap' && (
          <div className="feedback" style={{ color: feedback.correct ? 'var(--green)' : 'var(--red)' }}>{feedback.text}</div>
        )}
        {feedback && type === 'clap' && (
          <div className="feedback" style={{ color: feedback.correct ? 'var(--green)' : 'var(--red)' }}>{feedback.text}</div>
        )}
      </div>
      {type !== 'clap' && <button className="next-btn" onClick={gen}>Câu tiếp theo</button>}
    </div>
  )
}
