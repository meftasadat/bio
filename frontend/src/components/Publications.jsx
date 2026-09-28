import { useState } from 'react'
import './Publications.css'

function Publications({ data = [], articles = [] }) {
  const [copiedId, setCopiedId] = useState(null)

  if ((!data || data.length === 0) && (!articles || articles.length === 0)) return null

  const sortedPublications = [...(data || [])].sort((a, b) => new Date(b.date) - new Date(a.date))
  const sortedArticles = [...(articles || [])].sort(
    (a, b) => new Date(b.published_at || b.date) - new Date(a.published_at || a.date)
  )

  const getBibtex = (pub) => {
    const key = pub.id || 'sadat'
    const authors = (pub.authors || []).join(' and ')
    const year = pub.date ? pub.date.split('-')[0] : '2017'
    return `@article{${key},
  title={${pub.title}},
  author={${authors}},
  journal={${pub.venue}},
  year={${year}}${pub.url ? `,\n  url={${pub.url}}` : ''}
}`
  }

  const copyBibtex = (pub) => {
    const bib = getBibtex(pub)
    navigator.clipboard.writeText(bib).then(() => {
      setCopiedId(pub.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  return (
    <section className="section" id="publications">
      <span id="writing" style={{ display: 'block', scrollMarginTop: '8.5rem' }} />
      <h2 className="section-heading">
        <a href="#publications">Publications</a>
      </h2>

      <ul className="entry-list">
        {sortedPublications.map((pub) => {
          const isCopied = copiedId === pub.id
          const year = pub.date ? pub.date.split('-')[0] : ''

          return (
            <li key={pub.id} className="entry-item">
              <div className="entry-meta">
                <time>{year}</time>
              </div>
              <div className="entry-content">
                {pub.url ? (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pub.title}
                  </a>
                ) : (
                  <span>{pub.title}</span>
                )}
                <span className="entry-venue"> — {pub.venue}</span>
                {' '}
                <span className="cite-wrap">
                  [{' '}
                  <button
                    className="cite-btn"
                    onClick={() => copyBibtex(pub)}
                    title="Copy BibTeX citation"
                  >
                    {isCopied ? 'copied' : 'cite'}
                  </button>{' '}
                  ]
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      {articles && articles.length > 0 && (
        <div className="publications-subgroup" style={{ marginTop: '1.5rem' }}>
          <h3
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'hsl(var(--theme-headings))',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Engineering Articles & Case Studies
          </h3>
          <ul className="entry-list">
            {sortedArticles.map((article) => {
              const year = article.published_at ? article.published_at.split('-')[0] : ''
              return (
                <li key={article.id} className="entry-item">
                  <div className="entry-meta">
                    <time>{year}</time>
                  </div>
                  <div className="entry-content">
                    <a
                      href={article.medium_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.title}
                    </a>
                    <span className="entry-venue"> (Medium)</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}

export default Publications
