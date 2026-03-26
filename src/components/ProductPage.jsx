import { useEffect, useState } from 'react'
import { PortableText } from '@portabletext/react'
import { Link, useParams } from 'react-router-dom'
import { getProductById, getSimilarProducts, urlFor } from '../sanity'

function SimilarCard({ item, showToast }) {
  const previewImage = item.image || item.images?.[0]

  return (
    <article className="similar-card">
      <Link to={`/product/${item._id}`} className="similar-image-link" aria-label={`View ${item.title}`}>
        <div className="similar-image" style={{ background: item.accentColor || '#e8d5c8' }}>
          {previewImage && (
            <img src={urlFor(previewImage).width(560).url()} alt={item.title} />
          )}
          {!previewImage && <span className="similar-placeholder">{item.title?.charAt(0)}</span>}
        </div>
      </Link>
      <div className="similar-meta">
        <p className="similar-title">{item.title}</p>
        <p className="similar-sub">
          {(item.category || '').charAt(0).toUpperCase() + (item.category || '').slice(1)} · {item.subcategory || 'Essentials'}
        </p>
        <div className="similar-bottom">
          <span className="similar-price">EUR {item.price}</span>
          <button className="action-btn primary" onClick={() => showToast(`"${item.title}" added to bag`)}>
            Add to Bag
          </button>
        </div>
      </div>
    </article>
  )
}

export default function ProductPage({ showToast }) {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [similar, setSimilar] = useState([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadProduct() {
      try {
        setLoading(true)
        setError('')
        const p = await getProductById(productId)
        if (!mounted) return
        if (!p) {
          setError('Product not found.')
          setLoading(false)
          return
        }
        setProduct(p)
        setSelectedImageIndex(0)
        setSelectedSize(p.sizes?.[0] || '')
        const recommended = await getSimilarProducts({
          productId: p._id,
          sex: p.sex,
          subcategory: p.subcategory,
          category: p.category,
        })
        if (!mounted) return
        setSimilar(recommended || [])
      } catch {
        if (!mounted) return
        setError('Could not load this product right now.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProduct()
    return () => { mounted = false }
  }, [productId])

  if (loading) {
    return (
      <main className="product-page">
        <section className="product-main">
          <p className="product-state">Loading product...</p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="product-page">
        <section className="product-main">
          <p className="product-state">{error}</p>
          <Link to="/" className="btn-primary">Back to Collection</Link>
        </section>
      </main>
    )
  }

  const galleryImages = [product.image, ...(product.images || [])].filter(Boolean)
  const activeImage = galleryImages[selectedImageIndex] || galleryImages[0]
  const showSizePicker = Array.isArray(product.sizes) && product.sizes.length > 0

  return (
    <main className="product-page">
      <section className="product-main">
        <div className="product-gallery">
          <div className="product-detail-image" style={{ background: product.accentColor || '#e8d5c8' }}>
            {activeImage && (
              <img src={urlFor(activeImage).width(1200).url()} alt={product.title} />
            )}
            {!activeImage && <span className="similar-placeholder">{product.title?.charAt(0)}</span>}
            {product.badge && <span className="product-tag-overlay product-detail-badge">{product.badge}</span>}
          </div>
          {galleryImages.length > 1 && (
            <div className="product-thumbs">
              {galleryImages.map((img, i) => (
                <button
                  key={`${product._id}-img-${i}`}
                  className={`product-thumb ${selectedImageIndex === i ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(i)}
                  aria-label={`Select product image ${i + 1}`}
                >
                  <img src={urlFor(img).width(220).url()} alt={`${product.title} preview ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-detail-copy">
          <Link to="/" className="product-back">Back to Collection</Link>
          <h1>{product.title}</h1>
          <p className="product-detail-sub">
            {(product.category || '').charAt(0).toUpperCase() + (product.category || '').slice(1)} · {product.subcategory || 'Essentials'}
            {product.sex ? ` · ${product.sex}` : ''}
          </p>
          <p className="product-detail-price">EUR {product.price}</p>
          {showSizePicker && (
            <div className="size-picker">
              <p className="size-label">Size</p>
              <div className="size-options">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(product.description) && product.description.length > 0 ? (
            <div className="product-detail-description portable-text">
              <PortableText value={product.description} />
            </div>
          ) : (
            <p className="product-detail-description">
              Tailored for everyday elegance with Mediterranean ease.
              Lightweight structure, clean lines, and premium fabric feel.
            </p>
          )}
          <div className="product-detail-actions">
            <button
              className="btn-primary"
              onClick={() => showToast(`"${product.title}"${selectedSize ? ` (${selectedSize})` : ''} added to bag`)}
            >
              Add to Bag
            </button>
            <button className="btn-ghost" onClick={() => showToast(`"${product.title}" wishlisted`)}>
              Add to Wishlist
            </button>
          </div>
        </div>
      </section>

      <section className="similar-section">
        <div className="section-tag">You may also like</div>
        <h2 className="section-heading">Similar garments</h2>
        {!similar.length && (
          <p className="product-state">
            Add more products with the same sex/category in Sanity to see recommendations.
          </p>
        )}
        {similar.length > 0 && (
          <div className="similar-grid">
            {similar.map(item => (
              <SimilarCard key={item._id} item={item} showToast={showToast} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
