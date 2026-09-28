import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './BlogPost.css'
import { API_BASE_URL } from '../lib/api'

function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBlogPost()
  }, [slug])

  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | Mefta Sadat`
      const descMeta = document.querySelector('meta[name="description"]')
      if (descMeta && (post.excerpt || post.subtitle)) {
        descMeta.setAttribute('content', post.excerpt || post.subtitle)
      }
    }
  }, [post])

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/slug/${slug}`)
      if (!response.ok) throw new Error('Blog post not found')
      const data = await response.json()
      setPost(data)
      setLoading(false)
      // Redirect to Medium after a short delay
      if (data?.medium_url) {
        setTimeout(() => {
          window.open(data.medium_url, '_blank', 'noopener,noreferrer')
        }, 1500)
      }
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
      <div className="blog-post-header">
          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
          <div className="blog-post-meta">
            <span className="blog-post-date">{formatDate(post.published_at)}</span>
            <span className="blog-post-author">by {post.author}</span>
          </div>
        </div>

        <h1 className="blog-post-title">{post.title}</h1>

        {post.thumbnail_url && (
          <div className="blog-post-thumbnail">
            <img src={post.thumbnail_url} alt={post.title} />
          </div>
        )}

        <p className="blog-post-excerpt">{post.excerpt}</p>

        <div className="blog-post-redirect">
          <p>Redirecting you to the full article on Medium...</p>
          <p>If you are not redirected automatically, <a href={post.medium_url} target="_blank" rel="noopener noreferrer">click here</a>.</p>
        </div>
      </article>
  )
}

export default BlogPost
