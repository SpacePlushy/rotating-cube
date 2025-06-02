import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Pages
import HomePage from './pages/HomePage'
import PortfolioPage from './pages/PortfolioPage'
import CubePage from './pages/CubePage'
import SnakePage from './pages/SnakePage'

// Components
import Navigation from './components/Navigation/Navigation'

function App() {
  const [lightMode, setLightMode] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('light-mode', lightMode)
  }, [lightMode])

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <button
          className="lightToggleBtn global-light-toggle"
          onClick={() => setLightMode(prev => !prev)}
          data-testid="light-mode-toggle"
        >
          {lightMode ? 'Dark Mode' : 'Light Mode'}
        </button>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/cube" element={<CubePage />} />
          <Route path="/snake" element={<SnakePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
