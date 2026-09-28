export const FALLBACK_PORTFOLIO_DATA = {
  name: 'Mefta Sadat',
  title: 'Staff ML Developer',
  summary: 'I specialize in MLOps and Agentic AI. 9+ YoE.',
  about: `I build systems that bring artificial intelligence into the real world. Over the last decade, my focus has been on the messy, fascinating intersection of frontier AI and production engineering—turning research, foundation models, and autonomous agents into distributed software that reliably serves millions.

Currently at [Priceline.com](https://www.priceline.com) ✈️, I'm building the centralized AI/ML platform to productionize ML and Generative AI across the enterprise.

Previously at [Loblaw Digital](https://www.loblawdigital.co/) 🛒, I architected the [PC Express ChatGPT app](https://chatgpt.com/apps/pc-express/asdk_app_6944b4329b048191a7bb3376cb1725fc) (Canada’s first grocery app on the ChatGPT store), created Alfred (an enterprise multi-agent orchestration engine), and built the Helios Recommendation Engine.

Outside tech, I like to explore the latest in AI and spend time in nature. I'm also an avid traveler (5 continents and counting!).`,
  experience: [
    {
      id: 'priceline',
      company: 'Priceline.com',
      position: 'Staff ML Developer',
      location: 'Toronto, Canada',
      start_date: '2026-03-01',
      end_date: null,
      description: `<ul>
        <li>Leading the architecture and development of Priceline's centralized AI/ML platform to productionize ML and Generative AI and safely scale intelligent applications across the enterprise. Building foundational platform services including unified AI Observability, Evals as a Service for automated model benchmarking, and robust AI Governance and Guardrails.</li>
        <li>Accelerating GenAI and ML productionization across engineering teams by developing an internal CLI tool that instantly scaffolds new ML/AI projects. The tool drastically reduces developer onboarding time and ensures company-wide consistency by automatically provisioning standardized structures, CI/CD pipelines, and essential platform integrations.</li>
      </ul>`,
      description_html: `<ul>
        <li>Leading the architecture and development of Priceline's centralized AI/ML platform to productionize ML and Generative AI and safely scale intelligent applications across the enterprise. Building foundational platform services including unified AI Observability, Evals as a Service for automated model benchmarking, and robust AI Governance and Guardrails.</li>
        <li>Accelerating GenAI and ML productionization across engineering teams by developing an internal CLI tool that instantly scaffolds new ML/AI projects. The tool drastically reduces developer onboarding time and ensures company-wide consistency by automatically provisioning standardized structures, CI/CD pipelines, and essential platform integrations.</li>
      </ul>`,
      technologies: [
        'AI/ML Platform', 'Generative AI', 'GenAI Productionization', 'Platform Engineering',
        'AI Observability', 'Evals as a Service', 'AI Governance', 'AI Safety', 'Guardrails', 'LLM Evaluation'
      ]
    },
    {
      id: 'loblaw-digital',
      company: 'Loblaw Digital',
      position: 'Staff ML Software Engineer',
      location: 'Toronto, Canada',
      start_date: '2018-08-01',
      end_date: '2026-03-01',
      description: `<ul>
        <li>Led and built the first ever Canadian ChatGPT grocery app (PC Express) on the ChatGPT store, enabling customers to plan meals and add ingredients seamlessly to their cart. <a href="https://chatgpt.com/apps/pc-express/asdk_app_6944b4329b048191a7bb3376cb1725fc" target="_blank" rel="noopener noreferrer">View on ChatGPT</a> • <a href="https://www.loblaw.ca/en/loblaw-advances-ai-in-canadian-retail-with-first-of-its-kind-shopping-app-in-chatgpt/" target="_blank" rel="noopener noreferrer">Read the Press Release</a><br/><a href="https://chatgpt.com/apps/pc-express/asdk_app_6944b4329b048191a7bb3376cb1725fc" target="_blank" rel="noopener noreferrer" class="chatgpt-app-link"><img src="/static/pc-express-chatgpt.png" alt="PC Express ChatGPT App" class="chatgpt-app-image" /></a></li>
        <li>Led the development of Alfred, an internal agent orchestration engine powering many conversational AI applications across the organization. Architected the solution using LangGraph, LangFuse, LiteLLM, Gradio, and MCP servers to enable scalable agentic workflows.</li>
        <li>Designed and deployed enterprise-scale LLM infrastructure incorporating LLMOps best practices. Implemented batch prediction, monitoring, and orchestration systems processing 15 million prompts weekly, leveraging Qdrant for vector search, Vertex AI for ML infrastructure, and Airflow for workflow orchestration.</li>
        <li>Established the company's MLOps platform using Kubernetes, Vertex AI, Seldon, Prometheus, and Grafana, enabling data scientists to streamline the path from exploratory analysis to production deployment. Developed an in-house recommendation engine that eliminated third-party dependencies, resulting in $200K+ annual cost savings.</li>
      </ul>`,
      description_html: `<ul>
        <li>Led and built the first ever Canadian ChatGPT grocery app (PC Express) on the ChatGPT store, enabling customers to plan meals and add ingredients seamlessly to their cart. <a href="https://chatgpt.com/apps/pc-express/asdk_app_6944b4329b048191a7bb3376cb1725fc" target="_blank" rel="noopener noreferrer">View on ChatGPT</a> • <a href="https://www.loblaw.ca/en/loblaw-advances-ai-in-canadian-retail-with-first-of-its-kind-shopping-app-in-chatgpt/" target="_blank" rel="noopener noreferrer">Read the Press Release</a><br/><a href="https://chatgpt.com/apps/pc-express/asdk_app_6944b4329b048191a7bb3376cb1725fc" target="_blank" rel="noopener noreferrer" class="chatgpt-app-link"><img src="/static/pc-express-chatgpt.png" alt="PC Express ChatGPT App" class="chatgpt-app-image" /></a></li>
        <li>Led the development of Alfred, an internal agent orchestration engine powering many conversational AI applications across the organization. Architected the solution using LangGraph, LangFuse, LiteLLM, Gradio, and MCP servers to enable scalable agentic workflows.</li>
        <li>Designed and deployed enterprise-scale LLM infrastructure incorporating LLMOps best practices. Implemented batch prediction, monitoring, and orchestration systems processing 15 million prompts weekly, leveraging Qdrant for vector search, Vertex AI for ML infrastructure, and Airflow for workflow orchestration.</li>
        <li>Established the company's MLOps platform using Kubernetes, Vertex AI, Seldon, Prometheus, and Grafana, enabling data scientists to streamline the path from exploratory analysis to production deployment. Developed an in-house recommendation engine that eliminated third-party dependencies, resulting in $200K+ annual cost savings.</li>
      </ul>`,
      technologies: [
        'LangGraph', 'LangFuse', 'LiteLLM', 'Qdrant', 'Vertex AI',
        'Apache Airflow', 'Kubernetes', 'Seldon', 'Prometheus', 'Grafana'
      ]
    },
    {
      id: 'zonetv',
      company: 'ZoneTV',
      position: 'ML Software Engineer',
      location: 'Toronto, Canada',
      start_date: '2017-06-01',
      end_date: '2018-08-31',
      description: `<ul>
        <li>Architected and implemented machine learning model-serving and retraining infrastructure on a hybrid multi-cloud platform spanning AWS and Azure.</li>
        <li>Designed and deployed a production-grade recommendation system using Azure Machine Learning and Apache Spark on AWS EMR, serving major clients including TIVO and Virgin Media UK. This implementation was featured by Microsoft as a customer success story.</li>
        <li>Developed serverless RESTful ML model serving applications using AWS Lambda, API Gateway, and the Chalice framework, ensuring scalable and cost-effective inference for enterprise clients.</li>
      </ul>`,
      description_html: `<ul>
        <li>Architected and implemented machine learning model-serving and retraining infrastructure on a hybrid multi-cloud platform spanning AWS and Azure.</li>
        <li>Designed and deployed a production-grade recommendation system using Azure Machine Learning and Apache Spark on AWS EMR, serving major clients including TIVO and Virgin Media UK. This implementation was featured by Microsoft as a customer success story.</li>
        <li>Developed serverless RESTful ML model serving applications using AWS Lambda, API Gateway, and the Chalice framework, ensuring scalable and cost-effective inference for enterprise clients.</li>
      </ul>`,
      technologies: [
        'Azure Machine Learning', 'Apache Spark', 'AWS EMR',
        'AWS Lambda', 'API Gateway', 'Chalice', 'EC2'
      ]
    },
    {
      id: 'ibm-cas',
      company: 'IBM-CAS',
      position: 'Graduate Student Researcher',
      location: 'Toronto, Canada',
      start_date: '2015-09-01',
      end_date: '2016-12-31',
      description: `<ul>
        <li>Conducted user behavior analysis on IBM Watson Analytics platform by extracting and analyzing log data using Python and ElasticSearch.</li>
        <li>Provided insights that improved the ranking algorithm for data visualizations, enhancing user experience and platform effectiveness.</li>
      </ul>`,
      description_html: `<ul>
        <li>Conducted user behavior analysis on IBM Watson Analytics platform by extracting and analyzing log data using Python and ElasticSearch.</li>
        <li>Provided insights that improved the ranking algorithm for data visualizations, enhancing user experience and platform effectiveness.</li>
      </ul>`,
      technologies: ['Python', 'ElasticSearch', 'IBM Watson Analytics']
    },
    {
      id: 'tmu-research',
      company: 'Toronto Metropolitan University',
      position: 'Research Assistant',
      location: 'Toronto, Canada',
      start_date: '2015-09-01',
      end_date: '2017-05-31',
      description: `<ul>
        <li>Conducted research on software quality assurance by implementing machine learning techniques including recommender systems and probabilistic classifiers to predict defect rediscovery in commercial and open-source software projects under the supervision of Dr. Andriy Miranskyy and Dr. Ayse Bener.</li>
        <li>Received nomination for the Governor General's Academic Medal from the Computer Science Department in recognition of outstanding academic achievement.</li>
      </ul>`,
      description_html: `<ul>
        <li>Conducted research on software quality assurance by implementing machine learning techniques including recommender systems and probabilistic classifiers to predict defect rediscovery in commercial and open-source software projects under the supervision of Dr. Andriy Miranskyy and Dr. Ayse Bener.</li>
        <li>Received nomination for the Governor General's Academic Medal from the Computer Science Department in recognition of outstanding academic achievement.</li>
      </ul>`,
      technologies: ['Machine Learning', 'Recommender Systems', 'Probabilistic Classifiers']
    },
    {
      id: 'samsung-rnd',
      company: 'Samsung Research',
      position: 'Software Engineer',
      location: 'Dhaka, Bangladesh',
      start_date: '2013-11-01',
      end_date: '2015-08-31',
      description: `<ul>
        <li>Developed a Test Automation Framework using C and EFL to manage and execute automatic and manual integration and unit test cases covering TIZEN Native APIs.</li>
        <li>Used in each dev cycle of Samsung Z1 and Gear S2 device in order to minimize number of defects in the product.</li>
      </ul>`,
      description_html: `<ul>
        <li>Developed a Test Automation Framework using C and EFL to manage and execute automatic and manual integration and unit test cases covering TIZEN Native APIs.</li>
        <li>Used in each dev cycle of Samsung Z1 and Gear S2 device in order to minimize number of defects in the product.</li>
      </ul>`,
      technologies: ['C', 'EFL', 'TIZEN', 'Test Automation']
    }
  ],
  education: [
    {
      id: 'msc-cs',
      institution: 'Toronto Metropolitan University (TMU)',
      degree: 'Master of Science',
      field_of_study: 'Computer Science',
      start_date: '2015-09-01',
      end_date: '2017-05-31'
    }
  ],
  talks: [
    {
      id: 'alfred-agentic-orchestration',
      title: "Alfred: Loblaw's Agentic Orchestration Layer for E-commerce",
      event: 'Agentic AI Talk',
      date: '2025-11-18',
      location: 'Virtual',
      link: 'https://www.youtube.com/watch?v=Sx7-hok2dtk',
      video_url: 'https://www.youtube.com/watch?v=Sx7-hok2dtk',
      description: "Explored the design, architecture, and multi-agent coordination of Alfred, Loblaw's agentic orchestration engine built on LangGraph and MCP."
    },
    {
      id: 'mlops-world-2023',
      title: 'MLOps Panel Discussion - Building Production ML Systems at Loblaws',
      event: 'MLOps Community Event',
      date: '2023-05-29',
      location: 'Virtual',
      link: 'https://www.youtube.com/watch?v=a8HUjhArHzA',
      video_url: 'https://www.youtube.com/watch?v=a8HUjhArHzA'
    },
    {
      id: 'mlops-community-2022',
      title: 'Setting up an ML Platform on GCP for Loblaws - Lessons Learned',
      event: 'MLOps Community Meetup',
      date: '2022-12-28',
      location: 'Virtual',
      link: 'https://www.youtube.com/watch?v=77y57C4a-n8',
      video_url: 'https://www.youtube.com/watch?v=77y57C4a-n8'
    },
    {
      id: 'mlops-world-2021',
      title: 'Integrating multiple MLOps tools together on Google Cloud Platform at Loblaws',
      event: 'MLOps World Conference',
      date: '2021-06-12',
      location: 'Toronto, Canada',
      link: 'https://www.youtube.com/watch?v=YSybRCdFpOI',
      video_url: 'https://www.youtube.com/watch?v=YSybRCdFpOI'
    }
  ],
  publications: [
    {
      id: 'msr-2017-rediscovery',
      title: 'Rediscovery datasets: Connecting duplicate reports',
      venue: '2017 IEEE/ACM 14th International Conference on Mining Software Repositories (MSR)',
      date: '2017-05-20',
      authors: ['Mefta Sadat', 'Ayse Basar Bener', 'Andriy Miranskyy'],
      url: 'https://ieeexplore.ieee.org/document/7962413',
      summary: 'Introduced an openly available dataset that links duplicate bug reports across Apache, Eclipse, and KDE ecosystems. Demonstrated how richer linking improves prioritization models and downstream triage accuracy.'
    },
    {
      id: 'cascon-2017-preferences',
      title: 'A probabilistic approach for modelling user preferences in recommender systems',
      venue: 'CASCON',
      date: '2017-01-01',
      authors: ['Parisa Lak', 'Can Kavaklioglu', 'Mefta Sadat', 'Martin Petitclerc', 'Andriy V Miranskyy', 'Graham Wills', 'Ayse Basar Bener'],
      url: 'https://scholar.google.ca/citations?view_op=view_citation&hl=en&user=dIC_OowAAAAJ&citation_for_view=dIC_OowAAAAJ:2osOgNQ5qMEC',
      summary: 'Probabilistic modeling of user preferences in recommender systems.'
    },
    {
      id: 'cascon-2016-watson',
      title: 'Preliminary investigation on user interaction with ibm watson analytics',
      venue: 'Proceedings of the 26th Annual International Conference on Computer Science and Software Engineering',
      date: '2016-01-01',
      authors: ['Parisa Lak', 'Mefta Sadat', 'Carl Julien Barrelet', 'Martin Petitclerc', 'Andriy Miranskyy', 'Craig Statchuk', 'Ayse Basar Bener'],
      url: 'https://scholar.google.ca/citations?view_op=view_citation&hl=en&user=dIC_OowAAAAJ&citation_for_view=dIC_OowAAAAJ:qjMakFHDy7sC',
      summary: 'Investigation of user interactions with IBM Watson Analytics.'
    },
    {
      id: 'thesis-2017-rediscovery',
      title: 'On Predicting Rediscoveries of Software Defects',
      venue: 'Toronto Metropolitan University',
      date: '2017-06-06',
      authors: ['Mefta Sadat'],
      url: 'https://scholar.google.ca/citations?view_op=view_citation&hl=en&user=dIC_OowAAAAJ&citation_for_view=dIC_OowAAAAJ:UeHWp8X0CEIC',
      summary: 'Master of Science thesis on predicting rediscoveries of software defects.'
    },
    {
      id: 'iccit-2014-affection',
      title: 'Recognition of human affection in smartphone perspective based on accelerometer and user\'s sitting position',
      venue: '2014 17th International Conference on Computer and Information Technology (ICCIT)',
      date: '2014-12-22',
      authors: ['Rasam Bin Hossain', 'Mefta Sadat', 'Hasan Mahmud'],
      url: 'https://scholar.google.ca/citations?view_op=view_citation&hl=en&user=dIC_OowAAAAJ&citation_for_view=dIC_OowAAAAJ:u5HHmVD_uO8C',
      summary: 'Research on recognizing human affection using smartphone sensors and accelerometer data.'
    }
  ]
}

export const FALLBACK_BLOG_POSTS = [
  {
    id: 'unlocking-experimentation-with-helios-recommendation-engine-ff91d697b943',
    title: 'Unlocking Experimentation with Helios Recommendation Engine',
    author: 'Samara Xiang',
    excerpt: 'Co-authored by: Samara Xiang, Yuhan Qin, Mefta Sadat, JC Seok, Alex Yip. How we built and tested enterprise recommendation algorithms at Loblaw Digital.',
    published_at: '2024-10-22T19:08:15Z',
    medium_url: 'https://medium.com/loblaw-digital/unlocking-experimentation-with-helios-recommendation-engine-ff91d697b943',
    thumbnail_url: 'https://miro.medium.com/v2/resize:fit:1200/1*m_8gxkI8M7xoVDmdwifKhw.png',
    tags: ['Recommenders', 'MLOps', 'Experimentation']
  },
  {
    id: 'enriching-the-online-shopping-experience-with-helios-recommendation-engine-dc85d80ca688',
    title: 'Enriching the online shopping experience with Helios Recommendation Engine',
    author: 'Alex Yip',
    excerpt: 'Co-authored by: JC Seok, Mefta Sadat, Alex Yip, Indrani Gorti, Julia Lee. Transforming retail e-commerce recommendations at scale.',
    published_at: '2023-06-26T17:01:57Z',
    medium_url: 'https://medium.com/loblaw-digital/enriching-the-online-shopping-experience-with-helios-recommendation-engine-dc85d80ca688',
    thumbnail_url: 'https://miro.medium.com/v2/resize:fit:1200/1*tEMfO2p9c_fJBJfa2TJDXg.png',
    tags: ['Machine Learning', 'E-Commerce', 'Personalization']
  }
]
