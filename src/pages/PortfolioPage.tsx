import { useState, useEffect } from 'react'
import '../styles/PortfolioPage.css'

function PortfolioPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  // Sample portfolio projects
  const projects = [
    {
      id: 1,
      title: 'Rotating Cube',
      description: 'A 3D interactive cube using Three.js with rotation controls',
      tags: ['React', 'Three.js', 'TypeScript']
    },
    {
      id: 2,
      title: 'Snake Game',
      description: 'Classic snake game with modern UI',
      tags: ['JavaScript', 'Canvas API', 'CSS']
    },
    {
      id: 3,
      title: 'Rubik\'s Cube Simulator',
      description: 'Interactive 3D Rubik\'s cube simulator with solving algorithms',
      tags: ['Three.js', 'WebGL', 'React']
    }
  ]

  return (
    <div className="portfolio-page">
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Portfolio...</p>
        </div>
      ) : (
        <div className="portfolio-content">
          <h1>My Portfolio</h1>
          <p className="portfolio-intro">
            Welcome to my portfolio! Here you'll find a collection of my recent projects 
            and experiments with web technologies, 3D graphics, and interactive applications.
          </p>
          
          <div className="projects-grid">
            {projects.map(project => (
              <div className="project-card" key={project.id}>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div className="tags">
                  {project.tags.map(tag => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioPage
