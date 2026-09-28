import { useState } from 'react'
import './Publications.css'

function Publications({ data }) {
  const [copiedId, setCopiedId] = useState(null)

  if (!data || data.length === 0) return null

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
      <h2 className="section-heading">
        <a href="#publications">Research & Publications</a>
      </h2>

      <ul className="entry-list">
        {data.map((pub) => {
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
    </section>
  )
}

export default Publications
