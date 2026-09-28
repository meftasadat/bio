import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const DEFAULT_TITLE = 'Mefta Sadat | Staff ML Engineer & AI Platform Architect'
const DEFAULT_DESC = 'Mefta Sadat — Staff ML Engineer, AI/ML Platform at Priceline. Specializing in MLOps, Agentic AI, and GenAI productionization at scale.'

const ROUTE_METADATA = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
  },
  '/about': {
    title: 'About | Mefta Sadat',
    description: 'Staff ML Engineer at Priceline specializing in central AI/ML platforms, MLOps, and agentic AI systems.',
  },
  '/work': {
    title: 'Work (Featured) | Mefta Sadat',
    description: 'Featured architectural projects and ML platform innovations by Mefta Sadat at Priceline and Loblaw Digital.',
  },
  '/experience': {
    title: 'Experience | Mefta Sadat',
    description: 'Professional experience of Mefta Sadat at Priceline, Loblaw Digital, Zone•tv, and IBM CAS.',
  },
  '/talks': {
    title: 'Appearances & Talks | Mefta Sadat',
    description: 'Conference presentations, tech talks, and appearances on MLOps and Generative AI by Mefta Sadat.',
  },
  '/publications': {
    title: 'Publications & Research | Mefta Sadat',
    description: 'Research publications, papers, and citations by Mefta Sadat in distributed systems and ML.',
  },
  '/blog': {
    title: 'Writing & Articles | Mefta Sadat',
    description: 'Articles and case studies on recommendation engines, MLOps, and agentic AI by Mefta Sadat.',
  },
}

function SEO() {
  const location = useLocation()

  useEffect(() => {
    const isAppRoute = location.pathname.startsWith('/apps')

    // Hide all /apps (e.g. Kick) from search engines with noindex, nofollow
    let robotsMeta = document.querySelector('meta[name="robots"]')
    if (isAppRoute) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta')
        robotsMeta.setAttribute('name', 'robots')
        document.head.appendChild(robotsMeta)
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow')
    } else if (robotsMeta) {
      robotsMeta.remove()
    }

    // Set page title and description
    const routeInfo = ROUTE_METADATA[location.pathname]
    if (routeInfo) {
      document.title = routeInfo.title
      const descMeta = document.querySelector('meta[name="description"]')
      if (descMeta) {
        descMeta.setAttribute('content', routeInfo.description)
      }
    } else if (!location.pathname.startsWith('/blog/')) {
      document.title = DEFAULT_TITLE
      const descMeta = document.querySelector('meta[name="description"]')
      if (descMeta) {
        descMeta.setAttribute('content', DEFAULT_DESC)
      }
    }

    // Set canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      const canonicalPath = location.pathname === '/' ? '' : location.pathname
      canonical.setAttribute('href', `https://meftasadat.xyz${canonicalPath}`)
    }
  }, [location.pathname])

  return null
}

export default SEO
