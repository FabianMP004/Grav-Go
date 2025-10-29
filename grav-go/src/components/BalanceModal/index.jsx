import React from 'react';
import './styles.css';

export default function BalanceModal({ visible, balance = 0, onTopUp, onClose }){
  if(!visible) return null;
  return (
    <div className="balance-modal-backdrop">
      <div className="balance-modal">
        <div className="modal-header">
          <h5>Saldo disponible</h5>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Tu saldo actual es: <strong>S/ {balance.toFixed(2)}</strong></p>
          <div className="actions">
            <button className="btn btn-sm btn-outline-primary" onClick={() => onTopUp && onTopUp(10)}>Recargar S/ 10</button>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
