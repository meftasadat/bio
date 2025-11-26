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
                <img
                  src="/static/bio-img.JPG"
                  alt={data.name}
                  className="profile-image"
                />
                <div className="avatar-glow"></div>
              </div>

              <div className="profile-info">
                <h3 className="profile-name">{data.name}</h3>
                <p className="profile-title">{data.title}</p>
                <div className="profile-summary">
                  <p>{data.summary}</p>
                </div>
              </div>

              <div className="profile-contact">
                <a href="https://www.linkedin.com/in/meftasadat/" target="_blank" rel="noopener noreferrer" className="contact-link" title="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://github.com/meftasadat" target="_blank" rel="noopener noreferrer" className="contact-link" title="GitHub">
                  <i className="fab fa-github"></i>
                </a>
                <a href="mailto:meftasadat@gmail.com" className="contact-link" title="Email">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <a href="/MS_RESUME.pdf" download className="resume-button">
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
