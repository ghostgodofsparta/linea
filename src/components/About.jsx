export default function About() {
  return (
    <section id="about">
      <div>
        <div className="section-tag reveal">Our Story</div>
        <h2 className="section-heading reveal reveal-delay-1">
          Rooted in craft,<br />dressed for life.
        </h2>
        <p className="about-body reveal reveal-delay-2">
          LINEA was born from a simple belief — that the best clothes feel like a second skin.
          Inspired by the unhurried rhythm of the Italian coast, each piece is designed to carry
          you effortlessly from morning coffee to golden hour, season after season.
        </p>
        <p className="about-body reveal reveal-delay-2" style={{ marginTop: '-1.5rem' }}>
          We work with small family-run mills in Tuscany and Sardinia, choosing natural fibres
          that age with grace. Every garment is made in limited runs — never mass-produced, always intentional.
        </p>
        <div className="about-stats reveal reveal-delay-3">
          {[['2018','Founded'],['100%','Natural Fibres'],['12','Artisan Partners'],['40+','Countries Delivered']].map(([num, label]) => (
            <div className="stat-item" key={label}>
              <div className="stat-num">{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
        <a href="#contact" className="btn-light reveal reveal-delay-4">Get in Touch</a>
      </div>

      <div className="about-visual reveal reveal-delay-2">
        <div className="about-card-big">
          <div className="about-deco"><span className="about-deco-text">L</span></div>
          <span className="about-year">Est. 2018 — Italy</span>
        </div>
        <div className="about-card-small">
          <div className="about-deco">
            <span className="about-deco-text" style={{ fontSize: '4rem' }}>craft</span>
          </div>
        </div>
      </div>
    </section>
  )
}
