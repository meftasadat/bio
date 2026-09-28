import './Hero.css'

function Hero({ data, onOpenResume }) {
  if (!data) return null

  return (
    <section className="about-section" id="about">
      <p>
        I build systems that bring artificial intelligence into the real world. Over the last 13+ years, my focus has been on the messy, fascinating intersection of frontier AI and production engineering—turning research, foundation models, and autonomous agents into distributed software that reliably serves millions.
      </p>

      <p>
        Currently at <a href="https://www.priceline.com" target="_blank" rel="noopener noreferrer">Priceline.com</a> ✈️, I'm building the centralized AI/ML platform to productionize ML and Generative AI across the enterprise.
      </p>

      <p>
        Previously at <a href="https://www.loblawdigital.co/" target="_blank" rel="noopener noreferrer">Loblaw Digital</a> 🛒, I architected Canada’s first grocery app on the ChatGPT store ({' '}
        <a
          href="https://chatgpt.com/apps/pc-express/asdk_app_6944b4329b048191a7bb3376cb1725fc"
          target="_blank"
          rel="noopener noreferrer"
        >
          PC Express ChatGPT app
        </a>
        ), created <strong>Alfred</strong> (an enterprise multi-agent orchestration engine), and deployed LLM infrastructure processing 15M+ prompts weekly while building an in-house recommendation engine that drove $200K+/year in cost savings.
      </p>

      <p className="about-social">
        Find me on{' '}
        <a href="mailto:meftasadat@gmail.com">email</a>,{' '}
        <a href="https://www.linkedin.com/in/meftasadat/" target="_blank" rel="noopener noreferrer">LinkedIn</a>,{' '}
        <a href="https://github.com/meftasadat" target="_blank" rel="noopener noreferrer">GitHub</a>, and{' '}
        <a href="https://scholar.google.ca/citations?user=dIC_OowAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Google Scholar</a>, or view my{' '}
        <button className="text-btn" onClick={onOpenResume}>resume</button>.
      </p>
    </section>
  )
}

export default Hero
