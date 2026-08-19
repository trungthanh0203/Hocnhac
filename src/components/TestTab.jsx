import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { renderStaffNotes } from '../lib/staffSvg.js'
import { playNote } from '../lib/audio.js'

const TYPE_LABEL = { mc: 'Trắc nghiệm khái niệm', staff: 'Nhìn khuông nhạc, chọn tên nốt', audio: 'Nghe rồi chọn nốt', match: 'Ghép nghĩa đúng', fill: 'Điền đáp án' }

function shuffle(arr) { return arr.slice().sort(() => Math.random() - 0.5) }

export default function TestTab({ levelId, allLevels }) {
  const [bank, setBank] = useState([])
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const query = supabase.from('questions').select('*')
    const scoped = allLevels ? query : query.eq('level_id', levelId)
    scoped.then(({ data }) => {
      setBank(data || [])
      setLoading(false)
    })
  }, [levelId, allLevels])

  useEffect(() => { if (bank.length) startNewTest() }, [bank])

  function startNewTest() {
    const picked = shuffle(bank).slice(0, 6)
    setQuestions(picked)
    setAnswers({})
    setChecked(false)
  }

  function setAnswer(i, val) { setAnswers(a => ({ ...a, [i]: val })) }

  function isCorrect(q, i) {
    const userAns = answers[i]
    if (q.type === 'fill') {
      const norm = s => (s || '').trim().toLowerCase()
      return (q.answers || []).some(a => norm(a) === norm(userAns))
    }
    return userAns === q.correct_answer
  }

  const score = checked ? questions.filter((q, i) => isCorrect(q, i)).length : 0
  const total = questions.length
  const pct = total ? Math.round((score / total) * 100) : 0
  const tier = pct === 100
    ? { emoji: '🏆', title: 'Xuất sắc!', text: 'Bạn trả lời đúng tất cả các câu — quá giỏi!' }
    : pct >= 75 ? { emoji: '🌟', title: 'Rất tốt!', text: 'Bạn nắm bài rất chắc rồi đó.' }
    : pct >= 50 ? { emoji: '👍', title: 'Khá ổn!', text: 'Ôn lại một chút nữa là chắc bài luôn.' }
    : { emoji: '💪', title: 'Cố gắng thêm nhé!', text: 'Xem lại phần Bài học rồi quay lại thử tiếp nào.' }

  if (loading) return <div className="loading">Đang tải câu hỏi…</div>
  if (bank.length === 0) return <div className="loading">Chưa có câu hỏi cho cấp này.</div>

  return (
    <div className="panel">
      <div className="lesson-eyebrow" style={{ marginBottom: 10 }}>Bài test · 6 câu ngẫu nhiên{allLevels ? ' · lấy từ toàn bộ 9 cấp' : ''}</div>

      {questions.map((q, i) => {
        const correct = checked && isCorrect(q, i)
        const wrong = checked && !isCorrect(q, i)
        return (
          <div key={q.id} className={'quiz-q-card' + (correct ? ' correct' : wrong ? ' incorrect' : '')}>
            <div className="quiz-q-title">{i + 1}. {q.question_text}</div>

            {q.type === 'staff' && <div style={{ margin: '6px 0 10px' }} dangerouslySetInnerHTML={{ __html: renderStaffNotes([q.note], 170) }} />}
            {q.type === 'audio' && (
              <button className="play-btn" style={{ display: 'inline-flex', margin: '4px 0 10px' }} onClick={() => playNote(q.note, 1.0)}>▶</button>
            )}

            {q.type === 'fill' ? (
              <input type="text" className="quiz-input" placeholder="Nhập câu trả lời" disabled={checked}
                value={answers[i] || ''} onChange={e => setAnswer(i, e.target.value)} />
            ) : (
              (q.options || []).map((opt, j) => (
                <label className="quiz-option" key={j}>
                  <input type="radio" name={`q-${i}`} disabled={checked} checked={answers[i] === opt}
                    onChange={() => setAnswer(i, opt)} />
                  <span>{opt}</span>
                </label>
              ))
            )}

            {checked && (
              <div className={'quiz-feedback ' + (correct ? 'correct' : 'incorrect')}>
                {correct ? 'Chính xác!' : `Chưa đúng. Đáp án đúng: ${q.type === 'fill' ? (q.answers || [])[0] : q.correct_answer}`}
              </div>
            )}
          </div>
        )
      })}

      {!checked ? (
        <button className="next-btn" onClick={() => setChecked(true)}>Chấm điểm</button>
      ) : (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <div style={{ fontSize: 38, marginBottom: 6 }}>{tier.emoji}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{tier.title}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 10 }}>{tier.text}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>Điểm: {score}/{total} ({pct}%)</div>
          <button className="next-btn" onClick={startNewTest}>Làm bài test mới</button>
        </div>
      )}
    </div>
  )
}
