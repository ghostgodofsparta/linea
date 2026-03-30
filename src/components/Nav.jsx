import { useEffect, useState } from 'react'

export default function Nav({ cartCount = 0, onCartClick, onLogoClick }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <a href="#hero" className="nav-logo" onClick={e => { e.preventDefault(); onLogoClick?.() }}>LINEA</a>
      <ul className="nav-links">
        <li><a href="#collections">Collections</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button className="nav-cta nav-bag-btn" onClick={onCartClick}>
        Bag{cartCount > 0 && <span className="nav-bag-count">{cartCount}</span>}
      </button>
    </nav>
  )
}
