import { useEffect, useState } from 'react'
import '../styles/PortfolioPage.css'

function PortfolioPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Add loading indicator while iframe loads
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="portfolio-page">
      <div className="iframe-container">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading Portfolio...</p>
          </div>
        )}
        <iframe 
          src="https://spaceplushy.github.io/ProfessionalPortfolio/" 
          title="Professional Portfolio"
          className={loading ? 'loading' : 'loaded'}
        />
      </div>
    </div>
  )
}

export default PortfolioPage
