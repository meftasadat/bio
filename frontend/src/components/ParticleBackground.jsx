import { useEffect, useRef } from 'react'
import './ParticleBackground.css'

function ParticleBackground() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        let animationFrameId
        let particles = []

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.vx = (Math.random() - 0.5) * 0.5
                this.vy = (Math.random() - 0.5) * 0.5
                this.radius = Math.random() * 2 + 1
                this.opacity = Math.random() * 0.5 + 0.3
            }

            update() {
                this.x += this.vx
                this.y += this.vy

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width
                if (this.x > canvas.width) this.x = 0
                if (this.y < 0) this.y = canvas.height
                if (this.y > canvas.height) this.y = 0
            }

            draw() {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`
                ctx.fill()
            }
        }

        // Create particles
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 100)
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle())
        }

        // Draw connections between nearby particles
        const drawConnections = () => {
            const maxDistance = 150
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.3
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
                        ctx.lineWidth = 1
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
            }
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            particles.forEach(particle => {
                particle.update()
                particle.draw()
            })

            // Draw connections
            drawConnections()

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return <canvas ref={canvasRef} className="particle-background" />
}

export default ParticleBackground
