import './Innovations.css'

const PROJECTS = [
  {
    id: 'priceline-platform',
    company: 'Priceline.com',
    role: 'Staff ML Developer',
    period: '2026 – Present',
    title: 'Centralized AI/ML Platform & GenAI Productionization',
    description: "Leading the architecture of Priceline's centralized AI/ML platform to safely productionize Generative AI and scale intelligent applications enterprise-wide. Building foundational platform services including unified AI Observability, Evals-as-a-Service for automated model benchmarking, and robust AI governance and guardrails. Developed an internal CLI tool to scaffold standardized ML/AI projects with CI/CD and platform integrations.",
    links: [
      { label: 'Priceline.com', url: 'https://www.priceline.com' }
    ]
  },
  {
    id: 'pc-express-chatgpt',
    company: 'Loblaw Digital',
    role: 'Staff ML Software Engineer',
    period: '2023 – 2026',
    title: 'PC Express on ChatGPT & Alfred Multi-Agent Engine',
    description: "Architected Canada's first Canadian grocery shopping app on OpenAI's ChatGPT Store, enabling customers to plan meals and add ingredients directly to their PC Express cart. Architected Alfred, an enterprise agent orchestration engine powering conversational AI applications across Loblaw using LangGraph, LiteLLM, MCP servers, and Gradio. Scaled infrastructure processing 15 million prompts weekly using Qdrant vector search, Vertex AI, and Apache Airflow.",
    links: [
      { label: 'ChatGPT Store App', url: 'https://chatgpt.com/apps/pc-express/asdk_app_6944b4329b048191a7bb3376cb1725fc' },
      { label: 'Loblaw Press Release', url: 'https://www.loblaw.ca/en/loblaw-advances-ai-in-canadian-retail-with-first-of-its-kind-shopping-app-in-chatgpt/' }
    ]
  },
  {
    id: 'helios-recommender',
    company: 'Loblaw Digital',
    role: 'Staff ML Software Engineer',
    period: '2020 – 2023',
    title: 'Helios Recommendation Engine & Enterprise MLOps',
    description: "Established the enterprise MLOps platform using Kubernetes, Vertex AI, Seldon Core, Prometheus, and Grafana. Developed an in-house personalization and recommendation engine that replaced costly third-party commercial services, delivering $200K+ in annual recurring infrastructure savings while serving millions of customer journeys.",
    links: [
      { label: 'Case Study on Medium', url: 'https://medium.com/loblaw-digital/unlocking-experimentation-with-helios-recommendation-engine-ff91d697b943' }
    ]
  }
]

function Innovations() {
  return (
    <section className="section" id="work">
      <h2 className="section-heading">
        <a href="#work">Work (Featured)</a>
      </h2>

      <div className="work-list">
        {PROJECTS.map((item) => (
          <article key={item.id} className="work-item">
            <h3 className="work-title">
              {item.title}{' '}
              <span className="work-meta">({item.company}, {item.period})</span>
            </h3>

            <p className="work-desc">{item.description}</p>

            {item.links && item.links.length > 0 && (
              <div className="work-links">
                {item.links.map((link, idx) => (
                  <span key={idx} className="work-link-wrap">
                    [{' '}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>{' '}
                    ]
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default Innovations
