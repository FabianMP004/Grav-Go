import React, { useEffect, useState } from 'react';
import './App.css';
import AuthPages from './pages/AuthPages';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tracker from './components/Tracker';
import BalanceModal from './components/BalanceModal';

function App(){
  const [currentUser, setCurrentUser] = useState(null);
  const [balance, setBalance] = useState(8.5);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  // users list (persistent)
  const [users, setUsers] = useState(() => {
    try{
      const u = JSON.parse(localStorage.getItem('gravgo_users') || 'null') || [];
      if(!Array.isArray(u) || u.length === 0){
        const demo = { name: 'Admin', email: 'admin@ufm.edu', password: 'admin', balance: 20.00 };
        localStorage.setItem('gravgo_users', JSON.stringify([demo]));
        return [demo];
      }
      return u;
    }catch(e){ return []; }
  });

  // load session on mount (token + user stored after login)
  useEffect(()=>{
    try{
      const su = JSON.parse(localStorage.getItem('gravgo_user') || 'null');
      if(su){ setCurrentUser(su); setBalance(+(su.balance || 8.5)); }
    }catch(e){ console.error(e); }
  },[]);

  // handlers passed to components
  const handleAuthSuccess = (user, token) => {
    if(!user) return;
    setCurrentUser(user);
    setBalance(+(user.balance || balance));
    localStorage.setItem('gravgo_user', JSON.stringify(user));
    localStorage.setItem('gravgo_token', token);
    // ensure the logged user is present in the users list
    try{
      const exists = users.find(u => u.email === user.email);
      if(!exists){
        const updated = [...users, user];
        setUsers(updated);
        localStorage.setItem('gravgo_users', JSON.stringify(updated));
      }
    }catch(e){ /* noop */ }
  }

  const handleTopUp = (amount) => {
    const newBal = +(balance + amount).toFixed(2);
    setBalance(newBal);
    // update user session and users list
    if(currentUser){
      const updatedUser = { ...currentUser, balance: newBal };
      setCurrentUser(updatedUser);
      localStorage.setItem('gravgo_user', JSON.stringify(updatedUser));
      const updatedUsers = users.map(u => u.email === updatedUser.email ? updatedUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('gravgo_users', JSON.stringify(updatedUsers));
    }
  }

  const handlePay = (amount) => {
    const newBal = +(Math.max(0, balance - amount)).toFixed(2);
    setBalance(newBal);
    if(currentUser){
      const updatedUser = { ...currentUser, balance: newBal };
      setCurrentUser(updatedUser);
      localStorage.setItem('gravgo_user', JSON.stringify(updatedUser));
      const updatedUsers = users.map(u => u.email === updatedUser.email ? updatedUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('gravgo_users', JSON.stringify(updatedUsers));
    }
  }

  // If user is not authenticated, show the auth pages exclusively
  if(!currentUser){
    return (
      <div className="App-root">
        <AuthPages onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="App-root">
      <Navbar onShowBalance={() => setShowBalanceModal(true)} currentUser={currentUser} />
      <Hero onShowBalance={() => setShowBalanceModal(true)} />

      <main>
        <Tracker userBalance={balance} onTopUp={handleTopUp} onPay={handlePay} />
      </main>

      <BalanceModal visible={showBalanceModal} balance={balance} onTopUp={handleTopUp} onClose={() => setShowBalanceModal(false)} />
    </div>
  );
}

export default App;
