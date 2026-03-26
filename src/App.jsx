import { useEffect, useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Collections from './components/Collections'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Toast from './components/Toast'
import ProductPage from './components/ProductPage'

export default function App() {
  const [toastMsg, setToastMsg] = useState('')

  // Global reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    const observe = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el))
    }
    observe()
    // Re-run on any DOM mutations (for dynamically rendered sections)
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { observer.disconnect(); mo.disconnect() }
  }, [])

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }, [])

  const HomePage = () => (
    <>
      <Hero />
      <Marquee />
      <Collections showToast={showToast} />
      <About />
      <Contact showToast={showToast} />
      <Footer />
      <a href="#collections" className="mobile-sticky-cta">Shop Collection</a>
    </>
  )

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductPage showToast={showToast} />} />
      </Routes>
      <Toast message={toastMsg} />
    </>
  )
}
