// Lógica de la página: validación, simulación de rastreo y flujo de pago (simulado)
(function(){
  const form = document.getElementById('track-form');
  const orderInput = document.getElementById('order-number');
  const locationSelect = document.getElementById('location');
  const classroomGroup = document.getElementById('classroom-group');
  const classroomInput = document.getElementById('classroom');
  const statusBox = document.getElementById('status-box');
  const appLogo = document.getElementById('app-logo-large');
  const btnBalance = document.getElementById('btn-balance');
  const balanceAmountEl = document.getElementById('balance-amount');
  const balanceActions = document.getElementById('balance-actions');

  // Auth overlay elements
  const authOverlay = document.getElementById('auth-overlay');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const authMessage = document.getElementById('auth-message');
  const toRegisterBtn = document.getElementById('to-register');
  const toLoginBtn = document.getElementById('to-login');

  // Helper to show auth messages
  function showAuthMessage(msg){
    if(authMessage) authMessage.textContent = msg || '';
  }

  // Helper to show/hide the auth overlay safely
  function hideAuthOverlay(){
    if(!authOverlay) return;
    authOverlay.classList.add('d-none');
    authOverlay.setAttribute('aria-hidden','true');
  }
  function showAuthOverlay(){
    if(!authOverlay) return;
    authOverlay.classList.remove('d-none');
    authOverlay.setAttribute('aria-hidden','false');
  }

  // Initialize users list (persistent). Add demo admin account if no users exist.
  let users = [];
  try{ users = JSON.parse(localStorage.getItem('gravgo_users') || 'null') || []; }catch(e){ users = []; }
  if(!Array.isArray(users) || users.length === 0){
    const demo = { name: 'Admin', email: 'admin@ufm.edu', password: 'admin', balance: 20.00 };
    users = [demo];
    localStorage.setItem('gravgo_users', JSON.stringify(users));
  }

  // Check if there's a logged user (session) in localStorage
  let storedUser = null;
  try{ 
    const userData = localStorage.getItem('gravgo_user');
    if (userData) {
      storedUser = JSON.parse(userData);
      // Verificar que el usuario exista en la lista de usuarios
      const userExists = users.find(u => u.email === storedUser.email);
      if (userExists) {
        // Usuario válido: actualizar saldo y ocultar overlay
        userBalance = +(storedUser.balance || userBalance).toFixed(2);
        if(balanceAmountEl) balanceAmountEl.textContent = `S/ ${userBalance.toFixed(2)}`;
        hideAuthOverlay();
      } else {
        // Usuario no encontrado en la lista: limpiar sesión
        localStorage.removeItem('gravgo_user');
        showAuthOverlay();
      }
    } else {
      // No hay sesión: mostrar overlay
      showAuthOverlay();
    }
  } catch(e) { 
    console.error('Error checking user session:', e);
    showAuthOverlay();
  }

  // Switch to register tab from login
  if(toRegisterBtn){
    toRegisterBtn.addEventListener('click', ()=>{
      const registerTab = document.querySelector('#register-tab');
      if(registerTab) registerTab.click();
    });
  }
  if(toLoginBtn){
    toLoginBtn.addEventListener('click', ()=>{
      const loginTab = document.querySelector('#login-tab');
      if(loginTab) loginTab.click();
    });
  }

  // Register handler
  if(registerForm){
    registerForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = (document.getElementById('reg-name')||{}).value || '';
      const email = (document.getElementById('reg-email')||{}).value || '';
      const pwd = (document.getElementById('reg-password')||{}).value || '';
      if(!name || !email || !pwd){ showAuthMessage('Completa todos los campos para registrarte.'); return; }

      // Create user (in production, send to backend)
      const newUser = { name:name.trim(), email:email.trim().toLowerCase(), password:pwd, balance: userBalance };
      // Add to users list
      try{
        const existing = users.find(u => u.email === newUser.email);
        if(existing){ showAuthMessage('Ya existe una cuenta con ese correo.'); return; }
        users.push(newUser);
        localStorage.setItem('gravgo_users', JSON.stringify(users));
        // set as logged in (session)
        localStorage.setItem('gravgo_user', JSON.stringify(newUser));
      }catch(e){ console.error(e); }
      showAuthMessage('Registro exitoso. Iniciando sesión…');
      // set balance and hide overlay
      userBalance = +(newUser.balance || userBalance).toFixed(2);
      if(balanceAmountEl) balanceAmountEl.textContent = `S/ ${userBalance.toFixed(2)}`;
      setTimeout(()=>{ hideAuthOverlay(); showAuthMessage(''); }, 800);
    });
  }

  // Login handler
  if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = (document.getElementById('login-email')||{}).value || '';
      const pwd = (document.getElementById('login-password')||{}).value || '';
      if(!email || !pwd){ showAuthMessage('Introduce correo y contraseña.'); return; }

  // Find user in users list
  const found = users.find(u => u.email === email.trim().toLowerCase() && u.password === pwd);
  if(!found){ showAuthMessage('Correo o contraseña incorrectos.'); return; }
  
  // Login successful: set session
  try{ 
    localStorage.setItem('gravgo_user', JSON.stringify(found));
    showAuthMessage('Login correcto. Cargando…');
    userBalance = +(found.balance || userBalance).toFixed(2);
    if(balanceAmountEl) balanceAmountEl.textContent = `S/ ${userBalance.toFixed(2)}`;
    // Asegurarse de que el overlay se oculte
    setTimeout(() => {
      hideAuthOverlay();
      showAuthMessage('');
    }, 600);
  } catch(e) {
    console.error('Error setting user session:', e);
    showAuthMessage('Error al iniciar sesión. Intenta de nuevo.');
  }
    });
  }

  // Simulated user balance (Soles) - puede venir del backend en producción
  let userBalance = 8.50; // ejemplo inicial
  const deliveryFee = 5.00;

  // Mostrar/ocultar campo de aula
  locationSelect.addEventListener('change', ()=>{
    if(locationSelect.value === 'aula') classroomGroup.classList.remove('hidden');
    else classroomGroup.classList.add('hidden');
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const orderNumber = orderInput.value.trim();
    if(!orderNumber){
      showStatus('Por favor ingresa un número de pedido válido.', 'error');
      return;
    }

    // Mostrar estado de búsqueda
    showStatus('Buscando pedido en PedidosYa…', 'loading');

    // Simulación de llamada a API: reemplazar por fetch real a PedidosYa
    // Ejemplo (comentado):
    /*
    fetch('https://api.pedidosya.example/orders/' + encodeURIComponent(orderNumber), {
      headers:{ 'Authorization':'Bearer YOUR_TOKEN_HERE' }
    })
    .then(r=>r.json())
    .then(data => handleApiResult(data))
    */

    setTimeout(()=>{
      // Simular distintos estados: "en_preparacion", "en_camino", "llegado"
      const states = ['En preparación', 'En camino', 'Llegó a la universidad'];
      const pick = Math.floor(Math.random()*3);
      const text = states[pick];

      if(pick < 2){
        showStatus(`Estado del pedido: ${text}. Te avisaremos cuando llegue a la universidad.`, 'info');
      } else {
        // Si llegó, pedir pago de fee y confirmar entrega
        showArrivalFlow(orderNumber);
      }
    }, 1400 + Math.random()*1200);
  });

  function showStatus(message, type){
    statusBox.classList.remove('hidden');
    statusBox.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = message;
    statusBox.appendChild(p);
    if(type === 'loading') statusBox.style.borderLeft = '4px solid var(--orange)';
    else statusBox.style.borderLeft = '4px solid transparent';
  }

  function showArrivalFlow(orderNumber){
    statusBox.classList.remove('hidden');
    statusBox.innerHTML = '';
    const h = document.createElement('h3');
    h.textContent = 'Tu pedido llegó a la universidad 🎉';
    const p = document.createElement('p');
    p.textContent = 'Selecciona el punto y confirma el pago de la tarifa para que te lo entreguemos.';

    const payBtn = document.createElement('button');
    payBtn.className = 'btn btn-orange';
    payBtn.textContent = `Pagar tarifa de entrega (S/ ${deliveryFee.toFixed(2)})`;
    payBtn.addEventListener('click', ()=>{
      // Verificar saldo antes de procesar
      if(userBalance >= deliveryFee){
        payBtn.disabled = true;
        payBtn.textContent = 'Procesando pago…';
        setTimeout(()=>{
          // descontar saldo
          userBalance = +(userBalance - deliveryFee).toFixed(2);
          payBtn.textContent = 'Pago confirmado';
          showStatus(`Pago recibido. Saldo restante: S/ ${userBalance.toFixed(2)}. Preparando entrega en el punto seleccionado. Te entregaremos en 5-10 min.`, 'success');
          // actualizar modal si está abierto
          if(balanceAmountEl) balanceAmountEl.textContent = `S/ ${userBalance.toFixed(2)}`;
        }, 1400);
      } else {
        // Saldo insuficiente: mostrar mensaje y ofrecer recarga rápida
        const deficit = (deliveryFee - userBalance).toFixed(2);
        showStatus(`Saldo insuficiente (falta S/ ${deficit}). Puedes recargar para pagar la tarifa.`, 'error');
        // Ofrecer botón de recarga rápida
        const topUpBtn = document.createElement('button');
        topUpBtn.className = 'btn btn-outline-primary mt-2';
        topUpBtn.textContent = 'Recargar S/ 10';
        topUpBtn.addEventListener('click', ()=>{
          userBalance = +(userBalance + 10).toFixed(2);
          if(balanceAmountEl) balanceAmountEl.textContent = `S/ ${userBalance.toFixed(2)}`;
          showStatus(`Recarga exitosa. Nuevo saldo: S/ ${userBalance.toFixed(2)}. Vuelve a pulsar "Pagar tarifa" para completar.`, 'success');
          topUpBtn.remove();
        });
        statusBox.appendChild(topUpBtn);
      }
    });

    statusBox.appendChild(h);
    statusBox.appendChild(p);
    statusBox.appendChild(payBtn);
  }

  // Muestra el modal con el saldo cuando se pulsa el botón en la nav
  if(btnBalance){
    btnBalance.addEventListener('click', ()=>{
      if(balanceAmountEl) balanceAmountEl.textContent = `S/ ${userBalance.toFixed(2)}`;
      if(balanceActions) {
        balanceActions.innerHTML = '';
        // Añadir acción rápida: recargar S/10
        const quickTopUp = document.createElement('button');
        quickTopUp.className = 'btn btn-sm btn-outline-primary';
        quickTopUp.textContent = 'Recargar S/ 10';
        quickTopUp.addEventListener('click', ()=>{
          userBalance = +(userBalance + 10).toFixed(2);
          if(balanceAmountEl) balanceAmountEl.textContent = `S/ ${userBalance.toFixed(2)}`;
          quickTopUp.textContent = 'Recarga +S/10 aplicada';
          setTimeout(()=> quickTopUp.textContent = 'Recargar S/ 10', 1400);
        });
        balanceActions.appendChild(quickTopUp);
      }

      // Usar la API de Bootstrap para abrir modal
      const modalEl = document.getElementById('balanceModal');
      if(modalEl && window.bootstrap){
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      } else {
        alert(`Saldo: S/ ${userBalance.toFixed(2)}`);
      }
    });
  }

  // Si más adelante conectas con el API real, implementa handleApiResult
  function handleApiResult(data){
    // Ejemplo de estructura esperada (ajusta según la API real):
    // { status: 'in_transit'|'delivered'|'preparing', location: {...} }
    if(!data) return showStatus('No se encontró el pedido.', 'error');

    if(data.status === 'delivered' || data.status === 'arrived'){
      showArrivalFlow(data.id || '');
    } else if(data.status === 'in_transit'){
      showStatus('En camino. Estimación: ' + (data.eta || '—'), 'info');
    } else {
      showStatus('El pedido está en preparación.', 'info');
    }
  }

  // Allow replacing the placeholder logo by drag-and-drop (UX convenience)
  appLogo.addEventListener('dragover', (e)=>{ e.preventDefault(); appLogo.style.opacity = 0.85; });
  appLogo.addEventListener('dragleave', ()=>{ appLogo.style.opacity = 1; });
  appLogo.addEventListener('drop', (e)=>{
    e.preventDefault(); appLogo.style.opacity = 1;
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      // Si dentro del contenedor hay una etiqueta <img>, actualizar su src; si no, usar background
      const innerImg = appLogo.querySelector && appLogo.querySelector('img');
      if(innerImg){
        innerImg.src = reader.result;
        innerImg.style.objectFit = 'cover';
      } else {
        appLogo.style.backgroundImage = `url(${reader.result})`;
        appLogo.style.backgroundSize = 'cover';
        appLogo.textContent = '';
      }
    }
    reader.readAsDataURL(f);
  });
})();