import { NavLink, Link } from 'react-router-dom';
import { PenSquare, Home } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-accent">Mini</span>Blog
        </Link>
        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <Home size={18} />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <PenSquare size={18} />
            <span>Create Post</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
