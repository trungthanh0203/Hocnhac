import { useEffect, useMemo, useState } from 'react'
import { playNote, playSequence, playClick, playRhythmDemo, playChord } from '../lib/audio.js'

const SCALE = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const SOLFEGE = { C: 'Đô', D: 'Rê', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' }
const FREQ = { C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.0, A: 440.0, B: 493.88 }
const RHYTHM_POOL = [[1, 1, 1, 1], [2, 1, 1], [1, 2, 1], [1, 1, 2], [2, 2]]
const TRIADS = [
  { notes: ['C', 'E', 'G'], quality: 'Trưởng' },
  { notes: ['D', 'F', 'A'], quality: 'Thứ' },
  { notes: ['E', 'G', 'B'], quality: 'Thứ' },
  { notes: ['F', 'A', 'C'], quality: 'Trưởng' },
  { notes: ['G', 'B', 'D'], quality: 'Trưởng' },
  { notes: ['A', 'C', 'E'], quality: 'Thứ' },
]

const BASE_TYPES = [
  { key: 'compare', label: 'So sánh cao độ' },
  { key: 'same', label: 'Giống hay khác' },
  { key: 'name', label: 'Đoán tên nốt' },
  { key: 'beat', label: 'Đếm phách' },
  { key: 'clap', label: 'Vỗ tay tiết tấu' },
]
const ADVANCED_TYPES = [
  { key: 'interval', label: 'Đoán quãng' },
  { key: 'chord', label: 'Trưởng hay thứ' },
]

function randPick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle(arr) { return arr.slice().sort(() => Math.random() - 0.5) }

function noteIconSmall(filled) {
  return `<svg viewBox="0 0 30 40" width="24" style="margin:0 3px">
    <ellipse cx="10" cy="30" rx="7" ry="5.5" ${filled ? 'fill="#0f2a52"' : 'fill="none" stroke="#e8b64a" stroke-width="1.6"'}/>
    <line x1="17" y1="30" x2="17" y2="6" stroke="${filled ? '#0f2a52' : '#e8b64a'}" stroke-width="1.6"/>
  </svg>`
}

// Hàm sinh câu hỏi THUẦN (không đụng state) — luôn trả về đúng cấu trúc khớp với `type`,
// nên không bao giờ có tình trạng "đang hiện dạng bài A nhưng dữ liệu vẫn của dạng bài B" nữa.
function generateQuestion(type, notePool) {
  if (type === 'compare') {
    const n1 = randPick(notePool), n2 = randPick(notePool.filter(n => n !== n1))
    return { n1, n2, correct: FREQ[n1] < FREQ[n2] ? 'Nốt 2' : 'Nốt 1' }
  }
  if (type === 'same') {
    const same = Math.random() < 0.5
    const n1 = randPick(notePool), n2 = same ? n1 : randPick(notePool.filter(n => n !== n1))
    return { n1, n2, correct: same ? 'Giống nhau' : 'Khác nhau' }
  }
  if (type === 'name') {
    const n = randPick(notePool)
    const distractors = shuffle(notePool.filter(x => x !== n)).slice(0, 3)
    const opts = shuffle([...distractors, n]).map(x => SOLFEGE[x])
    return { n, opts, correct: SOLFEGE[n] }
  }
  if (type === 'beat') {
    const n = randPick([2, 3, 4])
    const pattern = Array.from({ length: n }, (_, i) => (i === 0 ? 1 : 0))
    return { pattern, correct: String(n) }
  }
  if (type === 'clap') {
    const durations = randPick(RHYTHM_POOL)
    let cum = 0
    const expected = durations.map(d => { const t = cum * 1000; cum += d * 0.6; return t })
    return { durations, expected }
  }
  if (type === 'interval') {
    const startIdx = randPick([0, 1, 2, 3, 4])
    const size = randPick([2, 3, 4, 5])
    let endIdx = startIdx + (size - 1)
    if (endIdx > 6) endIdx = startIdx - (size - 1)
    const lo = Math.min(startIdx, endIdx), hi = Math.max(startIdx, endIdx)
    const n1 = SCALE[lo], n2 = SCALE[hi]
    const correctSize = hi - lo + 1
    const opts = shuffle([2, 3, 4, 5].map(s => `Quãng ${s}`))
    return { n1, n2, opts, correct: `Quãng ${correctSize}` }
  }
  if (type === 'chord') {
    const t = randPick(TRIADS)
    return { notes: t.notes, correct: t.quality }
  }
  return null
}

export default function EarTrainingTab({ levelName, levelTier }) {
  // Phạm vi nốt và độ khó lấy trực tiếp từ props do App.jsx đã tải sẵn — không tự gọi mạng nữa
  const notePool = useMemo(
    () => (levelName === 'Sơ cấp 1' ? ['C', 'D', 'E', 'F', 'G'] : ['C', 'D', 'E', 'F', 'G', 'A', 'B']),
    [levelName]
  )
  const advancedUnlocked = levelTier === 'Trung cấp' || levelTier === 'Nâng cao'
  const TYPES = advancedUnlocked ? [...BASE_TYPES, ...ADVANCED_TYPES] : BASE_TYPES

  const [type, setType] = useState('compare')
  const [seed, setSeed] = useState(0)
  const [streak, setStreak] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [clapActive, setClapActive] = useState(false)
  const [clapCount, setClapCount] = useState(0)
  const [clapTimes, setClapTimes] = useState([])
  const [clapStartAt, setClapStartAt] = useState(null)

  // Nếu đổi cấp mà dạng bài đang chọn không còn được hỗ trợ, quay về dạng cơ bản
  useEffect(() => {
    if (!TYPES.some(t => t.key === type)) setType('compare')
  }, [advancedUnlocked]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cốt lõi của bản sửa lỗi: q được tính TRONG lúc render (useMemo), luôn khớp 100% với `type`
  // hiện tại — không còn khoảng hở khiến giao diện dạng bài mới đọc nhầm dữ liệu dạng bài cũ.
  const q = useMemo(() => generateQuestion(type, notePool), [type, notePool, seed])

  // Dọn trạng thái phụ (đã trả lời, chuỗi vỗ tay...) mỗi khi có câu hỏi mới
  useEffect(() => {
    setAnswered(false); setSelected(null); setFeedback(null)
    setClapActive(false); setClapCount(0); setClapTimes([]); setClapStartAt(null)
  }, [q])

  function nextQuestion() { setSeed(s => s + 1) }

  function handleAnswer(optText) {
    if (answered || !q) return
    setAnswered(true); setSelected(optText)
    const correct = optText === q.correct
    setStreak(s => correct ? s + 1 : 0)
    setFeedback({ correct, text: correct ? 'Chính xác!' : `Chưa đúng. Đáp án đúng: ${q.correct}` })
  }

  function optClass(opt) {
    if (!answered) return 'opt'
    if (opt === q.correct) return 'opt correct'
    if (opt === selected) return 'opt wrong'
    return 'opt'
  }

  function startClap() {
    setClapTimes([0])
    setClapStartAt(performance.now())
    setClapActive(true)
    setClapCount(1)
  }
  function registerClap() {
    if (!clapActive || !q?.expected || clapTimes.length >= q.expected.length) return
    const t = performance.now() - clapStartAt
    const newTimes = [...clapTimes, t]
    setClapTimes(newTimes)
    setClapCount(newTimes.length)
    if (newTimes.length >= q.expected.length) {
      const diffs = newTimes.map((tm, i) => Math.abs(tm - q.expected[i]))
      const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length
      let text, ok
      if (avg < 220) { text = 'Xuất sắc! Vỗ tay rất khớp nhịp.'; ok = true }
      else if (avg < 450) { text = 'Khá ổn, cố gắng đều tay hơn nhé.'; ok = false }
      else { text = 'Chưa khớp nhịp lắm, nghe lại mẫu và thử lại nhé.'; ok = false }
      setStreak(s => ok ? s + 1 : 0)
      setFeedback({ correct: ok, text })
      setClapActive(false)
    }
  }

  if (!q) return null

  return (
    <div className="panel">
      <div className="lesson-eyebrow" style={{ marginBottom: 8 }}>
        Luyện âm · {notePool.length === 5 ? '5 nốt Đô Rê Mi Fa Sol' : 'đủ 7 nốt Đô đến Si'}{advancedUnlocked ? ' · có quãng & hợp âm' : ''}
      </div>
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
                <div key={opt} className={optClass(opt)} onClick={() => handleAnswer(opt)}>{opt}</div>
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
                <div key={opt} className={optClass(opt)} onClick={() => handleAnswer(opt)}>{opt}</div>
              ))}
            </div>
          </>
        )}
        {type === 'name' && (
          <>
            <div className="test-q">Nghe và đoán tên nốt:</div>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <button className="play-btn" style={{ display: 'inline-flex' }} onClick={() => playNote(q.n, 1.0)}>▶</button>
            </div>
            <div className="options">
              {q.opts.map(opt => (
                <div key={opt} className={optClass(opt)} onClick={() => handleAnswer(opt)}>{opt}</div>
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
                <div key={opt} className={optClass(opt)} onClick={() => handleAnswer(opt)}>{opt}</div>
              ))}
            </div>
          </>
        )}
        {type === 'interval' && (
          <>
            <div className="test-q">Nghe 2 nốt và cho biết đây là quãng mấy:</div>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <button className="play-btn" style={{ display: 'inline-flex' }} onClick={() => playSequence([q.n1, q.n2])}>▶</button>
            </div>
            <div className="options">
              {q.opts.map(opt => (
                <div key={opt} className={optClass(opt)} onClick={() => handleAnswer(opt)}>{opt}</div>
              ))}
            </div>
          </>
        )}
        {type === 'chord' && (
          <>
            <div className="test-q">Nghe hợp âm và cho biết đây là hợp âm trưởng hay thứ:</div>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <button className="play-btn" style={{ display: 'inline-flex' }} onClick={() => playChord(q.notes)}>▶</button>
            </div>
            <div className="options">
              {['Trưởng', 'Thứ'].map(opt => (
                <div key={opt} className={optClass(opt)} onClick={() => handleAnswer(opt)}>{opt}</div>
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
                {!clapActive && !feedback && (
                  <button className="nav-btn" onClick={startClap}>Bắt đầu vỗ tay</button>
                )}
              </div>
              {clapActive && (
                <button className="play-btn" style={{ width: '100%', borderRadius: 14, fontSize: 14, marginTop: 10 }} onClick={registerClap}>👏 Vỗ</button>
              )}
              {(clapActive || clapCount > 0) && !feedback && (
                <div className="sub" style={{ marginTop: 8 }}>Đã vỗ {clapCount}/{q.expected.length}</div>
              )}
              {feedback && <button className="nav-btn" style={{ marginTop: 10 }} onClick={nextQuestion}>Bài khác</button>}
            </div>
          </>
        )}
        {feedback && <div className="feedback" style={{ color: feedback.correct ? 'var(--green)' : 'var(--red)' }}>{feedback.text}</div>}
      </div>
      {type !== 'clap' && <button className="next-btn" onClick={nextQuestion}>Câu tiếp theo</button>}
    </div>
  )
}
