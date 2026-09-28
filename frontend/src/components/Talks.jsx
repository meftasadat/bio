import './Talks.css'

function Talks({ data }) {
  if (!data || data.length === 0) return null

  const formatDate = (date) => {
    return date ? date.split('T')[0] : ''
  }

  const sortedTalks = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section className="section" id="talks">
      <h2 className="section-heading">
        <a href="#talks">Appearances & Talks</a>
      </h2>

      <ul className="entry-list">
        {sortedTalks.map((talk) => (
          <li key={talk.id} className="entry-item">
            <div className="entry-meta">
              <time dateTime={talk.date}>{formatDate(talk.date)}</time>
            </div>
            <div className="entry-content">
              <a
                href={talk.video_url || talk.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {talk.title}
              </a>
              <span className="entry-venue"> ({talk.event})</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Talks
