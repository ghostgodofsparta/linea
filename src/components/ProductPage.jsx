import { useState, useRef, useCallback } from 'react'
import { urlFor } from '../sanity'

const SIZES = {
  women: ['XS', 'S', 'M', 'L', 'XL'],
  men: ['S', 'M', 'L', 'XL', 'XXL'],
  accessories: ['One Size'],
}

export default function ProductPage({ product, onBack, onCheckout, cart, setCart }) {
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [zoomed, setZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const imgRef = useRef(null)
  const sizes = SIZES[product.category] || ['One Size']

  const handleMouseMove = useCallback((e) => {
    if (!zoomed || !imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }, [zoomed])

  const handleAddToBag = () => {
    if (!selectedSize) {
      // shake the size picker
      const el = document.getElementById('size-picker')
      el?.classList.add('shake')
      setTimeout(() => el?.classList.remove('shake'), 600)
      return
    }
    const existing = cart.find(c => c._id === product._id && c.size === selectedSize)
    if (existing) {
      setCart(cart.map(c =>
        c._id === product._id && c.size === selectedSize
          ? { ...c, qty: c.qty + qty }
          : c
      ))
    } else {
      setCart([...cart, { ...product, size: selectedSize, qty }])
    }
    onCheckout()
  }

  const imageUrl = product.image
    ? urlFor(product.image).width(1200).url()
    : null

  return (
    <div className="product-page">
      {/* Back button */}
      <button className="product-page-back" onClick={onBack}>
        <span className="back-arrow">←</span>
        <span>Back to Collections</span>
      </button>

      <div className="product-page-grid">
        {/* Image Panel */}
        <div className="product-page-image-wrap">
          <div
            ref={imgRef}
            className={`product-page-image ${zoomed ? 'is-zoomed' : ''}`}
            onClick={() => setZoomed(z => !z)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { if (zoomed) setZoomPos({ x: 50, y: 50 }) }}
            style={zoomed && imageUrl ? {
              '--zoom-x': `${zoomPos.x}%`,
              '--zoom-y': `${zoomPos.y}%`,
            } : {}}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.title}
                className="product-page-img"
                draggable={false}
              />
            ) : (
              <div className="product-page-placeholder" style={{ background: product.accentColor || '#e8d5c8' }}>
                <span className="product-page-placeholder-letter">{product.title?.charAt(0)}</span>
              </div>
            )}
            <div className="zoom-hint">{zoomed ? 'Click to zoom out · Move to explore' : 'Click to zoom in'}</div>
            {product.badge && (
              <div className={`product-page-badge ${product.badge?.toLowerCase() === 'new' ? 'badge-new' : ''}`}>
                {product.badge}
              </div>
            )}
          </div>
        </div>

        {/* Details Panel */}
        <div className="product-page-details">
          <div className="product-page-breadcrumb">
            {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)} · {product.subcategory}
          </div>

          <h1 className="product-page-title">{product.title}</h1>
          <div className="product-page-price">€{product.price}</div>

          <p className="product-page-desc">
            Crafted from natural fibres in small runs with our artisan partners in Tuscany.
            Designed to carry you effortlessly from morning to evening, season after season.
          </p>

          {/* Size Picker */}
          <div className="product-page-section-label">Select Size</div>
          <div id="size-picker" className="size-grid">
            {sizes.map(size => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Quantity */}
          <div className="product-page-section-label" style={{ marginTop: '2rem' }}>Quantity</div>
          <div className="qty-control">
            <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span className="qty-value">{qty}</span>
            <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
          </div>

          {/* Add to Bag */}
          <button className="add-to-bag-btn" onClick={handleAddToBag}>
            Add to Bag · €{(product.price * qty).toFixed(0)}
          </button>

          {/* Details */}
          <div className="product-page-meta-list">
            {[
              ['Material', '100% Natural Linen'],
              ['Origin', 'Made in Italy'],
              ['Care', 'Hand wash cold, lay flat to dry'],
              ['Delivery', 'Free shipping over €120'],
            ].map(([k, v]) => (
              <div className="product-page-meta-row" key={k}>
                <span className="meta-key">{k}</span>
                <span className="meta-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
