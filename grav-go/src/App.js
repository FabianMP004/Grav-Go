import React, { useEffect, useState } from 'react';
import './App.css';
import AuthOverlay from './components/AuthOverlay';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tracker from './components/Tracker';
import BalanceModal from './components/BalanceModal';

function App(){
  // users and session persisted in localStorage to mirror the previous implementation
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [balance, setBalance] = useState(8.5);
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  // load users and session on mount
  useEffect(()=>{
    try{
      const u = JSON.parse(localStorage.getItem('gravgo_users') || 'null') || [];
      if(!Array.isArray(u) || u.length === 0){
        const demo = { name: 'Admin', email: 'admin@ufm.edu', password: 'admin', balance: 20.00 };
        localStorage.setItem('gravgo_users', JSON.stringify([demo]));
        setUsers([demo]);
      } else {
        setUsers(u);
      }
    }catch(e){ console.error(e); setUsers([]); }

    try{
      const su = JSON.parse(localStorage.getItem('gravgo_user') || 'null');
      if(su){
        setCurrentUser(su);
        setBalance(+(su.balance || 8.5));
      }
    }catch(e){ console.error(e); }
  },[]);

  // handlers passed to components
  const handleLogin = (found) => {
    if(!found) return;
    setCurrentUser(found);
    setBalance(+(found.balance || balance));
    localStorage.setItem('gravgo_user', JSON.stringify(found));
  }

  const handleRegister = (newUser) => {
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('gravgo_users', JSON.stringify(updated));
    // set session
    setCurrentUser(newUser);
    setBalance(+(newUser.balance || balance));
    localStorage.setItem('gravgo_user', JSON.stringify(newUser));
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

  return (
    <div className="App-root">
      <Navbar onShowBalance={() => setShowBalanceModal(true)} currentUser={currentUser} />
      <Hero onShowBalance={() => setShowBalanceModal(true)} />

      <main>
        <Tracker userBalance={balance} onTopUp={handleTopUp} onPay={handlePay} />
      </main>

      <BalanceModal visible={showBalanceModal} balance={balance} onTopUp={handleTopUp} onClose={() => setShowBalanceModal(false)} />

      <AuthOverlay visible={!currentUser} users={users} onLogin={handleLogin} onRegister={handleRegister} />
    </div>
  );
}

export default App;
