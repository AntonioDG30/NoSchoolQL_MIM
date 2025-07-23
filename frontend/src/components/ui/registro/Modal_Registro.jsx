/**
 * COMPONENTE MODAL
 * 
 * Creo una finestra modale per il registro elettronico.
 * La modale supporta diverse dimensioni e include:
 * - Overlay semi-trasparente che chiude al click
 * - Header con titolo e pulsante chiusura
 * - Body scrollabile per contenuti lunghi
 * - Animazioni di ingresso/uscita
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../../context/AppContext';
import { X } from 'lucide-react';

/**
 * Finestra modale per il registro.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {boolean} props.isOpen - Stato aperto/chiuso
 * @param {Function} props.onClose - Callback chiusura
 * @param {string} props.title - Titolo della modale
 * @param {React.ReactNode} props.children - Contenuto
 * @param {string} props.size - Dimensione: 'sm' | 'md' | 'lg' | 'xl'
 */
const Modale = ({ 
  isOpen: aperta, 
  onClose: allaChiusura, 
  title: titolo, 
  children, 
  size: dimensione = "md" 
}) => {
  // Recupero il tema corrente
  const { temaCorrente } = useApp();
  
  // Se la modale non è aperta, non renderizzo nulla
  if (!aperta) return null;

  // ===========================
  // CONFIGURAZIONE DIMENSIONI
  // ===========================
  
  const dimensioni = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px'
  };

  // ===========================
  // STILI
  // ===========================
  
  const stileOverlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  };

  const stileModale = {
    background: temaCorrente.cardBackground,
    borderRadius: '20px',
    width: '100%',
    maxWidth: dimensioni[dimensione],
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: temaCorrente.shadowXl
  };

  const stileHeader = {
    padding: '24px',
    borderBottom: `1px solid ${temaCorrente.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const stileBody = {
    padding: '24px',
    overflowY: 'auto',
    flex: 1
  };

  return (
    // Overlay che chiude la modale al click
    <div 
      style={stileOverlay} 
      onClick={allaChiusura} 
      className="animate-fade-in"
    >
      {/* Contenuto modale - stopPropagation previene chiusura al click interno */}
      <div 
        style={stileModale} 
        onClick={e => e.stopPropagation()} 
        className="animate-slide-in"
      >
        {/* Header con titolo e pulsante chiusura */}
        <div style={stileHeader}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: temaCorrente.text 
          }}>
            {titolo}
          </h2>
          
          {/* Pulsante chiusura */}
          <button
            onClick={allaChiusura}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: temaCorrente.textSecondary,
              padding: '8px',
              borderRadius: '8px',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.target.style.background = temaCorrente.backgroundSecondary}
            onMouseLeave={e => e.target.style.background = 'none'}
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Body con contenuto */}
        <div style={stileBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modale;