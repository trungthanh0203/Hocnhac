export default function Banner({ accountLabel }) {
  return (
    <div className="banner">
      <h1>Học nhạc cùng Mr.Thành</h1>
      <p>Nhạc lý cơ bản đến nâng cao dành cho học sinh, theo 9 cấp</p>
      <div className="banner-row">
        <span className="badge">{accountLabel}</span>
      </div>
    </div>
  )
}
