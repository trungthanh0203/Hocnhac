// Các hàm sinh SVG khuông nhạc / minh họa — port từ bản demo đã duyệt
// Nhận dữ liệu "media" dạng jsonb từ Supabase (xem cấu trúc trong supabase/schema.sql)
// và trả về chuỗi SVG tương ứng để render qua dangerouslySetInnerHTML

const notePos = { C: 82, D: 75.5, E: 75, F: 67.5, G: 60, A: 52.5, B: 45 }

function staffBase(innerSvg, width, viewBoxW = 220) {
  return `<svg viewBox="0 0 ${viewBoxW} 90" width="${width}" style="display:block;margin:0 auto">
    <g stroke="#1c2333" stroke-width="1">
      <line x1="10" y1="15" x2="210" y2="15"/><line x1="10" y1="30" x2="210" y2="30"/>
      <line x1="10" y1="45" x2="210" y2="45"/><line x1="10" y1="60" x2="210" y2="60"/><line x1="10" y1="75" x2="210" y2="75"/>
    </g>
    <text x="14" y="58" font-size="42" fill="#0f2a52">&#119070;</text>
    ${innerSvg}
  </svg>`
}

export function renderStaffBlank(width = 200) {
  return staffBase('', width)
}

export function renderStaffNotes(notes, width = 200) {
  const startX = 90, endX = 205
  const step = notes.length > 1 ? (endX - startX) / (notes.length - 1) : 0
  let els = ''
  notes.forEach((n, i) => {
    const x = startX + step * i, y = notePos[n]
    els += `<ellipse cx="${x}" cy="${y}" rx="7" ry="5.5" fill="#c23b3b"/><line x1="${x + 6.5}" y1="${y}" x2="${x + 6.5}" y2="${y - 30}" stroke="#c23b3b" stroke-width="1.4"/>`
    if (n === 'C') els += `<line x1="${x - 9}" y1="86" x2="${x + 9}" y2="86" stroke="#1c2333" stroke-width="1"/>`
  })
  return staffBase(els, width)
}

export function renderClefHighlight(width = 200) {
  const inner = `<circle cx="27" cy="33" r="12" fill="none" stroke="#e8b64a" stroke-width="1.8"/>`
  // vẽ lại dòng kẻ số 2 màu vàng để nhấn mạnh
  const svg = `<svg viewBox="0 0 220 90" width="${width}" style="display:block;margin:0 auto">
    <g stroke="#1c2333" stroke-width="1">
      <line x1="10" y1="15" x2="210" y2="15"/>
      <line x1="10" y1="30" x2="210" y2="30" stroke="#e8b64a" stroke-width="2.4"/>
      <line x1="10" y1="45" x2="210" y2="45"/><line x1="10" y1="60" x2="210" y2="60"/><line x1="10" y1="75" x2="210" y2="75"/>
    </g>
    <text x="14" y="58" font-size="42" fill="#0f2a52">&#119070;</text>
    ${inner}
  </svg>`
  return svg
}

export function renderAccidental(note, symbol, width = 190) {
  const x = 120, y = notePos[note]
  const inner = `<text x="${x - 24}" y="${y + 6}" font-size="22" fill="#e8b64a">${symbol}</text>
    <ellipse cx="${x}" cy="${y}" rx="7" ry="5.5" fill="#c23b3b"/>
    <line x1="${x + 6.5}" y1="${y}" x2="${x + 6.5}" y2="${y - 30}" stroke="#c23b3b" stroke-width="1.4"/>`
  return staffBase(inner, width)
}

export function renderBeatStrip(pattern, width = 190) {
  const spacing = 200 / (pattern.length + 1)
  let els = ''
  pattern.forEach((p, i) => {
    const x = 20 + spacing * (i + 1), r = p === 2 ? 12 : 8, fill = p === 2 ? '#e8b64a' : '#0f2a52'
    els += `<circle cx="${x}" cy="28" r="${r}" fill="${fill}"/><text x="${x}" y="52" font-size="11" fill="#5c6270" text-anchor="middle">${i + 1}</text>`
  })
  return `<svg viewBox="0 0 220 60" width="${width}" style="display:block;margin:0 auto">${els}</svg>`
}

export function renderNotehead(filled, label, width = 90) {
  const strokeFill = filled ? `fill="#0f2a52"` : `fill="none" stroke="#e8b64a" stroke-width="1.8"`
  const stemColor = filled ? '#0f2a52' : '#e8b64a'
  return `<svg viewBox="0 0 90 70" width="${width}" style="display:block;margin:0 auto">
    <ellipse cx="20" cy="50" rx="9" ry="7" ${strokeFill}/>
    <line x1="28" y1="50" x2="28" y2="10" stroke="${stemColor}" stroke-width="1.8"/>
    <text x="42" y="42" font-size="13" fill="#5c6270">${label}</text>
  </svg>`
}

// Dispatcher chính: nhận media jsonb từ Supabase, trả về SVG string
export function renderMedia(media) {
  if (!media) return ''
  switch (media.kind) {
    case 'staff_blank': return renderStaffBlank()
    case 'staff_notes': return renderStaffNotes(media.notes)
    case 'clef_highlight': return renderClefHighlight()
    case 'accidental': return renderAccidental(media.note, media.symbol)
    case 'beat_strip': return renderBeatStrip(media.pattern)
    case 'notehead': return renderNotehead(media.filled, media.label)
    // 'icon' / 'pitch_icon' / 'duration_icon' / 'volume_icon' / 'instrument_icon':
    // xem src/lib/icons.js — bộ icon minh họa còn lại, chưa port hết trong bản khung này
    default: return ''
  }
}

export { notePos }
