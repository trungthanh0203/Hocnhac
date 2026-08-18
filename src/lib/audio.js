// Engine âm thanh tổng hợp (Web Audio API) — port từ bản demo đã duyệt
// Không cần file mp3 nào, mọi âm thanh đều tổng hợp trực tiếp trong trình duyệt

const freq = { C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.0, A: 440.0, B: 493.88 }

let actx
function ac() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)()
  return actx
}

export function playNote(note, dur = 0.9, delay = 0, type = 'triangle') {
  const c = ac()
  const t0 = c.currentTime + delay
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq[note]
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(0.6, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g)
  g.connect(c.destination)
  o.start(t0)
  o.stop(t0 + dur + 0.05)
}

export function playSequence(notes, gap = 0.5, type = 'triangle') {
  notes.forEach((n, i) => playNote(n, gap * 1.1, i * gap, type))
}

export function playClick(pattern, gap = 0.4) {
  const c = ac()
  pattern.forEach((accent, i) => {
    const t0 = c.currentTime + i * gap
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'square'
    o.frequency.value = accent ? 900 : 550
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(accent ? 0.5 : 0.3, t0 + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12)
    o.connect(g)
    g.connect(c.destination)
    o.start(t0)
    o.stop(t0 + 0.14)
  })
}

export function playDrum() {
  const c = ac()
  const t0 = c.currentTime
  const bufSize = c.sampleRate * 0.18
  const buf = c.createBuffer(1, bufSize, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize)
  const src = c.createBufferSource()
  src.buffer = buf
  const g = c.createGain()
  g.gain.value = 0.5
  src.connect(g)
  g.connect(c.destination)
  src.start(t0)
}

export function playTimbre(name) {
  if (name === 'piano') playNote('C', 0.8, 0, 'sine')
  else if (name === 'guitar') playNote('E', 0.9, 0, 'sawtooth')
  else if (name === 'violin') playNote('A', 1.3, 0, 'sawtooth')
  else if (name === 'drum') playDrum()
  else if (name === 'dan_tranh') playNote('A', 0.7, 0, 'sine')
  else if (name === 'dan_bau') playNote('D', 1.4, 0, 'sawtooth')
  else if (name === 'sao_truc') playNote('E', 1.0, 0, 'sine')
}

export function playAudioAction(audio) {
  if (!audio) return
  if (audio.type === 'note') playNote(audio.note, 1.0)
  else if (audio.type === 'sequence') playSequence(audio.notes)
  else if (audio.type === 'click') playClick(audio.pattern)
  else if (audio.type === 'timbre') playTimbre(audio.name)
  else if (audio.type === 'chord') playChord(audio.notes)
}

export { freq }

// Bổ sung cho tab Thực hành: phát 1 bản nhạc nhiều nốt theo trường độ,
// trả về tổng thời lượng (giây) và gọi onNoteStart(gid) đúng lúc từng nốt vang lên
export function playScore(flatNotes, onNoteStart, unit = 0.5) {
  const c = ac()
  let t = 0
  flatNotes.forEach(n => {
    const dur = n.dur * unit
    const t0 = c.currentTime + t
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'triangle'
    o.frequency.value = freq[n.note]
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.55, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.95)
    o.connect(g)
    g.connect(c.destination)
    o.start(t0)
    o.stop(t0 + dur)
    if (onNoteStart) setTimeout(() => onNoteStart(n.gid), t * 1000)
    t += dur
  })
  if (onNoteStart) setTimeout(() => onNoteStart(-1), t * 1000)
  return t
}

// Bổ sung cho Luyện âm: phát mẫu tiết tấu với khoảng cách biến thiên theo trường độ
export function playRhythmDemo(durations, unit = 0.6) {
  const c = ac()
  let t = 0
  durations.forEach((d, i) => {
    const t0 = c.currentTime + t
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'square'
    o.frequency.value = i === 0 ? 900 : 650
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(i === 0 ? 0.5 : 0.35, t0 + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12)
    o.connect(g)
    g.connect(c.destination)
    o.start(t0)
    o.stop(t0 + 0.14)
    t += d * unit
  })
}

// Phát hợp âm: nhiều nốt vang lên CÙNG LÚC (khác playSequence là phát lần lượt)
export function playChord(notes, dur = 1.3) {
  notes.forEach(n => playNote(n, dur, 0))
}
