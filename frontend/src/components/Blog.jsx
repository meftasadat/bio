import { Link } from 'react-router-dom'
import './Blog.css'

function Blog({ posts }) {
  if (!posts || posts.length === 0) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="blog" id="blog">
      <div className="container">
        <div className="blog-header">
          <h2 className="section-title">Latest Blog Posts</h2>
          <Link to="/blog" className="view-all-link">View All Posts →</Link>
        </div>
        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-meta">
                <span className="blog-date">{formatDate(post.published_at)}</span>
                <span className="blog-author">by {post.author}</span>
              </div>
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="blog-tags">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="blog-tag">{tag}</span>
                  ))}
                </div>
              )}
              <Link to={`/blog/${post.slug}`} className="read-more">
                Read More →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
