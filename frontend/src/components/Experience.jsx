import './Experience.css'

function Experience({ data }) {
  if (!data || data.length === 0) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <section className="experience" id="experience">
      <div className="container">
        <div className="experience-grid">
          {data.map((exp, index) => (
            <div key={exp.id} className="experience-card">
              <div className="experience-header">
                <div className="experience-title-section">
                  <h3 className="experience-position">{exp.position}</h3>
                  <span className="experience-company">{exp.company}</span>
                </div>
                <div className="experience-date">
                  {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                </div>
              </div>

              <div className="experience-content">
                <div
                  className="experience-description rich-text"
                  dangerouslySetInnerHTML={{ __html: exp.description_html || exp.description }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
