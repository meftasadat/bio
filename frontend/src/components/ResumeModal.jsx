import { useState, useRef, useEffect } from 'react'
import { API_BASE_URL } from '../lib/api.js'
import './ResumeModal.css'

const Icons = {
  user: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  ),
  briefcase: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
  ),
  education: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
  ),
  talks: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
  ),
  publications: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
  ),
  blogs: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
  ),
  pdf: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  ),
  close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  ),
  spinner: () => (
    <svg className="svg-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
  ),
  sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
  ),
  download: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  ),
  envelope: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
  ),
  linkedin: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
  ),
  github: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
  ),
  info: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
  )
}

const SECTIONS = [
  { key: 'summary', label: 'Summary', icon: 'user' },
  { key: 'experience', label: 'Experience', icon: 'briefcase' },
  { key: 'education', label: 'Education', icon: 'education' },
  { key: 'talks', label: 'Talks', icon: 'talks' },
  { key: 'publications', label: 'Publications', icon: 'publications' },
  { key: 'blogs', label: 'Blog Posts', icon: 'blogs' },
]

function ResumeModal({ isOpen, onClose, data }) {
  const [selectedSections, setSelectedSections] = useState(() =>
    Object.fromEntries(SECTIONS.map(s => [s.key, true]))
  )
  const [expandedJobs, setExpandedJobs] = useState(() => {
    if (!data?.experience) return {}
    return Object.fromEntries(data.experience.map(exp => [exp.id, true]))
  })
  const [generating, setGenerating] = useState(false)
  const printRef = useRef(null)

  // Reset job toggles when data changes
  useEffect(() => {
    if (data?.experience) {
      setExpandedJobs(Object.fromEntries(data.experience.map(exp => [exp.id, true])))
    }
  }, [data])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen || !data) return null

  const toggleSection = (key) => {
    setSelectedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleJob = (jobId) => {
    setExpandedJobs(prev => ({ ...prev, [jobId]: !prev[jobId] }))
  }

  const selectedCount = Object.values(selectedSections).filter(Boolean).length

  const formatDate = (date) => {
    const dateStr = typeof date === 'string' && !date.includes('T') ? date + 'T12:00:00' : date
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const experienceIds = selectedSections.experience
        ? Object.entries(expandedJobs).filter(([, v]) => v).map(([k]) => k)
        : []

      const response = await fetch(`${API_BASE_URL}/resume/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: selectedSections,
          experience_ids: experienceIds,
        }),
      })

      if (!response.ok) {
        // Fallback to static resume PDF
        const fallbackA = document.createElement('a')
        fallbackA.href = '/static/resume.pdf'
        fallbackA.download = 'Mefta_Sadat_Resume.pdf'
        fallbackA.click()
        return
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Mefta_Sadat_Resume.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.warn('LaTeX generation fallback:', err)
      const fallbackA = document.createElement('a')
      fallbackA.href = '/static/resume.pdf'
      fallbackA.download = 'Mefta_Sadat_Resume.pdf'
      fallbackA.click()
    } finally {
      setGenerating(false)
    }
  }

  // Strip HTML tags for plain text
  const stripHtml = (html) => {
    if (!html) return ''
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  const selectedExperiences = (data.experience || []).filter(exp => expandedJobs[exp.id])

  return (
    <>
      <div className="resume-modal-overlay" onClick={onClose} />
      <div className="resume-modal" role="dialog" aria-modal="true" aria-label="Resume Builder">
        <div className="resume-modal-header">
          <div className="resume-modal-header-left">
            <span className="resume-modal-icon"><Icons.pdf /></span>
            <div>
              <h2 className="resume-modal-title">Resume Builder</h2>
              <p className="resume-modal-subtitle">
                {selectedCount} of {SECTIONS.length} sections selected
              </p>
            </div>
          </div>
          <button className="resume-modal-close" onClick={onClose} aria-label="Close">
            <Icons.close />
          </button>
        </div>

        <div className="resume-modal-body">
          {/* Left sidebar: section toggles */}
          <aside className="resume-modal-sidebar">
            <h3 className="sidebar-heading">Sections</h3>
            <div className="section-toggles">
              {SECTIONS.map(section => (
                <div key={section.key} className="section-toggle-group">
                  <label className={`section-toggle ${selectedSections[section.key] ? 'active' : ''}`}>
                    <div className="toggle-info">
                      <span className="toggle-icon">{Icons[section.icon] ? Icons[section.icon]() : null}</span>
                      <span>{section.label}</span>
                    </div>
                    <div className="toggle-switch-wrap">
                      <input
                        type="checkbox"
                        checked={selectedSections[section.key]}
                        onChange={() => toggleSection(section.key)}
                      />
                      <div className="toggle-switch">
                        <div className="toggle-knob"></div>
                      </div>
                    </div>
                  </label>

                  {/* Nested job toggles under Experience */}
                  {section.key === 'experience' && selectedSections.experience && data.experience && (
                    <div className="nested-toggles">
                      {data.experience.map(exp => (
                        <label key={exp.id} className={`section-toggle nested ${expandedJobs[exp.id] ? 'active' : ''}`}>
                          <div className="toggle-info">
                            <span className="nested-label">{exp.company}</span>
                          </div>
                          <div className="toggle-switch-wrap">
                            <input
                              type="checkbox"
                              checked={expandedJobs[exp.id] || false}
                              onChange={() => toggleJob(exp.id)}
                            />
                            <div className="toggle-switch small">
                              <div className="toggle-knob"></div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              className="resume-print-btn"
              onClick={handleGenerate}
              disabled={selectedCount === 0 || generating}
            >
              {generating ? (
                <><Icons.spinner /> Generating Custom PDF...</>
              ) : (
                <><Icons.sparkles /> Generate Selected PDF</>
              )}
            </button>

            <a
              href="/static/resume.pdf"
              download="Mefta_Sadat_Resume.pdf"
              className="resume-download-direct-btn"
            >
              <Icons.download /> Download Full Resume PDF
            </a>
          </aside>

          {/* Right: live preview */}
          <div className="resume-preview-container">
            <div className="resume-preview" ref={printRef}>
              {/* Header always shown */}
              <div className="rp-header">
                <h1 className="rp-name">{data.name}</h1>
                <p className="rp-title">{data.title}</p>
                <div className="rp-contact">
                  <span><Icons.envelope /> meftasadat@gmail.com</span>
                  <span><Icons.linkedin /> linkedin.com/in/meftasadat</span>
                  <span><Icons.github /> github.com/meftasadat</span>
                </div>
              </div>

              {/* Summary */}
              {selectedSections.summary && (
                <div className="rp-section">
                  <h2 className="rp-section-title">Summary</h2>
                  <p className="rp-summary-text">{data.summary}</p>
                </div>
              )}

              {/* Experience */}
              {selectedSections.experience && selectedExperiences.length > 0 && (
                <div className="rp-section">
                  <h2 className="rp-section-title">Experience</h2>
                  {selectedExperiences.map(exp => (
                    <div key={exp.id} className="rp-experience-item">
                      <div className="rp-exp-header">
                        <div>
                          <strong className="rp-exp-position">{exp.position}</strong>
                          <span className="rp-exp-company"> — {exp.company}</span>
                        </div>
                        <span className="rp-exp-date">
                          {formatDate(exp.start_date)} – {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                        </span>
                      </div>
                      {exp.location && <p className="rp-exp-location">{exp.location}</p>}
                      <div className="rp-exp-description">{stripHtml(exp.description_html || exp.description)}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {selectedSections.education && data.education && data.education.length > 0 && (
                <div className="rp-section">
                  <h2 className="rp-section-title">Education</h2>
                  {data.education.map(edu => (
                    <div key={edu.id} className="rp-education-item">
                      <div className="rp-exp-header">
                        <div>
                          <strong>{edu.degree} in {edu.field_of_study}</strong>
                          <span className="rp-exp-company"> — {edu.institution}</span>
                        </div>
                        <span className="rp-exp-date">
                          {formatDate(edu.start_date)} – {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Talks */}
              {selectedSections.talks && data.talks && data.talks.length > 0 && (
                <div className="rp-section">
                  <h2 className="rp-section-title">Talks & Presentations</h2>
                  {data.talks.map(talk => (
                    <div key={talk.id} className="rp-talk-item">
                      <div className="rp-exp-header">
                        <strong>{talk.title}</strong>
                        <span className="rp-exp-date">{formatDate(talk.date)}</span>
                      </div>
                      <p className="rp-talk-event">{talk.event}{talk.location ? ` • ${talk.location}` : ''}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Publications */}
              {selectedSections.publications && data.publications && data.publications.length > 0 && (
                <div className="rp-section">
                  <h2 className="rp-section-title">Publications</h2>
                  {data.publications.map(pub => (
                    <div key={pub.id} className="rp-pub-item">
                      <strong className="rp-pub-title">{pub.title}</strong>
                      <p className="rp-pub-meta">
                        {pub.authors && pub.authors.join(', ')} — <em>{pub.venue}</em>, {pub.date ? pub.date.split('-')[0] : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {selectedCount === 0 && (
                <div className="rp-empty">
                  <Icons.info />
                  <p>Select at least one section to preview your resume.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default ResumeModal
