import './Talks.css'

function Talks({ data }) {
  if (!data || data.length === 0) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const toEmbedUrl = (url) => {
    if (!url) return null
    try {
      const yt = new URL(url)
      if (yt.hostname.includes('youtube.com')) {
        const videoId = yt.searchParams.get('v')
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null
      }
      if (yt.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed/${yt.pathname.slice(1)}`
      }
      return url
    } catch {
      return url
    }
  }

  return (
    <section className="talks" id="talks">
      <div className="container">
        <div className="talks-header">
          <h2 className="section-title">Talks & Videos</h2>
          <p className="section-subtitle">
            Conference sessions, community meetups, and guest lectures featuring my work in agentic AI and MLOps.
          </p>
        </div>

        <div className="talks-grid">
          {data.map((talk) => {
            const embedUrl = toEmbedUrl(talk.video_url)
            return (
              <article key={talk.id} className="talk-card">
                <div className="talk-meta">
                  <span className="talk-date">{formatDate(talk.date)}</span>
                  <span className="talk-event">{talk.event}</span>
                  {talk.location && <span className="talk-location">{talk.location}</span>}
                </div>
                <h3 className="talk-title">{talk.title}</h3>
                {talk.description_html && (
                  <div
                    className="talk-description"
                    dangerouslySetInnerHTML={{ __html: talk.description_html }}
                  />
                )}
                {embedUrl && (
                  <div className="talk-video">
                    <iframe
                      src={embedUrl}
                      title={talk.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                <div className="talk-links">
                  {talk.video_url && (
                    <a href={talk.video_url} target="_blank" rel="noopener noreferrer">
                      Watch on YouTube →
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Talks
