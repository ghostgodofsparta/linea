import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getNewArrivals, urlFor } from '../sanity'

const FALLBACK = [
  { _id: '1', title: 'Terra Linen Dress', category: 'women', sex: 'women', price: 189, subcategory: 'Dresses', badge: 'New', accentColor: '#e8d5c8' },
  { _id: '4', title: 'Terra Woven Tote', category: 'accessories', sex: 'unisex', price: 210, subcategory: 'Bags', badge: 'New', accentColor: '#c9b8a8' },
  { _id: '6', title: 'Blush Slip Midi', category: 'women', sex: 'women', price: 172, subcategory: 'Dresses', badge: 'New', accentColor: '#e2d0d8' },
]

function formatCat(category) {
  return (category || '').charAt(0).toUpperCase() + (category || '').slice(1)
}

export default function NewArrivals({ showToast }) {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    setReducedMotion(Boolean(media?.matches))
  }, [])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await getNewArrivals()
        if (!mounted) return
        setItems(data?.length ? data : FALLBACK)
        setActive(0)
      } catch {
        if (!mounted) return
        setItems(FALLBACK)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (items.length <= 1) return
    if (reducedMotion || paused) return

    const t = setInterval(() => {
      setActive(a => (a + 1) % items.length)
    }, 5200)

    return () => clearInterval(t)
  }, [items.length, reducedMotion, paused])

  const slideTransform = useMemo(() => `translateX(${-active * 100}%)`, [active])

  const prev = () => setActive(a => (a - 1 + items.length) % items.length)
  const next = () => setActive(a => (a + 1) % items.length)

  if (!items.length) return null

  return (
    <section id="new-arrivals" className="new-arrivals">
      <div className="section-tag reveal">New Arrivals</div>
      <h2 className="section-heading reveal reveal-delay-1">Fresh picks.</h2>

      <div
        className="new-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="new-carousel-viewport">
          <div className="new-carousel-track" style={{ transform: slideTransform }}>
            {items.map((item) => (
              <div key={item._id} className="new-carousel-slide">
                <div className="new-slide-card" style={{ background: item.accentColor || '#e8d5c8' }}>
                  <Link
                    to={`/product/${item._id}`}
                    className="new-slide-image-link"
                    onClick={() => setPaused(true)}
                    aria-label={`View ${item.title}`}
                  >
                    {item.image || item.images?.[0] ? (
                      <img
                        src={urlFor(item.image || item.images[0]).width(900).url()}
                        alt={item.title}
                      />
                    ) : (
                      <div className="new-slide-placeholder">{item.title?.charAt(0)}</div>
                    )}
                    {item.badge && <div className="new-slide-badge">{item.badge}</div>}
                  </Link>

                  <div className="new-slide-copy">
                    <p className="new-slide-sub">
                      {formatCat(item.category)} · {item.subcategory || 'Essentials'}
                    </p>
                    <h3 className="new-slide-title">{item.title}</h3>
                    <div className="new-slide-bottom">
                      <span className="new-slide-price">EUR {item.price}</span>
                      <button
                        className="action-btn primary"
                        onClick={() => showToast(`"${item.title}" added to bag`)}
                      >
                        Add to Bag
                      </button>
                    </div>
                    <button className="btn-ghost new-slide-view" onClick={() => navigate(`/product/${item._id}`)}>
                      View details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {items.length > 1 && (
          <>
            <button className="new-carousel-btn prev" onClick={prev} aria-label="Previous">
              ‹
            </button>
            <button className="new-carousel-btn next" onClick={next} aria-label="Next">
              ›
            </button>

            <div className="new-carousel-dots" aria-label="Slide selector">
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`new-carousel-dot ${i === active ? 'active' : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

