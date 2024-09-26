import React from 'react';
import './Navbar.css';  // CSS for styling the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>YINYANG</h2>
      </div>
      <ul className="navbar-links">
        <li><a href="#">Products</a></li>
        <li><a href="#">Collections</a></li>
        <li><a href="#">Gift Ideas</a></li>
        <li><a href="#">Contact Us</a></li>
      </ul>
      <div className="navbar-icons">
        <i className="fas fa-search"></i>
        <i className="fas fa-shopping-cart"></i>
      </div>
    </nav>
  );
};

export default Navbar;
