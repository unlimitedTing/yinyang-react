import React from 'react';
import Navbar from './Navbar';
import './Header.css';  // Assuming you have separate CSS files

const Header = () => {
  return (
    <header className="header">
      <Navbar />
      <div className="header-banner">
        <div className="header-content">
          <h1>BLACK FRIDAY</h1>
          <p>UP TO 40%</p>
          <button>Shop Now</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
