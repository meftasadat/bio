import './Experience.css'

function Experience({ data }) {
  if (!data || data.length === 0) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const renderDescription = (description) => {
    // Split by lines and process each line
    const lines = description.split('\n').filter(line => line.trim());

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Handle bullet points (lines starting with specific patterns)
      if (trimmedLine.startsWith('2025') || trimmedLine.startsWith('2022') || trimmedLine.startsWith('Built') || trimmedLine.startsWith('Developed') || trimmedLine.startsWith('Implemented') || trimmedLine.startsWith('Received')) {
        return (
          <li key={index} className="experience-bullet">
            {trimmedLine}
          </li>
        );
      }

      // Handle section headers
      if (trimmedLine.includes(':')) {
        return (
          <div key={index} className="experience-section">
            {trimmedLine}
          </div>
        );
      }

      // Regular paragraphs
      return (
        <p key={index} className="experience-description">
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <section className="experience" id="experience">
      <div className="container">
        <h2 className="section-title">Work Experience</h2>
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
                <ul className="experience-description-list">
                  {renderDescription(exp.description)}
                </ul>

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="experience-tech-section">
                    <h4 className="tech-section-title">Technologies Used:</h4>
                    <div className="experience-tech">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
