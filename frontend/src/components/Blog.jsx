import { useState } from 'react'
import './Blog.css'
import './Publications.css'

function Blog({ posts = [], publications = [] }) {
  const [copiedId, setCopiedId] = useState(null)

  if ((!posts || posts.length === 0) && (!publications || publications.length === 0)) {
    return null
  }

  const formatDate = (date) => {
    return date ? date.split('T')[0] : ''
  }

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

  const allEntries = [
    ...(posts || []).map((post) => ({
      id: post.id,
      date: post.published_at,
      title: post.title,
      url: post.medium_url,
      venue: '(Medium)',
      isPublication: false,
    })),
    ...(publications || []).map((pub) => ({
      id: pub.id,
      date: pub.date,
      title: pub.title,
      url: pub.url,
      venue: `— ${pub.venue}`,
      isPublication: true,
      pubData: pub,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section className="section" id="writing">
      <span id="publications" style={{ display: 'block', scrollMarginTop: '8.5rem' }} />
      <h2 className="section-heading">
        <a href="#writing">Writing</a>
      </h2>

      <ul className="entry-list">
        {allEntries.map((item) => {
          const isCopied = copiedId === item.id

          return (
            <li key={item.id} className="entry-item">
              <div className="entry-meta">
                <time dateTime={item.date}>{formatDate(item.date)}</time>
              </div>
              <div className="entry-content">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                ) : (
                  <span>{item.title}</span>
                )}
                <span className="entry-venue"> {item.venue}</span>
                {item.isPublication && (
                  <>
                    {' '}
                    <span className="cite-wrap">
                      [{' '}
                      <button
                        className="cite-btn"
                        onClick={() => copyBibtex(item.pubData)}
                        title="Copy BibTeX citation"
                      >
                        {isCopied ? 'copied' : 'cite'}
                      </button>{' '}
                      ]
                    </span>
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Blog
