/**
 * COMPONENTE CARD STATISTICA
 * 
 * Visualizzo una singola statistica con icona, valore e etichetta.
 * Usato nella homepage per mostrare i numeri chiave del sistema
 * (numero di scuole, docenti, classi).
 * 
 * Il design è minimale ma efficace, con supporto per temi.
 * 
 * @author Antonio Di Giorgio
 */

import { useTheme } from '../../../context/AppContext';

/**
 * Card per visualizzare una statistica.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ComponentType} props.icon - Componente icona da Lucide
 * @param {string|number} props.value - Valore numerico da mostrare
 * @param {string} props.label - Etichetta descrittiva
 * @param {string} props.color - Colore dell'icona e degli accenti
 */
const CardStatistica = ({ icon: Icona, value: valore, label: etichetta, color: colore }) => {
  // Recupero il tema corrente
  const [tema] = useTheme();
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '20px',
      borderRadius: '16px',
      backgroundColor: tema.backgroundTertiary,
      transition: 'all 0.3s ease'
    }}>
      {/* ===========================
          ICONA
          =========================== */}
      
      {/* Contenitore icona con sfondo colorato semi-trasparente */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: `${colore}20`, // 20 = opacità 12.5%
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icona size={24} color={colore} />
      </div>
      
      {/* ===========================
          CONTENUTO TESTUALE
          =========================== */}
      
      <div>
        {/* Valore numerico grande e in grassetto */}
        <p style={{
          fontSize: '24px',
          fontWeight: '700',
          color: tema.text,
          marginBottom: '4px'
        }}>
          {valore}
        </p>
        
        {/* Etichetta descrittiva più piccola */}
        <p style={{
          fontSize: '14px',
          color: tema.textSecondary
        }}>
          {etichetta}
        </p>
      </div>
    </div>
  );
};

export default CardStatistica;