import React, { useState } from 'react';
import './styles.css';

export default function BalanceModal({ visible, balance = 0, onTopUp, onClose }){
  const [amount, setAmount] = useState(10);
  const [card, setCard] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/30');
  const [cvv, setCvv] = useState('123');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  if(!visible) return null;

  const handleClose = () => {
    setShowForm(false);
    setMessage('');
    onClose && onClose();
  }

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    const a = Number(amount) || 0;
    if(a <= 0){ setMessage('Ingresa un monto válido.'); return; }
    // Call parent handler which will update backend (App.handleTopUp)
    try{
      setLoading(true);
      await onTopUp && onTopUp(a);
      setMessage('Recarga exitosa.');
    }catch(err){
      console.error('TopUp error', err);
      setMessage(err.message || 'Error al recargar');
    }finally{ setLoading(false); }
  }

  return (
    <div className="balance-modal-backdrop">
      <div className="balance-modal">
        <div className="modal-header">
          <h5>Saldo disponible</h5>
          <button className="btn-close" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Tu saldo actual es: <strong>Q {balance.toFixed(2)}</strong></p>

          {!showForm ? (
            <div className="actions">
              <button className="btn btn-orange" onClick={()=>setShowForm(true)}>Realizar recarga</button>
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="field">
                <label>Monto a recargar (Q)</label>
                <input type="number" min="1" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} className="form-control" />
              </div>

              <div className="field">
                <label>Tarjeta (demo)</label>
                <input type="text" value={card} onChange={e=>setCard(e.target.value)} className="form-control" />
              </div>

              <div className="two-cols">
                <div className="field">
                  <label>Expiración</label>
                  <input type="text" value={expiry} onChange={e=>setExpiry(e.target.value)} className="form-control" placeholder="MM/AA" />
                </div>
                <div className="field cvv-col">
                  <label>CVV</label>
                  <input type="text" value={cvv} onChange={e=>setCvv(e.target.value)} className="form-control" placeholder="123" />
                </div>
              </div>

              {message && <div className="text-muted small mt-2">{message}</div>}

              <div className="actions">
                <button className="btn btn-orange" type="submit" disabled={loading}>{loading ? 'Procesando…' : 'Recargar'}</button>
                <button type="button" className="btn btn-secondary" onClick={()=>{ setShowForm(false); setMessage(''); }}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
