import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import './App.css'

// Components
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
import Talks from './components/Talks'
import Publications from './components/Publications'
import Contact from './components/Contact'
import { API_BASE_URL } from './lib/api'

function App() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolioData()
    fetchBlogPosts()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/content/`)
      setPortfolioData(response.data)
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
    }
  }

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/`)
      setBlogPosts(response.data.posts)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    )
  }

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero data={portfolioData} />
              <About data={portfolioData} />
              <Skills data={portfolioData?.skills} />

              <Experience data={portfolioData?.experience} />
              <Blog posts={blogPosts.slice(0, 3)} />
              <Talks data={portfolioData?.talks} />
              <Publications data={portfolioData?.publications} />
              <Contact data={portfolioData?.contact} />
            </>
          } />
          <Route path="/about" element={<About data={portfolioData} />} />

          <Route path="/experience" element={<Experience data={portfolioData?.experience} />} />
          <Route path="/talks" element={<Talks data={portfolioData?.talks} />} />
          <Route path="/publications" element={<Publications data={portfolioData?.publications} />} />
          <Route path="/blog" element={<Blog posts={blogPosts} />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact data={portfolioData?.contact} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
