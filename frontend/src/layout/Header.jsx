/**
 * COMPONENTE HEADER
 * 
 * Creo l'header dell'applicazione con altezza fissa
 * e layout flessibile per contenere titolo, controlli
 * e azioni utente. L'header è sempre visibile nella
 * parte superiore del contenuto principale.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../context/AppContext';

const Header = ({ children }) => {
  // Recupero il tema corrente
  const { temaCorrente } = useApp();
  
  // ===========================
  // STILE HEADER
  // ===========================
  
  /**
   * Configuro l'header con:
   * - Altezza fissa di 70px
   * - Background con supporto per trasparenza/blur
   * - Bordo inferiore per separazione visiva
   * - Flexbox per allineamento contenuti
   */
  const stileHeader = {
    height: '70px',
    background: temaCorrente.headerBackground,
    borderBottom: `1px solid ${temaCorrente.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    flexShrink: 0 // Previene il restringimento dell'header
  };

  return <header style={stileHeader}>{children}</header>;
};

export default Header;