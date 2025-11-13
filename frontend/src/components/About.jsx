import './About.css'

function About({ data }) {
  if (!data) return null

  const renderAboutText = (text) => {
    // Split into paragraphs and add some formatting
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="about-paragraph">
        {paragraph.trim()}
      </p>
    ));
  };

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-header">
          <h2 className="section-title">About Me</h2>
          <div className="title-accent"></div>
        </div>

        <div className="about-content">
          <div className="about-main">
            <div className="about-intro">
              <h3 className="intro-title">Hello, I'm {data.name.split(' ')[0]}</h3>
              <p className="intro-subtitle">{data.title}</p>
            </div>

            <div className="about-text">
              {renderAboutText(data.about)}
            </div>


          </div>

          <div className="about-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                <span className="avatar-text">
                  {data.name.split(' ').map(n => n[0]).join('')}
                </span>
                <div className="avatar-glow"></div>
              </div>

              <div className="profile-info">
                <h3 className="profile-name">{data.name}</h3>
                <p className="profile-title">{data.title}</p>
                <div className="profile-summary">
                  <p>{data.summary}</p>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">7+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Projects Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
