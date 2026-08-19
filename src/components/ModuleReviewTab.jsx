import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { renderIcon } from '../lib/staffSvg.js'
import { playNote } from '../lib/audio.js'

const MODULE_NAMES = ['Nhạc lý', 'Tiết tấu', 'Xướng âm', 'Hòa âm', 'Thường thức']

// Ôn tập theo module: lướt khái niệm của 1 module xuyên suốt 9 cấp.
// Khác với Ôn tập theo cấp (xáo trộn ngẫu nhiên), ở đây GIỮ ĐÚNG THỨ TỰ tiến trình
// từ Sơ cấp đến Nâng cao, vì mục tiêu của người học theo module là đi theo lộ trình.
export default function ModuleReviewTab({ auth }) {
  const [moduleName, setModuleName] = useState(null)
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)

  const availableModules = useMemo(() => {
    if (auth.accountMode === 'module' && auth.unlockedModuleNames.length > 0) {
      return MODULE_NAMES.filter(n => auth.unlockedModuleNames.includes(n))
    }
    return MODULE_NAMES
  }, [auth.accountMode, auth.unlockedModuleNames])

  useEffect(() => {
    if (!moduleName || !availableModules.includes(moduleName)) {
      setModuleName(availableModules[0] || null)
    }
  }, [availableModules]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('levels')
        .select('id, name, order_index, modules(id, name, concepts(*))')
      if (!error) {
        setLevels((data || []).slice().sort((a, b) => a.order_index - b.order_index))
      }
      setLoading(false)
    }
    load()
  }, [])

  const deck = useMemo(() => {
    const items = []
    levels.forEach(level => {
      const mod = (level.modules || []).find(m => m.name === moduleName)
      if (!mod) return
      ;(mod.concepts || []).forEach(c => {
        items.push({
          levelId: level.id,
          eyebrow: level.name,
          iconIdx: c.icon_index || 0,
          term: c.term,
          sub: c.sub,
          audioNote: c.audio_note,
        })
      })
    })
    return items
  }, [levels, moduleName])

  useEffect(() => { setIndex(0) }, [moduleName])

  if (loading) return <div className="loading">Đang tải…</div>

  const it = deck[index]

  return (
    <div className="panel">
      <div className="lesson-eyebrow" style={{ marginBottom: 8 }}>Ôn tập theo module · xuyên suốt cả 9 cấp</div>
      <div className="chip-row">
        {availableModules.map(name => (
          <div key={name} className={'chip' + (moduleName === name ? ' active' : '')} onClick={() => setModuleName(name)}>{name}</div>
        ))}
      </div>

      {deck.length === 0 ? (
        <div className="loading">Chưa có khái niệm nào cho module này.</div>
      ) : (
        <div className="card" style={{ padding: '22px 18px', textAlign: 'center', background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--line)' }}>
          <div dangerouslySetInnerHTML={{ __html: renderIcon(it.iconIdx, 40) }} style={{ marginBottom: 6 }} />
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
      )}
    </div>
  )
}
