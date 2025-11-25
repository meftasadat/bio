import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../lib/api.js'
import './Resume.css'

function Resume() {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/static/resume.txt`)
                const text = await response.text()
                setContent(text)
            } catch (err) {
                console.error('Failed to load resume', err)
                setContent('Error loading resume.')
            } finally {
                setLoading(false)
            }
        }
        fetchResume()
    }, [])

    return (
        <section className="resume-page">
            <h1 className="resume-title">Resume</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <pre className="resume-content">{content}</pre>
            )}
            <a
                href={`${API_BASE_URL}/static/resume.txt`}
                download="Mefta_Sadat_Resume.txt"
                className="btn btn-primary resume-download"
            >
                Download Resume
            </a>
        </section>
    )
}

export default Resume
