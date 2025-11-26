import { useState, useEffect } from 'react'
import './Hero.css'
import ParticleBackground from './ParticleBackground'

function Hero({ data }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!data?.summary) return

    if (currentIndex < data.summary.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + data.summary[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50) // 50ms delay between each character

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, data?.summary])

  // Reset animation when data changes
  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
  }, [data?.summary])

  if (!data) return null

  return (
    <section className="hero">
      <ParticleBackground />
      <div className="hero-content">
        <h1 className="hero-title">
          Hi, I'm <span className="highlight">{data.name}</span>
        </h1>
        <h2 className="hero-subtitle">{data.title}</h2>
        <p className="hero-description">
          {displayedText}
          <span className="typing-cursor">|</span>
        </p>
        <div className="hero-actions">
          <a href="#talks" className="btn btn-primary">Watch My Talks</a>
        </div>
      </div>


    </section>


  )
}

export default Hero
