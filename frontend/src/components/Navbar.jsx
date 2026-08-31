// src/components/Navbar.jsx

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__brand">
        📚 The Book Store
      </NavLink>

      <div className="navbar__links">
        <NavLink to="/" end className={navClass}>
          Home
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/profile" className={navClass}>
              Profile
            </NavLink>
            <span className="navbar__hello">Hi, {user?.name?.split(' ')[0]}</span>
            <button className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/register" className={navClass}>
              Register
            </NavLink>
            <NavLink to="/login" className={navClass}>
              Login
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

function navClass({ isActive }) {
  return 'navbar__link' + (isActive ? ' navbar__link--active' : '');
}
