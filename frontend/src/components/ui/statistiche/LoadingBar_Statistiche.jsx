/**
 * COMPONENTE BARRA DI CARICAMENTO
 * 
 * Visualizzo una barra di progresso animata per indicare
 * il caricamento dei dati. L'animazione è fluida e continua
 * per dare feedback visivo all'utente durante le operazioni.
 * 
 * @author Antonio Di Giorgio
 */

import { useTheme } from '../../../context/AppContext';

const BarraCaricamento = () => {
  // Recupero il tema corrente per i colori
  const [tema] = useTheme();
  
  return (
    <div style={{
      width: '100%',
      height: '4px',
      backgroundColor: tema.backgroundTertiary,
      borderRadius: '2px',
      overflow: 'hidden',
      marginBottom: '24px'
    }}>
      {/* ===========================
          BARRA ANIMATA
          =========================== */}
      
      {/* 
        La barra interna si muove da sinistra a destra
        con un'animazione continua per indicare attività
      */}
      <div style={{
        width: '30%',
        height: '100%',
        backgroundColor: tema.primary,
        borderRadius: '2px',
        animation: 'loading 1.5s ease-in-out infinite'
      }} />
      
      {/* ===========================
          DEFINIZIONE ANIMAZIONE
          =========================== */}
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default BarraCaricamento;