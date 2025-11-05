import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
// shared auth styles (card, buttons)
import '../components/AuthOverlay/styles.css';

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
    <div className="App-root">
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
        <div style={{width:420,padding:18}}>
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
