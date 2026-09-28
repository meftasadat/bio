import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Header.css'
import { useTheme } from '../context/ThemeContext'
import { FEATURE_FLAGS } from '../lib/feature-flags'

function Header({ onOpenResume }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('about')

  const navLinks = [
    { id: 'about', path: '/#about', label: 'About' },
    { id: 'talks', path: '/#talks', label: 'Appearances' },
    { id: 'writing', path: '/#writing', label: 'Writing' },
    { id: 'work', path: '/#work', label: 'Work' },
    { id: 'experience', path: '/#experience', label: 'Experience' },
  ]

  if (FEATURE_FLAGS.SHOW_APPS_NAV) {
    navLinks.push({ id: 'apps', path: '/apps', label: 'Apps' })
  }

  // Active section scrollspy
  useEffect(() => {
    if (location.pathname !== '/') return

    const sectionIds = ['about', 'talks', 'writing', 'work', 'experience']
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          )
          setActiveSection(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '-15% 0px -40% 0px',
        threshold: [0, 0.2]
      }
    )

    elements.forEach((el) => observer.observe(el))

    const handleScrollBottom = () => {
      if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 60) {
        setActiveSection('experience')
      }
    }
    window.addEventListener('scroll', handleScrollBottom, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScrollBottom)
    }
  }, [location.pathname])

  const scrollToTarget = (targetId) => {
    const el = document.getElementById(targetId)
    if (!el) return

    setActiveSection(targetId)

    // Trigger visual spotlight pulse on the targeted section
    el.classList.remove('section-spotlight')
    void el.offsetWidth // force reflow to trigger animation
    el.classList.add('section-spotlight')
    setTimeout(() => {
      el.classList.remove('section-spotlight')
    }, 1600)

    const header = document.querySelector('.site-header')
    const headerHeight = header ? header.offsetHeight : 120
    const mainEl = document.querySelector('main')

    const elementTop = el.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = Math.max(0, elementTop - headerHeight - 20)

    // Innovative dynamic runway: if the page is too short to scroll this section to the top,
    // dynamically extend paddingBottom so it smoothly glides right to the top under the header
    const currentMaxScroll = document.documentElement.scrollHeight - window.innerHeight
    if (offsetPosition > currentMaxScroll) {
      const shortfall = offsetPosition - currentMaxScroll
      if (mainEl) {
        mainEl.style.paddingBottom = `${shortfall + 100}px`
      }
    }

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })

    // Once user scrolls back up past the section, gracefully clean up the temporary runway
    const handleScrollUpRelease = () => {
      if (window.pageYOffset < offsetPosition - 150) {
        if (mainEl) {
          mainEl.style.paddingBottom = ''
        }
        window.removeEventListener('scroll', handleScrollUpRelease)
      }
    }
    window.addEventListener('scroll', handleScrollUpRelease, { passive: true })
  }

  const handleNavClick = (e, path) => {
    e.preventDefault()
    const mainEl = document.querySelector('main')

    if (path === '/' || path === '/#about') {
      if (mainEl) {
        mainEl.style.paddingBottom = ''
      }
      setActiveSection('about')
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate('/')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    if (path.startsWith('/#')) {
      const targetId = path.replace('/#', '')
      if (location.pathname === '/') {
        scrollToTarget(targetId)
      } else {
        navigate('/')
        setTimeout(() => {
          scrollToTarget(targetId)
        }, 150)
      }
      return
    }

    navigate(path)
  }

  return (
    <header className="site-header">
      <div className="site-header-content">
        <div className="site-brand-row">
          <Link
            to="/"
            className="site-brand"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/static/bio-img.JPG"
              alt="Mefta Sadat"
              className="site-logo"
            />
            <h1 className="site-name">Mefta Sadat</h1>
          </Link>

          <div className="site-header-actions">
            {/* Resume icon button */}
            <button
              type="button"
              className="site-icon-btn"
              onClick={onOpenResume}
              aria-label="Resume"
              title="Resume"
            >
              <svg
                className="header-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </button>

            {/* Dark/light theme toggle icon button */}
            <button
              type="button"
              className="site-icon-btn theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg
                  className="header-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg
                  className="header-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        <nav className="site-nav">
          <ul>
            {navLinks.map((item) => {
              const isActive = activeSection === item.id
              return (
                <li
                  key={item.id}
                  className={`site-nav-item ${isActive ? 'site-nav-item-active' : ''}`}
                >
                  <a
                    href={item.path}
                    onClick={(e) => handleNavClick(e, item.path)}
                    className={isActive ? 'site-nav-active' : ''}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
