export default function Footer() {
  return (
    <footer>
      <span className="footer-logo">LINEA</span>
      <ul className="footer-links">
        {['Instagram','Pinterest','Shipping','Returns','Privacy'].map(link => (
          <li key={link}><a href="#">{link}</a></li>
        ))}
      </ul>
      <span className="footer-copy">© 2025 LINEA. All rights reserved.</span>
    </footer>
  )
}
