/**
 * COMPONENTE BADGE
 * 
 * Creo un badge (etichetta) per evidenziare informazioni importanti
 * nel registro. Supporta diverse varianti di colore, dimensioni e icone.
 * 
 * Utile per mostrare stati, categorie o informazioni sintetiche
 * in modo visivamente distintivo.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../../context/AppContext';

/**
 * Badge per il registro elettronico.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Contenuto del badge
 * @param {string} props.variant - Variante colore: 'primary' | 'success' | 'danger' | 'warning'
 * @param {string} props.size - Dimensione: 'sm' | 'md' | 'lg'
 * @param {React.ComponentType} props.icon - Icona opzionale
 */
const Badge = ({ 
  children, 
  variant: variante = "primary", 
  size: dimensione = "md", 
  icon: Icona 
}) => {
  // Recupero il tema corrente dal context
  const { temaCorrente } = useApp();
  
  // ===========================
  // CONFIGURAZIONE VARIANTI
  // ===========================
  
  /**
   * Ogni variante ha colori di sfondo e testo specifici
   * che si adattano al tema corrente.
   */
  const varianti = {
    primary: {
      background: temaCorrente.primaryLight,
      color: temaCorrente.primary
    },
    success: {
      background: temaCorrente.successLight,
      color: temaCorrente.success
    },
    danger: {
      background: temaCorrente.dangerLight,
      color: temaCorrente.danger
    },
    warning: {
      background: temaCorrente.warningLight,
      color: temaCorrente.warning
    }
  };

  // ===========================
  // CONFIGURAZIONE DIMENSIONI
  // ===========================
  
  const dimensioni = {
    sm: { padding: '4px 8px', fontSize: '12px' },
    md: { padding: '6px 12px', fontSize: '14px' },
    lg: { padding: '8px 16px', fontSize: '16px' }
  };

  // ===========================
  // STILE BADGE
  // ===========================
  
  const stileBadge = {
    ...varianti[variante],
    ...dimensioni[dimensione],
    borderRadius: '999px', // Bordi completamente arrotondati
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  };

  return (
    <span style={stileBadge}>
      {/* Icona se presente */}
      {Icona && <Icona size={14} />}
      {/* Contenuto del badge */}
      {children}
    </span>
  );
};

export default Badge;