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

// ============================================================
// Bộ 12 icon minh họa nhỏ (dùng trong Ôn tập, cho "kind":"icon","index":N)
// Port nguyên vẹn từ bản demo đã duyệt
// ============================================================
const ICONS_RAW = [
  `<g stroke="#0f2a52" stroke-width="1.4"><line x1="4" y1="16" x2="60" y2="16"/><line x1="4" y1="25" x2="60" y2="25"/><line x1="4" y1="34" x2="60" y2="34"/><line x1="4" y1="43" x2="60" y2="43"/><line x1="4" y1="52" x2="60" y2="52"/></g><text x="6" y="46" font-size="36" fill="#0f2a52">&#119070;</text>`,
  `<polyline points="6,52 14,45 22,38 30,31 38,24 46,17 54,10" fill="none" stroke="#0f2a52" stroke-width="1.3"/><g fill="#e8b64a"><circle cx="6" cy="52" r="3"/><circle cx="14" cy="45" r="3"/><circle cx="22" cy="38" r="3"/><circle cx="30" cy="31" r="3"/><circle cx="38" cy="24" r="3"/><circle cx="46" cy="17" r="3"/><circle cx="54" cy="10" r="3"/></g>`,
  `<g stroke="#0f2a52" stroke-width="1.2"><line x1="4" y1="14" x2="60" y2="14"/><line x1="4" y1="23" x2="60" y2="23"/><line x1="4" y1="32" x2="60" y2="32"/><line x1="4" y1="41" x2="60" y2="41"/><line x1="4" y1="50" x2="60" y2="50"/></g><circle cx="20" cy="23" r="4" fill="#e8b64a"/><circle cx="42" cy="27.5" r="4" fill="#0f2a52"/>`,
  `<text x="4" y="38" font-size="34" fill="#0f2a52">&#9839;</text><text x="34" y="54" font-size="28" fill="#e8b64a">&#9837;</text>`,
  `<polygon points="18,54 46,54 32,8" fill="none" stroke="#0f2a52" stroke-width="1.4"/><line x1="32" y1="50" x2="44" y2="16" stroke="#e8b64a" stroke-width="2.2"/><circle cx="44" cy="16" r="3.4" fill="#e8b64a"/>`,
  `<line x1="12" y1="32" x2="52" y2="32" stroke="#0f2a52" stroke-width="1.6"/><text x="24" y="26" font-size="22" fill="#0f2a52" font-weight="bold">2</text><text x="24" y="54" font-size="22" fill="#e8b64a" font-weight="bold">4</text>`,
  `<ellipse cx="16" cy="46" rx="8" ry="6" fill="#0f2a52"/><line x1="23" y1="46" x2="23" y2="12" stroke="#0f2a52" stroke-width="1.6"/><ellipse cx="46" cy="46" rx="8" ry="6" fill="none" stroke="#e8b64a" stroke-width="1.8"/><line x1="53" y1="46" x2="53" y2="12" stroke="#e8b64a" stroke-width="1.6"/>`,
  `<rect x="26" y="6" width="12" height="26" rx="6" fill="#0f2a52"/><path d="M18 26 a14 14 0 0 0 28 0" fill="none" stroke="#0f2a52" stroke-width="2"/><line x1="32" y1="40" x2="32" y2="54" stroke="#0f2a52" stroke-width="2"/><line x1="22" y1="54" x2="42" y2="54" stroke="#0f2a52" stroke-width="2"/><path d="M46 16 q6 6 0 12" fill="none" stroke="#e8b64a" stroke-width="2"/>`,
  `<path d="M6 40 Q20 12 32 30 T58 20" fill="none" stroke="#0f2a52" stroke-width="1.6"/><circle cx="6" cy="40" r="3" fill="#e8b64a"/><circle cx="32" cy="30" r="3" fill="#e8b64a"/><circle cx="58" cy="20" r="3" fill="#e8b64a"/>`,
  `<polyline points="8,48 20,38 32,28 44,18 56,10" fill="none" stroke="#0f2a52" stroke-width="1.3"/><g fill="#e8b64a"><circle cx="8" cy="48" r="3.4"/><circle cx="20" cy="38" r="3.4"/><circle cx="32" cy="28" r="3.4"/><circle cx="44" cy="18" r="3.4"/><circle cx="56" cy="10" r="3.4"/></g>`,
  `<g stroke="#0f2a52" stroke-width="1.6" fill="none"><line x1="10" y1="50" x2="10" y2="12"/><polyline points="6,18 10,12 14,18"/><polyline points="6,44 10,50 14,44"/><circle cx="32" cy="32" r="12"/><line x1="32" y1="32" x2="32" y2="23"/><line x1="32" y1="32" x2="39" y2="35"/></g><path d="M48 24 h6 l8 -8 v32 l-8 -8 h-6 z" fill="#e8b64a" stroke="none"/>`,
  `<g stroke="#0f2a52" stroke-width="1.2" fill="none"><rect x="3" y="4" width="24" height="14" rx="2"/><line x1="9" y1="4" x2="9" y2="18"/><line x1="15" y1="4" x2="15" y2="18"/><line x1="21" y1="4" x2="21" y2="18"/><circle cx="46" cy="11" r="8"/><circle cx="46" cy="11" r="3" fill="#e8b64a" stroke="none"/><ellipse cx="14" cy="46" rx="10" ry="6"/><rect x="4" y="40" width="20" height="6"/><path d="M44 34 q6 -10 12 0 q6 10 -6 16 q-12 -6 -6 -16 z"/></g>`,
]

export function renderIcon(index, size = 30) {
  const raw = ICONS_RAW[index % ICONS_RAW.length]
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">${raw}</svg>`
}

// ============================================================
// Icon riêng cho bài "Âm nhạc là gì?" (3 yếu tố) và "Nhạc cụ quen thuộc"
// ============================================================
export const pitchIcon = `<svg viewBox="0 0 40 40" width="46"><line x1="20" y1="34" x2="20" y2="6" stroke="#0f2a52" stroke-width="2"/><polyline points="12,14 20,6 28,14" fill="none" stroke="#0f2a52" stroke-width="2"/></svg>`
export const durationIcon = `<svg viewBox="0 0 40 40" width="46"><circle cx="20" cy="20" r="14" fill="none" stroke="#0f2a52" stroke-width="2"/><line x1="20" y1="20" x2="20" y2="10" stroke="#0f2a52" stroke-width="2"/><line x1="20" y1="20" x2="27" y2="23" stroke="#0f2a52" stroke-width="2"/></svg>`
export const volumeIcon = `<svg viewBox="0 0 40 40" width="46"><path d="M6 16 h6 l9 -9 v26 l-9 -9 h-6 z" fill="#e8b64a"/><path d="M28 12 q6 8 0 16" fill="none" stroke="#0f2a52" stroke-width="2"/></svg>`

const INSTRUMENT_ICONS = {
  piano: `<svg viewBox="0 0 40 26" width="56"><rect x="2" y="2" width="36" height="20" rx="2" fill="none" stroke="#0f2a52" stroke-width="1.4"/><line x1="10" y1="2" x2="10" y2="22" stroke="#0f2a52" stroke-width="1.2"/><line x1="18" y1="2" x2="18" y2="22" stroke="#0f2a52" stroke-width="1.2"/><line x1="26" y1="2" x2="26" y2="22" stroke="#0f2a52" stroke-width="1.2"/><line x1="34" y1="2" x2="34" y2="22" stroke="#0f2a52" stroke-width="1.2"/></svg>`,
  guitar: `<svg viewBox="0 0 40 50" width="46"><line x1="20" y1="18" x2="20" y2="2" stroke="#0f2a52" stroke-width="3"/><circle cx="20" cy="32" r="14" fill="none" stroke="#0f2a52" stroke-width="1.6"/><circle cx="20" cy="32" r="5" fill="#e8b64a"/></svg>`,
  drum: `<svg viewBox="0 0 40 34" width="52"><ellipse cx="20" cy="8" rx="16" ry="6" fill="none" stroke="#0f2a52" stroke-width="1.4"/><line x1="4" y1="8" x2="4" y2="26" stroke="#0f2a52" stroke-width="1.4"/><line x1="36" y1="8" x2="36" y2="26" stroke="#0f2a52" stroke-width="1.4"/><ellipse cx="20" cy="26" rx="16" ry="6" fill="none" stroke="#0f2a52" stroke-width="1.4"/></svg>`,
  violin: `<svg viewBox="0 0 30 50" width="38"><path d="M15 4 q10 6 6 16 q-4 6 0 12 q4 6 -6 12 q-10 -6 -6 -12 q4 -6 0 -12 q-4 -10 6 -16 z" fill="none" stroke="#0f2a52" stroke-width="1.4"/></svg>`,
}
export function renderInstrumentIcon(name) {
  return INSTRUMENT_ICONS[name] || ''
}

// Cập nhật dispatcher renderMedia để nhận thêm các kind mới
const _origRenderMedia = renderMedia
export function renderMediaFull(media) {
  if (!media) return ''
  switch (media.kind) {
    case 'icon': return renderIcon(media.index)
    case 'pitch_icon': return pitchIcon
    case 'duration_icon': return durationIcon
    case 'volume_icon': return volumeIcon
    case 'instrument_icon': return renderInstrumentIcon(media.name)
    default: return _origRenderMedia(media)
  }
}

// ============================================================
// Bổ sung cho Sơ cấp 2-3: icon số chỉ nhịp (tổng quát cho mọi loại nhịp)
// và icon dấu lặng
// ============================================================
export function renderMeterIcon(num, den, size = 70) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" style="display:block;margin:0 auto">
    <line x1="10" y1="32" x2="54" y2="32" stroke="#0f2a52" stroke-width="1.6"/>
    <text x="32" y="26" font-size="22" fill="#0f2a52" font-weight="bold" text-anchor="middle">${num}</text>
    <text x="32" y="54" font-size="22" fill="#e8b64a" font-weight="bold" text-anchor="middle">${den}</text>
  </svg>`
}

export function renderRestIcon(type, label, size = 80) {
  if (type === 'half') {
    return `<svg viewBox="0 0 80 50" width="${size}" style="display:block;margin:0 auto">
      <rect x="30" y="16" width="20" height="7" fill="#0f2a52"/>
      <text x="40" y="42" font-size="11" fill="#5c6270" text-anchor="middle">${label}</text>
    </svg>`
  }
  return `<svg viewBox="0 0 80 60" width="${size}" style="display:block;margin:0 auto">
    <text x="26" y="38" font-size="30" fill="#0f2a52">&#119133;</text>
    <text x="40" y="54" font-size="11" fill="#5c6270" text-anchor="middle">${label}</text>
  </svg>`
}

const _prevRenderMediaFull = renderMediaFull
export function renderMediaFullV2(media) {
  if (!media) return ''
  if (media.kind === 'meter') return renderMeterIcon(media.num, media.den)
  if (media.kind === 'rest') return renderRestIcon(media.type, media.label)
  return _prevRenderMediaFull(media)
}

// ============================================================
// BO SUNG LON: hình minh họa cho quãng, hợp âm, hóa biểu (dùng cho Trung cấp trở lên)
// và vài hình còn thiếu ở Sơ cấp 2-3 (dấu lặng, so sánh trường độ...)
// ============================================================

export function renderBreathIcon(size = 50) {
  return `<svg viewBox="0 0 50 50" width="${size}" style="display:block;margin:0 auto">
    <path d="M18 10 Q10 25 18 40" fill="none" stroke="#0f2a52" stroke-width="2"/>
    <path d="M30 10 Q22 25 30 40" fill="none" stroke="#e8b64a" stroke-width="2"/>
  </svg>`
}

export function renderRestCompare(size = 170) {
  return `<svg viewBox="0 0 170 70" width="${size}" style="display:block;margin:0 auto">
    <text x="30" y="42" font-size="26" fill="#0f2a52" text-anchor="middle">&#119133;</text>
    <text x="30" y="60" font-size="10" fill="#5c6270" text-anchor="middle">Lặng đen = 1 phách</text>
    <rect x="115" y="24" width="20" height="7" fill="#e8b64a"/>
    <text x="125" y="60" font-size="10" fill="#5c6270" text-anchor="middle">Lặng trắng = 2 phách</text>
  </svg>`
}

export function renderBeamedEighths(size = 120) {
  return `<svg viewBox="0 0 110 60" width="${size}" style="display:block;margin:0 auto">
    <ellipse cx="20" cy="45" rx="7" ry="5.5" fill="#0f2a52"/>
    <ellipse cx="55" cy="45" rx="7" ry="5.5" fill="#0f2a52"/>
    <line x1="27" y1="45" x2="27" y2="14" stroke="#0f2a52" stroke-width="1.6"/>
    <line x1="62" y1="45" x2="62" y2="14" stroke="#0f2a52" stroke-width="1.6"/>
    <line x1="27" y1="14" x2="62" y2="14" stroke="#0f2a52" stroke-width="3"/>
    <text x="41" y="58" font-size="10" fill="#5c6270" text-anchor="middle">2 móc đơn = 1 phách</text>
  </svg>`
}

export function renderMilestoneIcon(size = 50) {
  return `<svg viewBox="0 0 50 50" width="${size}" style="display:block;margin:0 auto">
    <circle cx="25" cy="25" r="20" fill="none" stroke="#e8b64a" stroke-width="2.5"/>
    <path d="M15 26 L22 33 L36 17" fill="none" stroke="#0f2a52" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}

export function renderDottedCompare(size = 180) {
  return `<svg viewBox="0 0 170 70" width="${size}" style="display:block;margin:0 auto">
    <ellipse cx="25" cy="45" rx="8" ry="6" fill="none" stroke="#0f2a52" stroke-width="1.8"/>
    <line x1="33" y1="45" x2="33" y2="12" stroke="#0f2a52" stroke-width="1.6"/>
    <text x="25" y="62" font-size="10" fill="#5c6270" text-anchor="middle">2 phách</text>
    <ellipse cx="110" cy="45" rx="8" ry="6" fill="none" stroke="#e8b64a" stroke-width="1.8"/>
    <line x1="118" y1="45" x2="118" y2="12" stroke="#e8b64a" stroke-width="1.6"/>
    <circle cx="128" cy="45" r="2.4" fill="#e8b64a"/>
    <text x="118" y="62" font-size="10" fill="#5c6270" text-anchor="middle">3 phách (chấm dôi)</text>
  </svg>`
}

export function renderForwardIcon(size = 50) {
  return `<svg viewBox="0 0 50 30" width="${size}" style="display:block;margin:0 auto">
    <line x1="6" y1="15" x2="34" y2="15" stroke="#0f2a52" stroke-width="2.4"/>
    <polyline points="27,7 38,15 27,23" fill="none" stroke="#e8b64a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}

// Quãng: vẽ 2 nốt trên khuông kèm dấu ngoặc và nhãn tên quãng
export function renderIntervalSVG(noteA, noteB, label, size = 180) {
  const yA = notePos[noteA], yB = notePos[noteB]
  const ledgerA = noteA === 'C' ? `<line x1="81" y1="86" x2="99" y2="86" stroke="#1c2333" stroke-width="1"/>` : ''
  const ledgerB = noteB === 'C' ? `<line x1="141" y1="86" x2="159" y2="86" stroke="#1c2333" stroke-width="1"/>` : ''
  const top = Math.min(yA, yB) - 16
  return `<svg viewBox="0 0 220 100" width="${size}" style="display:block;margin:0 auto">
    <g stroke="#1c2333" stroke-width="1">
      <line x1="10" y1="15" x2="210" y2="15"/><line x1="10" y1="30" x2="210" y2="30"/>
      <line x1="10" y1="45" x2="210" y2="45"/><line x1="10" y1="60" x2="210" y2="60"/><line x1="10" y1="75" x2="210" y2="75"/>
    </g>
    <text x="14" y="58" font-size="42" fill="#0f2a52">&#119070;</text>
    <ellipse cx="90" cy="${yA}" rx="7" ry="5.5" fill="#c23b3b"/>${ledgerA}
    <ellipse cx="150" cy="${yB}" rx="7" ry="5.5" fill="#e8b64a"/>${ledgerB}
    <path d="M90 ${top} L150 ${top}" stroke="#5c6270" stroke-width="1" fill="none" stroke-dasharray="2,2"/>
    <text x="120" y="${top - 6}" font-size="12" fill="#5c6270" text-anchor="middle" font-weight="700">${label}</text>
  </svg>`
}

// Hóa biểu: khuông nhạc + khóa Sol + các dấu thăng/giáng ngay sau khóa
export function renderKeySignatureSVG(items, size = 190) {
  let x = 34, els = ''
  items.forEach(it => {
    const y = notePos[it.note]
    els += `<text x="${x}" y="${y + 6}" font-size="18" fill="#e8b64a">${it.sym}</text>`
    x += 9
  })
  return `<svg viewBox="0 0 220 90" width="${size}" style="display:block;margin:0 auto">
    <g stroke="#1c2333" stroke-width="1">
      <line x1="10" y1="15" x2="210" y2="15"/><line x1="10" y1="30" x2="210" y2="30"/>
      <line x1="10" y1="45" x2="210" y2="45"/><line x1="10" y1="60" x2="210" y2="60"/><line x1="10" y1="75" x2="210" y2="75"/>
    </g>
    <text x="14" y="58" font-size="42" fill="#0f2a52">&#119070;</text>
    ${els}
  </svg>`
}

// Hợp âm: 3 nốt xếp chồng trên cùng 1 khuông, dùng chung 1 đuôi nốt
export function renderChordSVG(notesArr, size = 150) {
  const x = 110
  let els = ''
  notesArr.forEach(n => {
    const y = notePos[n]
    els += `<ellipse cx="${x}" cy="${y}" rx="7" ry="5.5" fill="#c23b3b"/>`
    if (n === 'C') els += `<line x1="${x - 9}" y1="86" x2="${x + 9}" y2="86" stroke="#1c2333" stroke-width="1"/>`
  })
  const ys = notesArr.map(n => notePos[n])
  const top = Math.min(...ys), bottom = Math.max(...ys)
  els += `<line x1="${x + 6.5}" y1="${bottom}" x2="${x + 6.5}" y2="${top - 30}" stroke="#0f2a52" stroke-width="1.4"/>`
  return `<svg viewBox="0 0 220 100" width="${size}" style="display:block;margin:0 auto">
    <g stroke="#1c2333" stroke-width="1">
      <line x1="10" y1="15" x2="210" y2="15"/><line x1="10" y1="30" x2="210" y2="30"/>
      <line x1="10" y1="45" x2="210" y2="45"/><line x1="10" y1="60" x2="210" y2="60"/><line x1="10" y1="75" x2="210" y2="75"/>
    </g>
    <text x="14" y="58" font-size="42" fill="#0f2a52">&#119070;</text>
    ${els}
  </svg>`
}

// Vòng hòa âm: chuỗi ô hợp âm nối tiếp nhau kèm mũi tên
export function renderProgressionSVG(chords, size = 220) {
  const n = chords.length, spacing = 200 / n
  let els = ''
  chords.forEach((c, i) => {
    const cx = 10 + spacing * i + spacing / 2
    els += `<rect x="${cx - 22}" y="8" width="44" height="30" rx="6" fill="none" stroke="#0f2a52" stroke-width="1.6"/>`
    els += `<text x="${cx}" y="28" font-size="14" font-weight="700" fill="#0f2a52" text-anchor="middle">${c}</text>`
    if (i < n - 1) els += `<line x1="${cx + 24}" y1="23" x2="${cx + spacing - 24}" y2="23" stroke="#e8b64a" stroke-width="2"/>`
  })
  return `<svg viewBox="0 0 220 46" width="${size}" style="display:block;margin:0 auto">${els}</svg>`
}

const _prevRenderMediaFullV2 = renderMediaFullV2
export function renderMediaFullV3(media) {
  if (!media) return ''
  switch (media.kind) {
    case 'breath': return renderBreathIcon()
    case 'rest_compare': return renderRestCompare()
    case 'beamed_eighths': return renderBeamedEighths()
    case 'milestone': return renderMilestoneIcon()
    case 'dotted_compare': return renderDottedCompare()
    case 'forward': return renderForwardIcon()
    case 'interval': return renderIntervalSVG(media.noteA, media.noteB, media.label)
    case 'key_signature': return renderKeySignatureSVG(media.items || [])
    case 'chord': return renderChordSVG(media.notes)
    case 'progression': return renderProgressionSVG(media.chords)
    default: return _prevRenderMediaFullV2(media)
  }
}
