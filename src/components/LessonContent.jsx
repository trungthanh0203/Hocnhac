import { renderMediaFullV4 as renderMediaFull } from '../lib/staffSvg.js'
import { playAudioAction } from '../lib/audio.js'

// Phần hiển thị NỘI DUNG của 1 bài học — dùng chung cho cả tab "Bài học" (theo cấp)
// và "Học theo module" (xuyên cấp), để sửa giao diện chỉ cần sửa đúng 1 chỗ này.
export default function LessonContent({ lesson, points, locked, eyebrow }) {
  if (!lesson) return null
  return (
    <>
      <div className="lesson-box">
        <div className="lesson-eyebrow">{eyebrow}</div>
        <div className="lesson-title">{lesson.title}</div>
        {lesson.goal && <div className="lesson-goal">🎯 Mục tiêu: {lesson.goal}</div>}

        {points.map((p, i) => (
          <div className="point" key={p.id}>
            <div className="num">{i + 1}</div>
            <div className="point-body">
              <h4>{p.heading}</h4>
              <p>{p.body}</p>
              {p.media && <div className="point-img" dangerouslySetInnerHTML={{ __html: renderMediaFull(p.media) }} />}
              {p.audio && (
                <span className="mini-play" onClick={() => playAudioAction(p.audio)}>
                  🔊 {p.audio.label}
                </span>
              )}
              {p.example_tag && <div className="example-tag">🎵 {p.example_tag}</div>}
            </div>
          </div>
        ))}
      </div>

      {locked && <div className="lock">Bài này cần nâng cấp tài khoản để mở khóa</div>}
    </>
  )
}
