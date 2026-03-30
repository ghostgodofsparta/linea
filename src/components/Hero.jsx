export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-left">
        <div className="hero-tag">New Season 2025</div>
        <h1 className="hero-headline">
          Wear the<br /><em>stillness</em><br />of the sea.
        </h1>
        <p className="hero-sub">
          LINEA is effortless dressing for the quietly confident. Garments shaped
          by Mediterranean light, made to last beyond the season.
        </p>
        <div className="hero-actions">
          <a href="#collections" className="btn-primary">Explore Collection</a>
          <a href="#about" className="btn-ghost">Our Story</a>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-image-placeholder">
          <div className="hero-shapes">
            <div className="shape-circle" />
            <div className="shape-circle" />
            <div className="shape-rect" />
          </div>
          <span className="hero-img-text">LINEA</span>
          <div className="hero-model-card">
            <div className="model-dot" />
            <div className="model-text">
              <strong>New Arrival</strong>
              Terra Linen Dress — €189
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
