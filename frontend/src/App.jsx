import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import axios from 'axios'
import './App.css'

// Core Components
import Header from './components/Header'
import Hero from './components/Hero'
import Innovations from './components/Innovations'
import Experience from './components/Experience'
import Talks from './components/Talks'
import Publications from './components/Publications'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
import Footer from './components/Footer'
import SEO from './components/SEO'

// Modals
import ResumeModal from './components/ResumeModal'

// Apps Components
import Apps from './components/apps/Apps'
import AppLanding from './components/apps/AppLanding'
import PrivacyPolicy from './components/apps/PrivacyPolicy'
import TermsOfService from './components/apps/TermsOfService'
import AppContact from './components/apps/AppContact'

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
      const response = await axios.get(`${API_BASE_URL}/content/`)
      if (response.data && response.data.name) {
        setPortfolioData(response.data)
      }
    } catch (error) {
      console.warn('Using baseline portfolio data:', error.message)
    }
  }

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/`)
      if (response.data?.posts?.length > 0) {
        setBlogPosts(response.data.posts)
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
          <Routes>
            <Route path="/apps/:appSlug/privacy" element={<PrivacyPolicy />} />
            <Route path="/apps/:appSlug/terms" element={<TermsOfService />} />
            <Route path="/apps/:appSlug/contact" element={<AppContact />} />
          </Routes>
        </main>
      ) : (
        <div className="site-wrapper">
          <Header onOpenResume={() => setIsResumeOpen(true)} />

          <main>
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
                    <Blog posts={blogPosts} publications={portfolioData?.publications} />
                    <Innovations />
                    <Experience data={portfolioData?.experience} />
                  </>
                }
              />

              {/* Sub-routes for direct navigation */}
              <Route path="/work" element={<Innovations />} />
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
                path="/experience"
                element={<Experience data={portfolioData?.experience} />}
              />
              <Route
                path="/talks"
                element={<Talks data={portfolioData?.talks} />}
              />
              <Route
                path="/publications"
                element={<Blog posts={blogPosts} publications={portfolioData?.publications} />}
              />
              <Route
                path="/blog"
                element={<Blog posts={blogPosts} publications={portfolioData?.publications} />}
              />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* Apps Showcase Routes */}
              <Route path="/apps" element={<Apps />} />
              <Route path="/apps/:appSlug" element={<AppLanding />} />
            </Routes>
          </main>

          <Footer />
        </div>
      )}

      {/* Resume Builder Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        data={portfolioData}
      />
    </div>
  )
}

export default App
