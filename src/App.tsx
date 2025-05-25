import { useState, useEffect } from 'react'
import './App.css'
import CubePage from './pages/CubePage'
import SnakePage from './pages/SnakePage'

type Page = 'home' | 'snake'

function App() {
  const [lightMode, setLightMode] = useState(false)
  const [page, setPage] = useState<Page>('home')

  useEffect(() => {
    document.body.classList.toggle('light-mode', lightMode)
  }, [lightMode])

  return (
    <div className="app">
      <header>
        <h1>3D Rotating Cube</h1>
        <nav className="mainNav">
          <button onClick={() => setPage('home')}>Home</button>
          <button onClick={() => setPage('snake')}>Snake</button>
        </nav>
        <button
          className="lightToggleBtn"
          onClick={() => setLightMode(prev => !prev)}
          data-testid="light-mode-toggle"
        >
          {lightMode ? 'Dark Mode' : 'Light Mode'}
        </button>
      </header>
      {page === 'home' && <CubePage />}
      {page === 'snake' && <SnakePage />}
    </div>
  )
}

export default App
