import './Publications.css'

function Publications({ data }) {
  if (!data || data.length === 0) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <section className="publications" id="publications">
      <div className="container">
        <div className="publications-header">
          <h2 className="section-title">Publications</h2>
          <p className="section-subtitle">
            Peer-reviewed research and technical reports on data quality, ML reliability, and developer tooling.
          </p>
        </div>

        <div className="publications-list">
          {data.map((pub) => (
            <article key={pub.id} className="publication-card">
              <div className="publication-header">
                <h3 className="publication-title">{pub.title}</h3>
                <div className="publication-meta">
                  <span>{pub.venue}</span>
                  <span>•</span>
                  <span>{formatDate(pub.date)}</span>
                </div>
              </div>
              {pub.authors && pub.authors.length > 0 && (
                <p className="publication-authors">{pub.authors.join(', ')}</p>
              )}
              {pub.summary_html && (
                <div
                  className="publication-summary"
                  dangerouslySetInnerHTML={{ __html: pub.summary_html }}
                />
              )}
              <div className="publication-links">
                {pub.url && (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer">
                    Read publication →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Publications
