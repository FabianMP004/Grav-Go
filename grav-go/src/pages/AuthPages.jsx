import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
// shared auth styles (card, buttons)
import '../components/AuthOverlay/styles.css';
import './AuthPages.css';
import facebookLogo from '../assets/icons8-facebook-nuevo-50.png';
import twitterLogo from '../assets/icons8-x-50.png';
import instagramLogo from '../assets/icons8-instagram-48.png';

export default function AuthPages({ onAuthSuccess }){
  const [mode, setMode] = useState('login');

  const handleLogin = (user, token) => {
    // store token
    localStorage.setItem('gravgo_token', token);
    localStorage.setItem('gravgo_user', JSON.stringify(user));
    onAuthSuccess && onAuthSuccess(user, token);
  }

  const handleRegistered = (user) => {
    // optional: you could show toast; here we just switch to login
  }

  return (
    <div className="auth-page-container">
      <div className="auth-page-background">
        <div className="auth-page-lightray-1"></div>
        <div className="auth-page-lightray-2"></div>
        <div className="auth-page-lightray-3"></div>
      </div>
      <div className="auth-page-content">
        <div className="auth-page-left">
          <div className="auth-page-welcome">
            <h1>Grav-Go</h1>
            <p>Recibe tus pedidos en la universidad con un simple clic. Tu delivery favorito, ahora más cercano.</p>
            <div className="auth-social-links">
              <a href="#facebook" aria-label="Facebook"><img src={facebookLogo} alt="Facebook" /></a>
              <a href="#twitter" aria-label="Twitter"><img src={twitterLogo} alt="Twitter" /></a>
              <a href="https://www.instagram.com/gravand.go/" aria-label="Instagram"><img src={instagramLogo} alt="Instagram" /></a>
            </div>
          </div>
        </div>
        
        <div className="auth-page-right">
          {mode === 'login' ? (
            <LoginForm onLogin={handleLogin} switchToRegister={()=>setMode('register')} />
          ) : (
            <RegisterForm onRegistered={handleRegistered} switchToLogin={()=>setMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
