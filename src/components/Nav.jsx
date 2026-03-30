import { useEffect, useState } from 'react'

export default function Nav({ cartCount = 0, onCartClick, onLogoClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  return (
    <nav id="nav" className={`${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <a href="#hero" className="nav-logo" onClick={e => { e.preventDefault(); onLogoClick?.(); closeMenu() }}>LINEA</a>
      
      <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        <span className="toggle-bar"></span>
        <span className="toggle-bar"></span>
      </button>

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li><a href="#collections" onClick={closeMenu}>Collections</a></li>
        <li><a href="#about" onClick={closeMenu}>About</a></li>
        <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
        <li className="mobile-only">
          <button className="nav-cta nav-bag-btn" onClick={() => { onCartClick(); closeMenu(); }}>
            Bag{cartCount > 0 && <span className="nav-bag-count">{cartCount}</span>}
          </button>
        </li>
      </ul>

      <button className="nav-cta nav-bag-btn desktop-only" onClick={onCartClick}>
        Bag{cartCount > 0 && <span className="nav-bag-count">{cartCount}</span>}
      </button>
    </nav>
  )
}
