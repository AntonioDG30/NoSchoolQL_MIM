/**
 * COMPONENTE CARD VOTO STUDENTE
 * 
 * Visualizzo un singolo voto in formato card con:
 * - Valore del voto con colore dinamico
 * - Materia
 * - Data formattata
 * - Badge tipologia (scritto/orale/pratico)
 * - Effetto hover per feedback visivo
 * 
 * Supporto due modalità: normale e dettagliata.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../context/AppContext';

/**
 * Card per visualizzare un singolo voto.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {Object} props.voto - Dati del voto
 * @param {boolean} props.detailed - Modalità dettagliata
 * @param {Function} props.renderTipologia - Render custom tipologia
 */
const CardVotoStudente = ({ 
  voto, 
  detailed: dettagliato = false,
  renderTipologia: renderizzaTipologia 
}) => {
  // Recupero il tema corrente
  const { temaCorrente } = useApp();
  
  // ===========================
  // FUNZIONI UTILITY
  // ===========================
  
  /**
   * Determino il colore del voto in base al valore.
   */
  const ottieniColoreVoto = (valore) => {
    if (valore >= 8) return temaCorrente.success;
    if (valore >= 6) return temaCorrente.primary;
    return temaCorrente.danger;
  };

  /**
   * Normalizzo la tipologia del voto.
   * Gestisco sia 'tipologia' che 'tipo' per compatibilità.
   */
  const normalizzaTipologia = (t) => (t || '').toUpperCase();
  const tipologia = normalizzaTipologia(voto.tipologia || voto.tipo); 

  /**
   * Stile per il badge della tipologia.
   */
  const ottieniStileBadgeTipologia = (t) => {
    const base = {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '999px',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase'
    };
    
    switch (t) {
      case 'SCRITTO':
        return { 
          ...base, 
          background: temaCorrente.primaryLight, 
          color: temaCorrente.primary 
        };
      case 'ORALE':
        return { 
          ...base, 
          background: temaCorrente.infoLight || '#e0f2ff', 
          color: temaCorrente.info || '#0b6ea8' 
        };
      case 'PRATICO':
        return { 
          ...base, 
          background: temaCorrente.warningLight, 
          color: temaCorrente.warning 
        };
      default:
        return { 
          ...base, 
          background: temaCorrente.border, 
          color: temaCorrente.textSecondary 
        };
    }
  };

  const coloreVoto = ottieniColoreVoto(voto.voto);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        background: temaCorrente.background,
        border: `1px solid ${temaCorrente.border}`,
        borderRadius: '12px',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.boxShadow = temaCorrente.shadowMd;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* ===========================
          VALORE VOTO
          =========================== */}
      
      <div
        style={{
          width: dettagliato ? '60px' : '48px',
          height: dettagliato ? '60px' : '48px',
          borderRadius: '12px',
          background: `${coloreVoto}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <span
          style={{
            fontSize: dettagliato ? '24px' : '20px',
            fontWeight: '700',
            color: coloreVoto
          }}
        >
          {voto.voto}
        </span>
      </div>
      
      {/* ===========================
          DETTAGLI VOTO
          =========================== */}
      
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Materia */}
        <p style={{ fontWeight: '600', marginBottom: '4px' }}>
          {voto.materia}
        </p>
        
        {/* Data formattata */}
        <p
          style={{
            color: temaCorrente.textSecondary,
            fontSize: '14px',
            margin: 0
          }}
        >
          {new Date(voto.data).toLocaleDateString('it-IT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        {/* Tipologia (solo in modalità dettagliata) */}
        {dettagliato && (tipologia || renderizzaTipologia) && (
          <div style={{ marginTop: '8px' }}>
            {renderizzaTipologia
              ? renderizzaTipologia()
              : <span style={ottieniStileBadgeTipologia(tipologia)}>{tipologia}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardVotoStudente;