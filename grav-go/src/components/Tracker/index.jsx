import React, { useState } from 'react';
import './styles.css';

export default function Tracker({ userBalance, onTopUp, onPay }){
  const [orderNumber, setOrderNumber] = useState('');
  const [location, setLocation] = useState('cafeteria');
  const [classroom, setClassroom] = useState('');
  const [status, setStatus] = useState('');
  const deliveryFee = 5.00;

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!orderNumber.trim()){ setStatus('Por favor ingresa un número de pedido válido.'); return; }
    setStatus('Buscando pedido en PedidosYa…');
    setTimeout(()=>{
      const states = ['En preparación', 'En camino', 'Llegó a la universidad'];
      const pick = Math.floor(Math.random()*3);
      const text = states[pick];
      if(pick < 2){ setStatus(`Estado del pedido: ${text}. Te avisaremos cuando llegue a la universidad.`); }
      else { setStatus('LLEGÓ'); }
    }, 1000 + Math.random()*1000);
  }

  const handlePayClick = () => {
    if(userBalance >= deliveryFee){
      onPay && onPay(deliveryFee);
      setStatus(`Pago recibido. Saldo restante: S/ ${(userBalance - deliveryFee).toFixed(2)}. Preparando entrega.`);
    } else {
      setStatus(`Saldo insuficiente (falta S/ ${(deliveryFee - userBalance).toFixed(2)}).`);
    }
  }

  return (
    <section id="rastreo" className="rastreo container">
      <h2>Rastrea tu pedido</h2>
      <form className="track-form" onSubmit={handleSubmit}>
        <label htmlFor="order-number">Número de pedido (PedidosYa)</label>
        <input id="order-number" name="orderNumber" value={orderNumber} onChange={e=>setOrderNumber(e.target.value)} type="text" className="form-control" placeholder="Ej: 123456789" />

        <label htmlFor="location">Lugar de entrega en la universidad</label>
        <select id="location" name="location" className="form-select" value={location} onChange={e=>setLocation(e.target.value)}>
          <option value="cafeteria">Cafetería</option>
          <option value="biblioteca">Biblioteca</option>
          <option value="aula">Aula / Salón específico</option>
        </select>

        {location === 'aula' && (
          <div className="mt-2">
            <label htmlFor="classroom">Especifica el aula / salón</label>
            <input id="classroom" name="classroom" value={classroom} onChange={e=>setClassroom(e.target.value)} type="text" className="form-control" placeholder="Ej: Aula 204" />
          </div>
        )}

        <button className="btn btn-orange mt-2" type="submit">Rastrear pedido</button>
      </form>

      <div className="status-box mt-3">
        {status === 'LLEGÓ' ? (
          <div>
            <h3>Tu pedido llegó a la universidad 🎉</h3>
            <p>Selecciona el punto y confirma el pago de la tarifa (S/ 5.00).</p>
            <button className="btn btn-orange" onClick={handlePayClick}>Pagar tarifa de entrega (S/ 5.00)</button>
            <button className="btn btn-outline-primary ms-2" onClick={() => onTopUp && onTopUp(10)}>Recargar S/ 10</button>
          </div>
        ) : (
          <p>{status}</p>
        )}
      </div>
    </section>
  );
}
