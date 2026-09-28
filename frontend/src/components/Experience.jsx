import { Link, useLocation } from 'react-router-dom'
import './Experience.css'

function Experience({ data }) {
  const location = useLocation()
  if (!data || data.length === 0) return null

  const formatDate = (date) => {
    if (!date) return 'Present'
    const dateStr = typeof date === 'string' && !date.includes('T') ? date + 'T12:00:00' : date
    const d = new Date(dateStr)
    return `${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`
  }

  const isStandalone = location.pathname === '/work' || location.pathname === '/experience'

  return (
    <section className="section" id="work">
      <span id="experience" style={{ display: 'block', scrollMarginTop: '8.5rem' }} />
      {isStandalone && (
        <div className="standalone-nav-header">
          <Link to="/" className="back-home-link">
            ← Back to Home
          </Link>
        </div>
      )}

      <h2 className="section-heading">
        <a href="#work">Work</a>
      </h2>

      <div className="experience-list">
        {data.map((item) => (
          <article key={item.id} className="exp-item">
            <h3 className="exp-heading">
              <span className="exp-position">{item.position}</span>
              <span className="exp-sep"> — </span>
              <span className="exp-company">{item.company}</span>
              <span className="exp-dates"> ({formatDate(item.start_date)} — {formatDate(item.end_date)})</span>
            </h3>

            <div
              className="exp-body"
              dangerouslySetInnerHTML={{ __html: item.description_html || item.description }}
            />
          </article>
        ))}
      </div>

      {isStandalone && (
        <div className="standalone-nav-footer">
          <Link to="/" className="back-home-link">
            ← Back to Home
          </Link>
        </div>
      )}
    </section>
  )
}

export default Experience
