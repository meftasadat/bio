import { useState } from 'react'
import './Experience.css'

function Experience({ data }) {
  const [expandedCards, setExpandedCards] = useState({})

  if (!data || data.length === 0) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const toggleCard = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Extract highlights from description (looking for metrics, numbers, percentages)
  const extractHighlights = (html) => {
    if (!html) return []

    const highlights = []
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    const text = tempDiv.textContent || tempDiv.innerText

    // Look for patterns like "X million", "X%", "X+ users", etc.
    const patterns = [
      /(\d+(?:\.\d+)?(?:M|K)?\+?\s*(?:million|thousand|billion)?)\s*(?:users|customers|requests|transactions)/gi,
      /(\d+(?:\.\d+)?%)\s*(?:increase|decrease|improvement|reduction|faster|more|less)/gi,
      /(?:reduced|increased|improved|scaled|built|led|managed)\s+[^.!?]*?(\d+(?:\.\d+)?(?:M|K|%)?)/gi
    ]

    patterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.slice(0, 2).forEach(match => {
          if (!highlights.includes(match.trim())) {
            highlights.push(match.trim())
          }
        })
      }
    })

    return highlights.slice(0, 3) // Max 3 highlights
  }

  // Get company logo or fallback to first letter
  const getCompanyIcon = (company) => {
    const logoMap = {
      'Loblaw Digital': 'loblaw-digital-logo.png',
      'Samsung R&D Institute Bangladesh': 'samsung-logo.png',
      'ZoneTV': 'zoneify-logo.png',
      'Toronto Metropolitan University': 'tmu-logo.jpg',
      'IBM-CAS': 'ibm-logo.png'
    }

    const companyUrlMap = {
      'Loblaw Digital': 'https://www.loblawdigital.co',
      'Samsung R&D Institute Bangladesh': 'https://research.samsung.com/srbd',
      'ZoneTV': 'https://zone.tv/',
      'Toronto Metropolitan University': 'https://www.torontomu.ca/data-science-lab/research/',
      'IBM-CAS': 'https://open-development.org/collab/cas/'
    }

    const logoFile = logoMap[company]
    const companyUrl = companyUrlMap[company]

    if (logoFile) {
      const imgTag = <img src={`http://localhost:8000/static/${logoFile}`} alt={company} className="company-logo" />
      return companyUrl ? <a href={companyUrl} target="_blank" rel="noopener noreferrer">{imgTag}</a> : imgTag
    }

    // Fallback to first letter
    return company.charAt(0).toUpperCase()
  }

  return (
    <section className="experience" id="experience">
      <div className="container">
        <div className="experience-timeline">
          <div className="timeline-line"></div>
          {data.map((exp, index) => {
            const isExpanded = expandedCards[exp.id]
            const highlights = extractHighlights(exp.description_html || exp.description)

            return (
              <div key={exp.id} className="experience-item">
                <div className="timeline-node">
                  <div className="timeline-icon">
                    {getCompanyIcon(exp.company)}
                  </div>
                </div>

                <div className={`experience-card ${isExpanded ? 'expanded' : ''}`}>
                  <div className="experience-header" onClick={() => toggleCard(exp.id)}>
                    <div className="experience-title-section">
                      <h3 className="experience-position">{exp.position}</h3>
                      <span className="experience-company">{exp.company}</span>
                    </div>
                    <div className="experience-meta">
                      <div className="experience-date">
                        {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                        {exp.location && <span className="experience-location"> • {exp.location}</span>}
                      </div>
                      <button className="expand-toggle" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                      </button>
                    </div>
                  </div>

                  {highlights.length > 0 && (
                    <div className="experience-highlights">
                      {highlights.map((highlight, idx) => (
                        <div key={idx} className="highlight-badge">
                          <i className="fas fa-star"></i>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={`experience-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    <div
                      className="experience-description rich-text"
                      dangerouslySetInnerHTML={{ __html: exp.description_html || exp.description }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Experience
