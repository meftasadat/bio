import './About.css'

const FOCUS_AREAS = [
  {
    title: 'Agentic AI & Orchestration',
    description: 'Multi-agent coordination using LangGraph, LiteLLM, and tool calling for autonomous, multi-step enterprise workflows.'
  },
  {
    title: 'Enterprise MLOps & AI Platform',
    description: 'Production model serving and inferencing at scale on Kubernetes, Vertex AI, and Airflow for distributed systems.'
  },
  {
    title: 'Observability, Evals & Guardrails',
    description: 'Evals-as-a-Service for automated model benchmarking, telemetry with LangFuse, and production safety guardrails.'
  },
  {
    title: 'Recommender Systems & Vector Search',
    description: 'Large-scale personalized recommendation engines and semantic vector search with Qdrant, powering millions of user journeys.'
  }
]

function About() {
  return (
    <section className="section focus-section" id="focus">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Technical Focus</h2>
          <p className="section-description">
            Core engineering disciplines across research, platform architecture, and high-scale production systems.
          </p>
        </div>

        <div className="focus-grid">
          {FOCUS_AREAS.map((area, idx) => (
            <div key={idx} className="focus-item">
              <h3 className="focus-title">{area.title}</h3>
              <p className="focus-desc">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
