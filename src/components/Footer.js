import React from 'react';
import './Footer.css';  // CSS for the footer component

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h4>Get the Latest from YINYANG</h4>
        <input type="email" placeholder="Enter your email" />
        <button>Sign Up</button>
      </div>
      <div className="footer-links">
        <a href="#">About Us</a>
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
      </div>
    </footer>
  );
};

export default Footer;
