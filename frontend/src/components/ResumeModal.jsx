import { useState, useRef, useEffect } from 'react'
import { API_BASE_URL } from '../lib/api.js'
import './ResumeModal.css'

const SECTIONS = [
  { key: 'summary', label: 'Summary', icon: 'fas fa-user' },
  { key: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
  { key: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
  { key: 'talks', label: 'Talks', icon: 'fas fa-microphone' },
  { key: 'publications', label: 'Publications', icon: 'fas fa-book' },
  { key: 'blogs', label: 'Blog Posts', icon: 'fas fa-pen-fancy' },
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

      if (!response.ok) throw new Error('PDF generation failed')

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
      console.error('Resume generation failed:', err)
      alert('Failed to generate resume. Please try again.')
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
            <i className="fas fa-file-pdf resume-modal-icon"></i>
            <div>
              <h2 className="resume-modal-title">Resume Builder</h2>
              <p className="resume-modal-subtitle">
                {selectedCount} of {SECTIONS.length} sections selected
              </p>
            </div>
          </div>
          <button className="resume-modal-close" onClick={onClose} aria-label="Close">
            <i className="fas fa-times"></i>
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
                      <i className={section.icon}></i>
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
                <><i className="fas fa-spinner fa-spin"></i> Generating...</>
              ) : (
                <><i className="fas fa-download"></i> Generate PDF</>
              )}
            </button>
          </aside>

          {/* Right: live preview */}
          <div className="resume-preview-container">
            <div className="resume-preview" ref={printRef}>
              {/* Header always shown */}
              <div className="rp-header">
                <h1 className="rp-name">{data.name}</h1>
                <p className="rp-title">{data.title}</p>
                <div className="rp-contact">
                  <span><i className="fas fa-envelope"></i> meftasadat@gmail.com</span>
                  <span><i className="fab fa-linkedin"></i> linkedin.com/in/meftasadat</span>
                  <span><i className="fab fa-github"></i> github.com/meftasadat</span>
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
                        {pub.authors && pub.authors.join(', ')} — <em>{pub.venue}</em>, {formatDate(pub.date)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {selectedCount === 0 && (
                <div className="rp-empty">
                  <i className="fas fa-info-circle"></i>
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
