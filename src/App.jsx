import { useEffect, useState, useCallback } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Collections from './components/Collections'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Toast from './components/Toast'
import ProductPage from './components/ProductPage'
import Checkout from './components/Checkout'

export default function App() {
  const [toastMsg, setToastMsg] = useState('')
  const [page, setPage] = useState('home') // 'home' | 'product' | 'checkout'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])

  useEffect(() => {
    if (page !== 'home') return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    const observe = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el))
    }
    observe()
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { observer.disconnect(); mo.disconnect() }
  }, [page])

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [page])

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }, [])

  const openProduct = useCallback((product) => {
    setSelectedProduct(product)
    setPage('product')
  }, [])

  const goHome = useCallback(() => {
    setPage('home')
    setSelectedProduct(null)
  }, [])

  const goCheckout = useCallback(() => {
    setPage('checkout')
  }, [])

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  if (page === 'product' && selectedProduct) {
    return (
      <>
        <Nav cartCount={cartCount} onCartClick={goCheckout} onLogoClick={goHome} />
        <ProductPage
          product={selectedProduct}
          onBack={goHome}
          onCheckout={goCheckout}
          cart={cart}
          setCart={setCart}
        />
        <Footer />
        <Toast message={toastMsg} />
      </>
    )
  }

  if (page === 'checkout') {
    return (
      <>
        <Nav cartCount={cartCount} onCartClick={goCheckout} onLogoClick={goHome} />
        <Checkout
          cart={cart}
          setCart={setCart}
          onBack={goHome}
          showToast={showToast}
        />
        <Footer />
        <Toast message={toastMsg} />
      </>
    )
  }

  return (
    <>
      <Nav cartCount={cartCount} onCartClick={goCheckout} onLogoClick={goHome} />
      <Hero />
      <Marquee />
      <Collections showToast={showToast} onProductClick={openProduct} />
      <About />
      <Contact showToast={showToast} />
      <Footer />
      <Toast message={toastMsg} />
    </>
  )
}
