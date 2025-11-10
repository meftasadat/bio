import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import './BlogPost.css'

const API_BASE_URL = 'http://localhost:8001/api'

function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBlogPost()
  }, [slug])

  const fetchBlogPost = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/slug/${slug}`)
      setPost(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blog post:', error)
      setError('Blog post not found')
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderMarkdown = (content) => {
    // Simple markdown renderer - converts basic markdown to HTML
    return content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/```([^```]+)```/gim, '<pre><code>$1</code></pre>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>')
  }

  if (loading) {
    return (
      <div className="blog-post-loading">
        <div className="container">
          <div className="spinner"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="blog-post-error">
        <div className="container">
          <h1>Blog Post Not Found</h1>
          <p>{error || 'The blog post you are looking for does not exist.'}</p>
          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
        </div>
      </div>
    )
  }

  return (
    <article className="blog-post">
      <div className="container">
        <div className="blog-post-header">
          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
          <div className="blog-post-meta">
            <span className="blog-post-date">{formatDate(post.published_at)}</span>
            <span className="blog-post-author">by {post.author}</span>
          </div>
        </div>

        <h1 className="blog-post-title">{post.title}</h1>

        <div className="blog-post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="blog-post-tag">{tag}</span>
          ))}
        </div>

        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(post.content)}</p>` }}
        />
      </div>
    </article>
  )
}

export default BlogPost
