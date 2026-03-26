import { useState } from 'react'

export default function Contact({ showToast }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = () => {
    if (!form.email) { showToast('Please enter your email'); return }
    showToast('Message sent — we\'ll be in touch soon!')
    setForm({ firstName: '', lastName: '', email: '', message: '' })
  }

  return (
    <section id="contact">
      <div className="section-tag reveal">Contact</div>
      <h2 className="section-heading reveal reveal-delay-1">Let's talk style.</h2>

      <div className="contact-grid">
        <div>
          <p className="contact-intro reveal reveal-delay-2">
            Whether you have a styling question, a wholesale enquiry, or simply want to say hello —
            we'd love to hear from you. Our team responds within one business day.
          </p>
          {[
            ['Email', 'hello@linea.com'],
            ['Phone', '+39 02 1234 5678'],
            ['Studio', 'Via della Moda 12, Milan, Italy'],
            ['Hours', 'Mon–Fri, 9am–6pm CET'],
          ].map(([label, value]) => (
            <div className="contact-detail reveal reveal-delay-2" key={label}>
              <span className="contact-detail-label">{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <div className="contact-form reveal reveal-delay-2">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" type="text" name="firstName" placeholder="Sofia"
                value={form.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" type="text" name="lastName" placeholder="Moretti"
                value={form.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" placeholder="sofia@example.com"
              value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-input form-textarea" name="message"
              placeholder="Tell us what you have in mind..."
              value={form.message} onChange={handleChange} />
          </div>
          <button className="submit-btn" onClick={handleSubmit}>Send Message</button>
        </div>
      </div>
    </section>
  )
}
