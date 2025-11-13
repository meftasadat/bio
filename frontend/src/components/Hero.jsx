import './Hero.css'

function Hero({ data }) {
  if (!data) return null

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Hi, I'm <span className="highlight">{data.name}</span>
        </h1>
        <h2 className="hero-subtitle">{data.title}</h2>
        <p className="hero-description">{data.summary}</p>
        <div className="hero-actions">
          <a href="#talks" className="btn btn-primary">Watch My Talks</a>
        </div>
      </div>
      <div className="hero-image">
        <div className="profile-placeholder">
          <span>MS</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
