import React, { useEffect, useState } from 'react';
import './App.css';
import AuthPages from './pages/AuthPages';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tracker from './components/Tracker';
import BalanceModal from './components/BalanceModal';

function App(){
  const [currentUser, setCurrentUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // load session on mount (token + user stored after login)
  useEffect(()=>{
    const loadUserSession = async () => {
      try{
        const token = localStorage.getItem('gravgo_token');
        const storedUser = JSON.parse(localStorage.getItem('gravgo_user') || 'null');
        
        if(token && storedUser){
          // Try to fetch current user data from backend to get latest balance
          try{
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/auth/me`, {
              method: 'GET',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            
            if(res.ok){
              const data = await res.json();
              const user = data.user;
              setCurrentUser(user);
              setBalance(+(user.balance || 0));
              localStorage.setItem('gravgo_user', JSON.stringify(user));
            } else {
              // If token is invalid, use stored user but with balance 0
              setCurrentUser({ ...storedUser, balance: 0 });
              setBalance(0);
            }
          } catch(err){
            console.error('Error fetching user from backend:', err);
            // Fallback to stored user, but default balance to 0
            setCurrentUser({ ...storedUser, balance: storedUser.balance || 0 });
            setBalance(+(storedUser.balance || 0));
          }
        }
      }catch(e){ 
        console.error('Error loading session:', e); 
      } finally {
        setLoadingUser(false);
      }
    };
    
    loadUserSession();
  },[]);

  // handlers passed to components
  const handleAuthSuccess = (user, token) => {
    if(!user) return;
    setCurrentUser(user);
    setBalance(+(user.balance || 0));
    localStorage.setItem('gravgo_user', JSON.stringify(user));
    localStorage.setItem('gravgo_token', token);
  }

  const handleTopUp = async (amount) => {
    // Try to perform top-up on backend; fallback to local update if network fails
    if(!currentUser){
      throw new Error('No user logged in');
    }
    try{
      const token = localStorage.getItem('gravgo_token');
      if(!token){
        throw new Error('No hay token de autenticación');
      }
      
      console.log('TopUp request:', { email: currentUser.email, amount });
      
      // Use direct URL to backend since proxy is not working reliably
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${apiUrl}/api/auth/topup`;
      
      console.log('TopUp endpoint:', endpoint);
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: currentUser.email, amount })
      });
      
      if (!res) {
        throw new Error('No se pudo conectar al servidor. Verifica que el servidor backend esté corriendo en el puerto 5000.');
      }
      
      console.log('TopUp response status:', res.status, res.statusText);
      console.log('TopUp response headers:', res.headers.get('content-type'));
      
      // Get response text first to see what we're dealing with
      const responseText = await res.text();
      console.log('TopUp raw response:', responseText.substring(0, 500));
      
      // Check content type
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response received. Content-Type:', contentType);
        console.error('Response text:', responseText.substring(0, 500));
        throw new Error(`El servidor devolvió una respuesta no válida (Content-Type: ${contentType}). Verifica los logs del servidor. Status: ${res.status}`);
      }
      
      let data = null;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        console.error('Response text was:', responseText);
        console.error('Response status:', res.status);
        console.error('Response headers:', Array.from(res.headers.entries()));
        throw new Error(`Error al procesar la respuesta del servidor. El servidor devolvió: ${responseText.substring(0, 100)}`);
      }
      
      if(!res.ok){
        const errorMsg = (data && (data.message || (data.errors && data.errors[0] && data.errors[0].msg))) || `Error ${res.status}`;
        console.error('TopUp error response:', errorMsg, data);
        throw new Error(errorMsg);
      }
      
      // data.user contains updated user
      if(!data || !data.user){
        console.error('Invalid response data:', data);
        throw new Error('Respuesta inválida del servidor');
      }
      
      const updatedUser = data.user;
      const newBal = +(updatedUser.balance || 0);
      console.log('Balance actualizado:', newBal, 'Usuario:', updatedUser);
      setBalance(newBal);
      setCurrentUser(updatedUser);
      localStorage.setItem('gravgo_user', JSON.stringify(updatedUser));
      return updatedUser;
    }catch(err){
      console.error('TopUp failed:', err);
      // Provide more helpful error message
      if (err.message.includes('Failed to fetch') || err.message.includes('fetch')) {
        throw new Error('No se pudo conectar al servidor. Por favor, verifica que el servidor backend esté corriendo en el puerto 5000.');
      }
      throw err;
    }
  }

  const handlePay = async (amount) => {
    if(!currentUser) return;
    
    try{
      // Update balance in backend
      const token = localStorage.getItem('gravgo_token');
      const res = await fetch('/api/auth/topup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: currentUser.email, amount: -amount })
      });
      
      if(res.ok){
        const data = await res.json();
        const updatedUser = data.user;
        const newBal = +(updatedUser.balance || 0);
        setBalance(newBal);
        setCurrentUser(updatedUser);
        localStorage.setItem('gravgo_user', JSON.stringify(updatedUser));
      } else {
        // Fallback: update locally if backend fails
        const newBal = +(Math.max(0, balance - amount)).toFixed(2);
        setBalance(newBal);
        const updatedUser = { ...currentUser, balance: newBal };
        setCurrentUser(updatedUser);
        localStorage.setItem('gravgo_user', JSON.stringify(updatedUser));
      }
    } catch(err){
      console.error('Error updating balance after payment:', err);
      // Fallback: update locally
      const newBal = +(Math.max(0, balance - amount)).toFixed(2);
      setBalance(newBal);
      const updatedUser = { ...currentUser, balance: newBal };
      setCurrentUser(updatedUser);
      localStorage.setItem('gravgo_user', JSON.stringify(updatedUser));
    }
  }

  const handleLogout = () => {
    // clear session and token
    localStorage.removeItem('gravgo_user');
    localStorage.removeItem('gravgo_token');
    setCurrentUser(null);
  }

  // Show loading state while checking authentication
  if(loadingUser){
    return (
      <div className="App-root" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
        <div>Cargando...</div>
      </div>
    );
  }

  // If user is not authenticated, show the auth pages exclusively
  if(!currentUser){
    return (
      <div className="App-root">
        <AuthPages onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  const toggleTracker = () => {
    setShowTracker(prev => !prev);
  };

  return (
    <div className="App-root">
      <Navbar onShowBalance={() => setShowBalanceModal(true)} currentUser={currentUser} onLogout={handleLogout} />
      <Hero 
        onShowBalance={() => setShowBalanceModal(true)} 
        onToggleTracker={toggleTracker}
        showTracker={showTracker}
      />

      <main>
        {showTracker && (
          <Tracker userBalance={balance} onTopUp={handleTopUp} onPay={handlePay} />
        )}
      </main>

      <BalanceModal visible={showBalanceModal} balance={balance} onTopUp={handleTopUp} onClose={() => setShowBalanceModal(false)} />
    </div>
  );
}

export default App;
