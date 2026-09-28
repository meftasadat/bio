import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Header.css'
import { useTheme } from '../context/ThemeContext'
import { FEATURE_FLAGS } from '../lib/feature-flags'

const SECTION_IDS = ['about', 'talks', 'publications', 'work']

function Header({ onOpenResume }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('about')

  const isManualScrollingRef = useRef(false)
  const scrollEndTimerRef = useRef(null)
  const safetyTimerRef = useRef(null)

  const navLinks = [
    { id: 'about', path: '/#about', label: 'About' },
    { id: 'talks', path: '/#talks', label: 'Appearances' },
    { id: 'publications', path: '/#publications', label: 'Publications' },
    { id: 'work', path: '/#work', label: 'Work' },
  ]

  if (FEATURE_FLAGS.SHOW_APPS_NAV) {
    navLinks.push({ id: 'apps', path: '/apps', label: 'Apps' })
  }

  const getHeaderHeight = () => {
    const header = document.querySelector('.site-header')
    return header ? header.offsetHeight : 110
  }

  // Calculate and update which section is active based on current scroll position
  const updateActiveSection = useCallback(() => {
    if (isManualScrollingRef.current) return
    if (location.pathname !== '/') return

    // 1. If at or near the very top of the page, active section is 'about'
    if (window.pageYOffset < 50) {
      setActiveSection('about')
      return
    }

    // 2. If at or near the very bottom of the page, active section is the last section ('experience')
    const isAtBottom =
      window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 50
    if (isAtBottom) {
      setActiveSection(SECTION_IDS[SECTION_IDS.length - 1])
      return
    }

    // 3. Document-order scrollspy:
    // Reference line sits comfortably below the sticky header
    const headerHeight = getHeaderHeight()
    const referenceY = headerHeight + 50

    let currentActive = 'about'
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (el) {
        const top = el.getBoundingClientRect().top
        if (top <= referenceY) {
          currentActive = id
        }
      }
    }

    setActiveSection(currentActive)
    if (window.history.replaceState && currentActive && window.location.hash !== `#${currentActive}`) {
      window.history.replaceState(null, '', `/#${currentActive}`)
    }
  }, [location.pathname])

  // Active section scrollspy & interaction listeners
  useEffect(() => {
    if (location.pathname === '/apps') {
      setActiveSection('apps')
      return
    }

    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }

    // Initialize active section from hash or current scroll position
    if (window.location.hash) {
      const targetHash = window.location.hash.replace('#', '')
      if (SECTION_IDS.includes(targetHash)) {
        setActiveSection(targetHash)
        setTimeout(() => {
          scrollWithRetry(targetHash)
        }, 120)
      }
    } else {
      updateActiveSection()
    }

    let ticking = false
    const handleScroll = () => {
      if (isManualScrollingRef.current) {
        // While programmatically smooth scrolling, reset scrollEnd debounce
        clearTimeout(scrollEndTimerRef.current)
        scrollEndTimerRef.current = setTimeout(() => {
          isManualScrollingRef.current = false
          updateActiveSection()
        }, 150)
        return
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection()
          ticking = false
        })
        ticking = true
      }
    }

    // When the browser signals that scrolling has ended
    const handleScrollEnd = () => {
      isManualScrollingRef.current = false
      clearTimeout(scrollEndTimerRef.current)
      clearTimeout(safetyTimerRef.current)
      updateActiveSection()
    }

    // If the user manually intervenes with wheel, touch, or keys, release lock immediately
    const handleUserInterrupt = () => {
      if (isManualScrollingRef.current) {
        isManualScrollingRef.current = false
        clearTimeout(scrollEndTimerRef.current)
        clearTimeout(safetyTimerRef.current)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('scrollend', handleScrollEnd, { passive: true })
    window.addEventListener('wheel', handleUserInterrupt, { passive: true })
    window.addEventListener('touchstart', handleUserInterrupt, { passive: true })
    window.addEventListener('keydown', handleUserInterrupt, { passive: true })
    window.addEventListener('resize', updateActiveSection, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scrollend', handleScrollEnd)
      window.removeEventListener('wheel', handleUserInterrupt)
      window.removeEventListener('touchstart', handleUserInterrupt)
      window.removeEventListener('keydown', handleUserInterrupt)
      window.removeEventListener('resize', updateActiveSection)
      clearTimeout(scrollEndTimerRef.current)
      clearTimeout(safetyTimerRef.current)
    }
  }, [location.pathname, updateActiveSection])

  const scrollToTarget = (targetId) => {
    const resolvedId =
      targetId === 'experience' && !document.getElementById('experience') ? 'work' : targetId
    const el = document.getElementById(resolvedId)
    if (!el) return

    const navActiveId = resolvedId === 'experience' ? 'work' : resolvedId
    setActiveSection(navActiveId)
    isManualScrollingRef.current = true

    clearTimeout(scrollEndTimerRef.current)
    clearTimeout(safetyTimerRef.current)
    safetyTimerRef.current = setTimeout(() => {
      isManualScrollingRef.current = false
    }, 1000)

    // Trigger visual spotlight pulse on the targeted section
    el.classList.remove('section-spotlight')
    void el.offsetWidth // force reflow to trigger animation
    el.classList.add('section-spotlight')
    setTimeout(() => {
      el.classList.remove('section-spotlight')
    }, 1600)

    const headerHeight = getHeaderHeight()
    const elementTop = el.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = Math.max(0, elementTop - headerHeight - 20)

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  const scrollWithRetry = (targetId, maxRetries = 6) => {
    const el = document.getElementById(targetId)
    if (el) {
      scrollToTarget(targetId)
    } else if (maxRetries > 0) {
      setTimeout(() => scrollWithRetry(targetId, maxRetries - 1), 80)
    }
  }

  const handleNavClick = (e, path) => {
    e.preventDefault()

    if (path === '/' || path === '/#about') {
      setActiveSection('about')
      window.history.pushState(null, '', '/#about')
      isManualScrollingRef.current = true

      clearTimeout(scrollEndTimerRef.current)
      clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = setTimeout(() => {
        isManualScrollingRef.current = false
      }, 1000)

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
      window.history.pushState(null, '', path)
      if (location.pathname === '/') {
        scrollToTarget(targetId)
      } else {
        navigate('/')
        scrollWithRetry(targetId)
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
            onClick={(e) => handleNavClick(e, '/#about')}
          >
            <img
              src="/static/bio-img.webp"
              onError={(e) => { e.currentTarget.src = '/static/bio-img.JPG' }}
              alt="Mefta Sadat"
              className="site-logo"
              width="44"
              height="44"
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
