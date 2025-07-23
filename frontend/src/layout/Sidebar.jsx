/**
 * COMPONENTE SIDEBAR
 * 
 * Creo la sidebar laterale dell'applicazione con supporto
 * per animazioni di apertura/chiusura. La larghezza è
 * personalizzabile e lo stato aperto/chiuso è gestito
 * globalmente dal context.
 * 
 * La sidebar contiene la navigazione principale e le
 * informazioni dell'utente.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../context/AppContext';

/**
 * Sidebar laterale animata.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Contenuto della sidebar
 * @param {number} props.width - Larghezza in pixel (default: 280)
 */
const Sidebar = ({ children, width: larghezza = 280 }) => {
  // ===========================
  // RECUPERO STATO GLOBALE
  // ===========================
  
  const { temaCorrente, sidebarAperta } = useApp();
  
  // ===========================
  // STILI SIDEBAR
  // ===========================
  
  /**
   * Stile della sidebar con:
   * - Larghezza dinamica basata sullo stato aperto/chiuso
   * - Transizione fluida per l'animazione
   * - Overflow hidden per nascondere il contenuto quando chiusa
   */
  const stileSidebar = {
    width: sidebarAperta ? `${larghezza}px` : '0',
    height: '100vh',
    background: temaCorrente.sidebarBackground,
    borderRight: `1px solid ${temaCorrente.border}`,
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0 // Previene il restringimento della sidebar
  };

  /**
   * Contenitore interno con larghezza fissa.
   * Questo permette al contenuto di mantenere le dimensioni
   * corrette anche durante l'animazione di chiusura.
   */
  const stileContenuto = {
    width: `${larghezza}px`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <aside style={stileSidebar}>
      <div style={stileContenuto}>
        {children}
      </div>
    </aside>
  );
};

export default Sidebar;