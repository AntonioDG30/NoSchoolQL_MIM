/**
 * COMPONENTE SPINNER DI CARICAMENTO
 * 
 * Visualizzo uno spinner animato per indicare il caricamento
 * dei dati nel registro. Lo spinner è un cerchio che ruota
 * con colori che si adattano al tema corrente.
 * 
 * Utilizzato durante le operazioni asincrone per dare
 * feedback visivo all'utente.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../../context/AppContext';

const SpinnerCaricamento = () => {
  // Recupero il tema corrente
  const { temaCorrente } = useApp();
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    }}>
      {/* ===========================
          CERCHIO ANIMATO
          =========================== */}
      
      {/* 
        Creo un cerchio con bordo parzialmente colorato
        che ruota continuamente grazie alla classe animate-spin
      */}
      <div style={{
        width: '40px',
        height: '40px',
        border: `3px solid ${temaCorrente.border}`,
        borderTopColor: temaCorrente.primary, // Solo il bordo superiore è colorato
        borderRadius: '50%'
      }} className="animate-spin" />
    </div>
  );
};

export default SpinnerCaricamento;