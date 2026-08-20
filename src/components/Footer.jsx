export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-title">Liên hệ Mr.Thành</div>
      <div className="footer-sub">Nhắn tin để nhận mã kích hoạt học theo cấp hoặc module</div>
      <div className="footer-links">
        <a
          className="footer-chip"
          href="https://zalo.me/0989099454"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" style={{ verticalAlign: '-3px', marginRight: 5 }} aria-hidden="true">
            <path
              d="M12 2C6.48 2 2 6.04 2 11c0 2.83 1.44 5.35 3.7 7.02L5 22l4.44-1.68C10.24 20.45 11.1 20.6 12 20.6c5.52 0 10-4.04 10-9.6S17.52 2 12 2z"
              fill="#0068ff"
            />
          </svg>
          Zalo: 0989.099.454
        </a>
        <a className="footer-chip" href="mailto:trungthanh0203@gmail.com">
          📧 Email: trungthanh0203@gmail.com
        </a>
      </div>
    </div>
  )
}
