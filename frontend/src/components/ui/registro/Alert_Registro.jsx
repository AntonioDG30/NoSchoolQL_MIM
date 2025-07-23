/**
 * COMPONENTE ALERT
 * 
 * Creo un componente alert per mostrare messaggi importanti
 * nel registro elettronico. Supporta diversi tipi di messaggi
 * (info, success, error, warning) con icone e colori appropriati.
 * 
 * Include un pulsante di chiusura opzionale e animazioni
 * di ingresso per attirare l'attenzione dell'utente.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../../context/AppContext';
import { 
  CheckCircle,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react';

/**
 * Alert per messaggi importanti.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Contenuto dell'alert
 * @param {string} props.type - Tipo: 'info' | 'success' | 'error' | 'warning'
 * @param {React.ComponentType} props.icon - Icona personalizzata opzionale
 * @param {Function} props.onClose - Callback per chiudere l'alert
 */
const Alert = ({ 
  children, 
  type: tipo = "info", 
  icon: IconaPersonalizzata, 
  onClose: allaChiusura 
}) => {
  // Recupero il tema corrente
  const { temaCorrente } = useApp();
  
  // ===========================
  // CONFIGURAZIONE TIPI
  // ===========================
  
  /**
   * Ogni tipo di alert ha:
   * - Colori di sfondo e testo specifici
   * - Un'icona predefinita appropriata
   */
  const tipi = {
    info: {
      background: temaCorrente.primaryLight,
      color: temaCorrente.primary,
      icon: AlertCircle
    },
    success: {
      background: temaCorrente.successLight,
      color: temaCorrente.success,
      icon: CheckCircle
    },
    error: {
      background: temaCorrente.dangerLight,
      color: temaCorrente.danger,
      icon: XCircle
    },
    warning: {
      background: temaCorrente.warningLight,
      color: temaCorrente.warning,
      icon: AlertCircle
    }
  };

  // Recupero la configurazione per il tipo corrente
  const configurazione = tipi[tipo];
  
  // Uso l'icona personalizzata se fornita, altrimenti quella di default
  const Icona = IconaPersonalizzata || configurazione.icon;

  // ===========================
  // STILE ALERT
  // ===========================
  
  const stileAlert = {
    background: configurazione.background,
    color: configurazione.color,
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px',
    position: 'relative'
  };

  return (
    <div style={stileAlert} className="animate-slide-in">
      {/* Icona dell'alert */}
      <Icona size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
      
      {/* Contenuto dell'alert */}
      <div style={{ flex: 1 }}>{children}</div>
      
      {/* Pulsante di chiusura se presente callback */}
      {allaChiusura && (
        <button
          onClick={allaChiusura}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: configurazione.color,
            padding: '4px'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;