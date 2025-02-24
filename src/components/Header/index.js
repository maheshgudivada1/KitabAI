import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import './index.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [hasLoginAttempted, setHasLoginAttempted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginSuccess = (response) => {
    setUser(response);
    setLoginStatus('success');
    setHasLoginAttempted(true);
    setIsModalOpen(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 2000);
  };

  const handleLoginFailure = (error) => {
    setLoginStatus('failure');
    setHasLoginAttempted(true);
    setIsModalOpen(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 2000);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setHasLoginAttempted(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setLoginStatus(null);
    setIsLogoutModalOpen(true);
    setTimeout(() => {
      setIsLogoutModalOpen(false);
    }, 10000);
  };

  window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.style.backdropFilter = 'blur(15px)';
    } else {
      header.style.backdropFilter = 'blur(10px)';
    }
  });

  return (
    <header className="header">
      <div className="left-options">
        <Link to="/" className="logo">KitabAI</Link>

        <Link to="/about" className="option1">About</Link>
        <Link to="/publications" className="option1">Publications</Link>
        <Link to="/students" className="option1">Students</Link>
        <Link to="/teachers" className="option1">Teachers</Link>
        <Link to="/institutions" className="option1">Institutions</Link>
      </div>

      <div className="hamburger-icon" onClick={toggleMenu}>
        <span>&#9776;</span>
      </div>

      <nav className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/publications" className="option">Publications</Link>
        <Link to="/about" className="option">About</Link>
        <Link to="/students" className="option">Students</Link>
        <Link to="/teachers" className="option">Teachers</Link>
        <Link to="/institutions" className="option">Institutions</Link>
        <Link to="/help" className="option">Help</Link>

        {/* Render Sign In or Logout button in mobile menu */}
        {!user ? (
          <button className="signin-button" onClick={openModal}>Sign In</button>
        ) : (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        )}
      </nav>

      {/* Render Sign In or Logout button in header */}
      <div className="right-options">
        {/* Only one button for Sign In or Logout should show up */}
        {!user ? (
          <>
            <Link to="/help" className="option">Help</Link>
            <button className="signin-button" onClick={openModal}>Sign In</button>
          </>
        ) : (
          <>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>


      {/* Modal for Google Sign-In */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>X</button>
            {hasLoginAttempted ? (
              <>
                <h2>{loginStatus === 'success' ? 'Login Successful!' : 'Login Failed'}</h2>
                <p>{loginStatus === 'success' ? 'You have successfully logged in.' : 'There was an error logging in. Please try again.'}</p>
              </>
            ) : (
              <h2>Sign In</h2>
            )}
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
              useOneTap
              size="large"
              shape="pill"
              width="auto"
            />
          </div>
        </div>
      )}

      {/* Logout Success Modal */}
      {isLogoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsLogoutModalOpen(false)}>X</button>
            <h2>Successfully Logged Out!</h2>
            <p>You have been logged out successfully.</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
