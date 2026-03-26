import { useState, useEffect, useRef } from 'react'
import { getProducts, urlFor } from '../sanity'

// Fallback static products shown while Sanity loads or if not configured
const FALLBACK_PRODUCTS = [
  { _id: '1', title: 'Terra Linen Dress', category: 'women', price: 189, subcategory: 'Dresses', badge: 'New', accentColor: '#e8d5c8' },
  { _id: '2', title: 'Cobalt Linen Shirt', category: 'men', price: 135, subcategory: 'Tops', accentColor: '#d4e1f0' },
  { _id: '3', title: 'Cream Wide Trouser', category: 'women', price: 159, subcategory: 'Bottoms', badge: 'Popular', accentColor: '#f0ece3' },
  { _id: '4', title: 'Terra Woven Tote', category: 'accessories', price: 210, subcategory: 'Bags', badge: 'New', accentColor: '#c9b8a8' },
  { _id: '5', title: 'Dark Olive Jacket', category: 'men', price: 298, subcategory: 'Outerwear', accentColor: '#2a3a2e' },
  { _id: '6', title: 'Blush Slip Midi', category: 'women', price: 172, subcategory: 'Dresses', accentColor: '#e2d0d8' },
  { _id: '7', title: 'Cobalt Leather Belt', category: 'accessories', price: 89, subcategory: 'Belts', accentColor: '#1a3a5c' },
  { _id: '8', title: 'Sand Chino Trouser', category: 'men', price: 148, subcategory: 'Bottoms', badge: 'Bestseller', accentColor: '#e8e0d2' },
]

const delayClasses = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4']

function ProductCard({ product, index, showToast }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('visible') },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const badgeNew = product.badge?.toLowerCase() === 'new'

  return (
    <div ref={ref} className={`product-card reveal ${delayClasses[index % 4]}`}>
      <div className="product-image">
        <div className="product-bg" style={{ background: product.accentColor || '#e8d5c8' }}>
          {product.image
            ? <img
                src={urlFor(product.image).width(600).url()}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
            : <>
                <div className="product-shape" style={{ width: 160, height: 160, background: 'rgba(255,255,255,0.1)', top: '10%', left: '10%' }} />
                <span className="product-name-art" style={{ color: 'rgba(255,255,255,0.15)' }}>
                  {product.title?.charAt(0)}
                </span>
              </>
          }
          {product.badge && (
            <div className={`product-tag-overlay${badgeNew ? ' product-tag-new' : ''}`}>
              {product.badge}
            </div>
          )}
        </div>
        <div className="product-actions">
          <button className="action-btn primary" onClick={() => showToast(`"${product.title}" added to bag`)}>
            Add to Bag
          </button>
          <button className="action-btn secondary">Wishlist</button>
        </div>
      </div>
      <div className="product-info">
        <p className="product-title">{product.title}</p>
        <div className="product-meta">
          <span className="product-cat">
            {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)} · {product.subcategory}
          </span>
          <span className="product-price">€{product.price}</span>
        </div>
      </div>
    </div>
  )
}

export default function Collections({ showToast }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)

  useEffect(() => {
    getProducts()
      .then(data => { if (data?.length) setProducts(data) })
      .catch(() => {}) // silently keep fallback data
  }, [])

  const filtered = products.filter(p => activeFilter === 'all' || p.category === activeFilter)

  return (
    <section id="collections">
      <div className="section-tag reveal">Collections</div>
      <h2 className="section-heading reveal reveal-delay-1">This season's<br />essentials.</h2>

      <div className="filter-tabs reveal reveal-delay-2">
        {['all', 'women', 'men', 'accessories'].map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filtered.map((p, i) => (
          <ProductCard key={p._id} product={p} index={i} showToast={showToast} />
        ))}
      </div>
    </section>
  )
}
