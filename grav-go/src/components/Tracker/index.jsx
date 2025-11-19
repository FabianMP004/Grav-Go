import React, { useState } from 'react';
import './styles.css';

export default function Tracker({ userBalance, onTopUp, onPay }){
  const [orderNumber, setOrderNumber] = useState('');
  const [location, setLocation] = useState('cafeteria');
  const [classroom, setClassroom] = useState('');
  const [status, setStatus] = useState('');
  const [orderTracked, setOrderTracked] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const deliveryFee = 5.00;

  const startTracking = () => {
    if(!orderNumber.trim()){ 
      setStatus('Por favor ingresa un número de pedido válido.'); 
      return; 
    }
    setOrderTracked(true);
    setStatus('Buscando pedido en PedidosYa…');
    
    // Primero mostrar "En preparación" después de 1-2 segundos
    setTimeout(()=>{
      setStatus('Estado del pedido: En preparación. Te avisaremos cuando llegue a la universidad.');
      
      // Luego mostrar "LLEGÓ" después de 5 segundos más
      setTimeout(()=>{
        setStatus('LLEGÓ');
      }, 5000);
    }, 1000 + Math.random()*1000);
  }

  const handleToggleTracking = () => {
    if (!showTracking) {
      setShowTracking(true);
      if (orderNumber.trim() && !orderTracked) {
        startTracking();
      } else if (!orderNumber.trim()) {
        setStatus('Ingresa el número de pedido para comenzar');
      }
    } else {
      // Ocultar el rastreo al hacer click nuevamente
      setShowTracking(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleToggleTracking();
  }

  const handlePayClick = () => {
    if(!location){
      setStatus('Por favor selecciona un lugar de entrega.');
      return;
    }
    if(location === 'aula' && !classroom.trim()){
      setStatus('Por favor especifica el aula o salón.');
      return;
    }
    if(userBalance >= deliveryFee){
      onPay && onPay(deliveryFee);
      const deliveryLocation = location === 'aula' ? classroom : 
        location === 'cafeteria' ? 'Cafetería' : 'Biblioteca';
      setStatus(`Pago recibido. Saldo restante: Q ${(userBalance - deliveryFee).toFixed(2)}. Preparando entrega en ${deliveryLocation}.`);
    } else {
      setStatus(`Saldo insuficiente (falta Q ${(deliveryFee - userBalance).toFixed(2)}).`);
    }
  }

  const resetTracker = () => {
    setOrderNumber('');
    setLocation('cafeteria');
    setClassroom('');
    setStatus('');
    setOrderTracked(false);
    setShowTracking(false);
  }

  return (
    <section id="rastreo" className="rastreo container">
      <div className="tracker-header">
        <h2>Rastrea tu pedido</h2>
        {orderTracked && (
          <button className="btn-reset" onClick={resetTracker}>Nuevo pedido</button>
        )}
      </div>

      <div className="track-form-row">
        <form className="track-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="order-number">Número de pedido (PedidosYa)</label>
            <input 
              id="order-number" 
              name="orderNumber" 
              value={orderNumber} 
              onChange={e=>setOrderNumber(e.target.value)} 
              type="text" 
              className="form-control" 
              placeholder="Ej: 123456789" 
            />
          </div>
          <button 
            className="btn btn-orange btn-track" 
            type="button"
            onClick={handleToggleTracking}
          >
            Rastrear pedido
          </button>
        </form>

        {showTracking && (
          <div className="tracking-process">
            <div className="status-box">
              {status === 'LLEGÓ' ? (
                <div className="arrival-status">
                  <div className="arrival-icon">🎉</div>
                  <h3>¡Tu pedido llegó a la universidad!</h3>
                  <p className="arrival-message">Selecciona el punto de entrega y confirma el pago de la tarifa.</p>
                  <div className="delivery-form">
                    <div className="form-group">
                      <label htmlFor="location">Lugar de entrega en la universidad</label>
                      <select 
                        id="location" 
                        name="location" 
                        className="form-select" 
                        value={location} 
                        onChange={e=>setLocation(e.target.value)}
                      >
                        <option value="cafeteria">Cafetería</option>
                        <option value="biblioteca">Biblioteca</option>
                        <option value="aula">Aula / Salón específico</option>
                      </select>
                    </div>
                    {location === 'aula' && (
                      <div className="form-group">
                        <label htmlFor="classroom">Especifica el aula / salón</label>
                        <input 
                          id="classroom" 
                          name="classroom" 
                          value={classroom} 
                          onChange={e=>setClassroom(e.target.value)} 
                          type="text" 
                          className="form-control" 
                          placeholder="Ej: Aula 204" 
                        />
                      </div>
                    )}
                    <div className="payment-section">
                    <div className="fee-display">
                      <span className="fee-label">Tarifa de entrega:</span>
                      <span className="fee-amount">Q {deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="balance-display">
                      <span className="balance-label">Tu saldo:</span>
                      <span className={`balance-amount ${userBalance >= deliveryFee ? 'sufficient' : 'insufficient'}`}>
                        Q {userBalance.toFixed(2)}
                        </span>
                      </div>
                      {userBalance < deliveryFee && (
                      <div className="insufficient-warning">
                        <p>Saldo insuficiente. Necesitas recargar Q {(deliveryFee - userBalance).toFixed(2)} más.</p>
                        <button className="btn btn-outline-orange" onClick={() => onTopUp && onTopUp(10)}>
                          Recargar Q 10
                          </button>
                        </div>
                      )}
                      <button 
                        className="btn btn-orange btn-pay" 
                        onClick={handlePayClick}
                        disabled={userBalance < deliveryFee}
                      >
                        Pagar tarifa de entrega
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="tracking-status">
                  <div className="status-icon">📦</div>
                  <p className="status-message">{status || 'Ingresa el número de pedido para comenzar'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
