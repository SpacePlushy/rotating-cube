import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="main-navigation">
      <div className="nav-logo">
        <Link to="/">SpacePlushy</Link>
      </div>
      <ul className="nav-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Rotating Cube</Link>
        </li>
        <li className={location.pathname === '/portfolio' ? 'active' : ''}>
          <Link to="/portfolio">Portfolio</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
