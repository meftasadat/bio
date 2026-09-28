import './Footer.css'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-left">
          Copyright &copy; {new Date().getFullYear()} Mefta Sadat
        </div>
        <button className="footer-top-link" onClick={scrollToTop}>
          Top ↑
        </button>
      </div>
    </footer>
  )
}

export default Footer
