import { useState } from 'react'
import { urlFor } from '../sanity'

function formatCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

export default function Checkout({ cart, setCart, onBack, showToast }) {
  const [step, setStep] = useState('bag') // 'bag' | 'payment' | 'confirm'
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', postcode: '', country: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  })
  const [errors, setErrors] = useState({})

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = total >= 120 ? 0 : 12

  const updateForm = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  const validatePayment = () => {
    const e = {}
    if (!form.email) e.email = 'Required'
    if (!form.firstName) e.firstName = 'Required'
    if (!form.lastName) e.lastName = 'Required'
    if (!form.address) e.address = 'Required'
    if (!form.city) e.city = 'Required'
    if (!form.postcode) e.postcode = 'Required'
    if (!form.cardName) e.cardName = 'Required'
    if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number'
    if (form.expiry.length < 5) e.expiry = 'Enter MM/YY'
    if (form.cvv.length < 3) e.cvv = 'Enter 3-digit CVV'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePlaceOrder = () => {
    if (!validatePayment()) return
    setStep('confirm')
    showToast('Order placed — thank you!')
  }

  if (step === 'confirm') {
    return (
      <div className="checkout-page">
        <div className="checkout-confirm">
          <div className="confirm-icon">✓</div>
          <h2 className="confirm-title">Order Confirmed</h2>
          <p className="confirm-sub">
            Thank you, {form.firstName}. Your order is on its way to {form.city}.
            A confirmation will be sent to <strong>{form.email}</strong>.
          </p>
          <div className="confirm-order-summary">
            {cart.map(item => (
              <div className="confirm-item" key={`${item._id}-${item.size}`}>
                <span>{item.title}</span>
                <span>· {item.size} · ×{item.qty}</span>
                <span>€{item.price * item.qty}</span>
              </div>
            ))}
            <div className="confirm-total">Total Paid: €{(total + shipping).toFixed(2)}</div>
          </div>
          <button className="checkout-primary-btn" onClick={() => { setCart([]); onBack() }}>
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <button className="product-page-back" onClick={onBack}>
        <span className="back-arrow">←</span>
        <span>Continue Shopping</span>
      </button>

      <h1 className="checkout-title">Your Bag</h1>

      <div className="checkout-grid">
        {/* Left: Steps */}
        <div className="checkout-left">
          {/* Step tabs */}
          <div className="checkout-steps">
            <button className={`checkout-step ${step === 'bag' ? 'active' : ''}`} onClick={() => setStep('bag')}>
              01 — Bag
            </button>
            <span className="step-sep">→</span>
            <button
              className={`checkout-step ${step === 'payment' ? 'active' : ''}`}
              onClick={() => cart.length > 0 && setStep('payment')}
            >
              02 — Payment
            </button>
          </div>

          {step === 'bag' && (
            <>
              {cart.length === 0 ? (
                <div className="empty-bag">
                  <p>Your bag is empty.</p>
                  <button className="checkout-primary-btn" onClick={onBack}>Shop Now</button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div className="cart-item" key={`${item._id}-${item.size}`}>
                        <div className="cart-item-img" style={{ background: item.accentColor || '#e8d5c8' }}>
                          {item.image
                            ? <img src={urlFor(item.image).width(200).url()} alt={item.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                            : <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', opacity: 0.3 }}>
                                {item.title?.charAt(0)}
                              </span>
                          }
                        </div>
                        <div className="cart-item-info">
                          <div className="cart-item-title">{item.title}</div>
                          <div className="cart-item-meta">Size: {item.size} · Qty: {item.qty}</div>
                          <div className="cart-item-price">€{item.price * item.qty}</div>
                        </div>
                        <button className="cart-item-remove"
                          onClick={() => setCart(cart.filter(c => !(c._id === item._id && c.size === item.size)))}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="checkout-primary-btn" style={{ marginTop: '2rem' }} onClick={() => setStep('payment')}>
                    Proceed to Payment →
                  </button>
                </>
              )}
            </>
          )}

          {step === 'payment' && (
            <div className="payment-form">
              <div className="form-section-title">Contact & Delivery</div>
              <div className="pf-group">
                <label className="pf-label">Email</label>
                <input className={`pf-input ${errors.email ? 'pf-error' : ''}`} type="email"
                  placeholder="sofia@example.com" value={form.email}
                  onChange={e => updateForm('email', e.target.value)} />
                {errors.email && <span className="pf-err-msg">{errors.email}</span>}
              </div>
              <div className="pf-row">
                <div className="pf-group">
                  <label className="pf-label">First Name</label>
                  <input className={`pf-input ${errors.firstName ? 'pf-error' : ''}`}
                    placeholder="Sofia" value={form.firstName}
                    onChange={e => updateForm('firstName', e.target.value)} />
                  {errors.firstName && <span className="pf-err-msg">{errors.firstName}</span>}
                </div>
                <div className="pf-group">
                  <label className="pf-label">Last Name</label>
                  <input className={`pf-input ${errors.lastName ? 'pf-error' : ''}`}
                    placeholder="Moretti" value={form.lastName}
                    onChange={e => updateForm('lastName', e.target.value)} />
                  {errors.lastName && <span className="pf-err-msg">{errors.lastName}</span>}
                </div>
              </div>
              <div className="pf-group">
                <label className="pf-label">Address</label>
                <input className={`pf-input ${errors.address ? 'pf-error' : ''}`}
                  placeholder="Via della Moda 12" value={form.address}
                  onChange={e => updateForm('address', e.target.value)} />
                {errors.address && <span className="pf-err-msg">{errors.address}</span>}
              </div>
              <div className="pf-row">
                <div className="pf-group">
                  <label className="pf-label">City</label>
                  <input className={`pf-input ${errors.city ? 'pf-error' : ''}`}
                    placeholder="Milan" value={form.city}
                    onChange={e => updateForm('city', e.target.value)} />
                  {errors.city && <span className="pf-err-msg">{errors.city}</span>}
                </div>
                <div className="pf-group">
                  <label className="pf-label">Postcode</label>
                  <input className={`pf-input ${errors.postcode ? 'pf-error' : ''}`}
                    placeholder="20121" value={form.postcode}
                    onChange={e => updateForm('postcode', e.target.value)} />
                  {errors.postcode && <span className="pf-err-msg">{errors.postcode}</span>}
                </div>
              </div>

              {/* Card Payment */}
              <div className="form-section-title" style={{ marginTop: '2.5rem' }}>
                <span>Card Payment</span>
                <span className="visa-badge">VISA</span>
              </div>

              <div className="card-visual">
                <div className="card-chip" />
                <div className="card-number-display">
                  {(form.cardNumber || '•••• •••• •••• ••••').padEnd(19, '•')}
                </div>
                <div className="card-bottom">
                  <div>
                    <div className="card-label">Card Holder</div>
                    <div className="card-value">{form.cardName || 'YOUR NAME'}</div>
                  </div>
                  <div>
                    <div className="card-label">Expires</div>
                    <div className="card-value">{form.expiry || 'MM/YY'}</div>
                  </div>
                  <div className="card-visa-logo">VISA</div>
                </div>
              </div>

              <div className="pf-group">
                <label className="pf-label">Name on Card</label>
                <input className={`pf-input ${errors.cardName ? 'pf-error' : ''}`}
                  placeholder="Sofia Moretti" value={form.cardName}
                  onChange={e => updateForm('cardName', e.target.value.toUpperCase())} />
                {errors.cardName && <span className="pf-err-msg">{errors.cardName}</span>}
              </div>
              <div className="pf-group">
                <label className="pf-label">Card Number</label>
                <input className={`pf-input card-number-input ${errors.cardNumber ? 'pf-error' : ''}`}
                  placeholder="0000 0000 0000 0000" value={form.cardNumber}
                  onChange={e => updateForm('cardNumber', formatCard(e.target.value))} />
                {errors.cardNumber && <span className="pf-err-msg">{errors.cardNumber}</span>}
              </div>
              <div className="pf-row">
                <div className="pf-group">
                  <label className="pf-label">Expiry Date</label>
                  <input className={`pf-input ${errors.expiry ? 'pf-error' : ''}`}
                    placeholder="MM/YY" value={form.expiry} maxLength={5}
                    onChange={e => updateForm('expiry', formatExpiry(e.target.value))} />
                  {errors.expiry && <span className="pf-err-msg">{errors.expiry}</span>}
                </div>
                <div className="pf-group">
                  <label className="pf-label">CVV</label>
                  <input className={`pf-input ${errors.cvv ? 'pf-error' : ''}`}
                    placeholder="•••" maxLength={3} value={form.cvv}
                    onChange={e => updateForm('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))} />
                  {errors.cvv && <span className="pf-err-msg">{errors.cvv}</span>}
                </div>
              </div>

              <button className="checkout-primary-btn place-order-btn" onClick={handlePlaceOrder}>
                Place Order · €{(total + shipping).toFixed(2)}
              </button>
              <p className="secure-note">🔒 Secured with 256-bit SSL encryption</p>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="checkout-summary">
          <div className="summary-title">Order Summary</div>
          {cart.map(item => (
            <div className="summary-row" key={`${item._id}-${item.size}`}>
              <span className="summary-item-name">{item.title} <span className="summary-item-meta">×{item.qty}</span></span>
              <span>€{item.price * item.qty}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Subtotal</span><span>€{total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span style={{ color: 'var(--terra)' }}>Free</span> : `€${shipping}`}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span><span>€{(total + shipping).toFixed(2)}</span>
          </div>
          {shipping > 0 && (
            <p className="summary-free-note">Add €{(120 - total).toFixed(0)} more for free shipping</p>
          )}
        </div>
      </div>
    </div>
  )
}
