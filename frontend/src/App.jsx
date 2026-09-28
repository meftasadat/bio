import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'

// Core Components
import Header from './components/Header'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Talks from './components/Talks'
import Publications from './components/Publications'
import Footer from './components/Footer'
import SEO from './components/SEO'

// Code-split components for lean bundle
const BlogPost = lazy(() => import('./components/BlogPost'))
const ResumeModal = lazy(() => import('./components/ResumeModal'))
const Apps = lazy(() => import('./components/apps/Apps'))
const AppLanding = lazy(() => import('./components/apps/AppLanding'))
const PrivacyPolicy = lazy(() => import('./components/apps/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./components/apps/TermsOfService'))
const AppContact = lazy(() => import('./components/apps/AppContact'))

import { API_BASE_URL } from './lib/api.js'
import { FALLBACK_PORTFOLIO_DATA, FALLBACK_BLOG_POSTS } from './lib/fallback-data.js'

function App() {
  const location = useLocation()
  const [portfolioData, setPortfolioData] = useState(FALLBACK_PORTFOLIO_DATA)
  const [blogPosts, setBlogPosts] = useState(FALLBACK_BLOG_POSTS)
  const [isResumeOpen, setIsResumeOpen] = useState(false)

  // Check if we're on an individual app sub-page
  const isAppLegalPage = location.pathname.startsWith('/apps/') && location.pathname !== '/apps'

  useEffect(() => {
    fetchPortfolioData()
    fetchBlogPosts()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/`)
      if (response.ok) {
        const data = await response.json()
        if (data && data.name) {
          setPortfolioData(data)
        }
      }
    } catch (error) {
      console.warn('Using baseline portfolio data:', error.message)
    }
  }

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/`)
      if (response.ok) {
        const data = await response.json()
        if (data?.posts?.length > 0) {
          setBlogPosts(data.posts)
        }
      }
    } catch (error) {
      console.warn('Using baseline blog posts:', error.message)
    }
  }

  return (
    <div className="App">
      <SEO />
      {isAppLegalPage ? (
        <main>
          <Suspense fallback={<div className="container" style={{ padding: '2rem 0' }}>Loading...</div>}>
            <Routes>
              <Route path="/apps/:appSlug/privacy" element={<PrivacyPolicy />} />
              <Route path="/apps/:appSlug/terms" element={<TermsOfService />} />
              <Route path="/apps/:appSlug/contact" element={<AppContact />} />
            </Routes>
          </Suspense>
        </main>
      ) : (
        <div className="site-wrapper">
          <Header onOpenResume={() => setIsResumeOpen(true)} />

          <main>
            <Suspense fallback={<div className="container" style={{ padding: '2rem 0' }}>Loading...</div>}>
              <Routes>
                {/* Main Editorial Portfolio */}
                <Route
                  path="/"
                  element={
                    <>
                      <Hero
                        data={portfolioData}
                        onOpenResume={() => setIsResumeOpen(true)}
                      />
                      <Talks data={portfolioData?.talks} />
                      <Publications data={portfolioData?.publications} articles={blogPosts} />
                      <Experience data={portfolioData?.experience} />
                    </>
                  }
                />

                {/* Sub-routes for direct navigation */}
                <Route
                  path="/about"
                  element={
                    <Hero
                      data={portfolioData}
                      onOpenResume={() => setIsResumeOpen(true)}
                    />
                  }
                />
                <Route
                  path="/work"
                  element={<Experience data={portfolioData?.experience} />}
                />
                <Route
                  path="/experience"
                  element={<Navigate to="/work" replace />}
                />
                <Route
                  path="/talks"
                  element={<Talks data={portfolioData?.talks} />}
                />
                <Route
                  path="/publications"
                  element={<Publications data={portfolioData?.publications} articles={blogPosts} />}
                />
                <Route
                  path="/blog"
                  element={<Publications data={portfolioData?.publications} articles={blogPosts} />}
                />
                <Route path="/blog/:slug" element={<BlogPost />} />

                {/* Apps Showcase Routes */}
                <Route path="/apps" element={<Apps />} />
                <Route path="/apps/:appSlug" element={<AppLanding />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      )}

      {/* Resume Builder Modal */}
      {isResumeOpen && (
        <Suspense fallback={null}>
          <ResumeModal
            isOpen={isResumeOpen}
            onClose={() => setIsResumeOpen(false)}
            data={portfolioData}
          />
        </Suspense>
      )}
    </div>
  )
}

export default App
