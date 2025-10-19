import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-left"></div>
      <div className="nav-right">
        <Link to="/tripbuilder">
            <button className="journey-btn">Start Your Journey</button>
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
