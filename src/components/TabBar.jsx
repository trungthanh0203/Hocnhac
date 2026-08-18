const TABS = [
  { key: 'lesson', label: 'Bài học' },
  { key: 'review', label: 'Ôn tập' },
  { key: 'ear', label: 'Luyện âm' },
  { key: 'test', label: 'Bài test' },
  { key: 'practice', label: 'Thực hành' },
]

export default function TabBar({ active, onChange }) {
  return (
    <div className="tabs">
      {TABS.map(t => (
        <div
          key={t.key}
          className={'tab' + (active === t.key ? ' active' : '')}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </div>
      ))}
    </div>
  )
}
