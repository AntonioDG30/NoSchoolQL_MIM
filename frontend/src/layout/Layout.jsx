/**
 * COMPONENTE LAYOUT PRINCIPALE
 * 
 * Definisco il layout base dell'applicazione che contiene
 * tutti gli altri componenti. Gestisco il tema dinamico
 * e lo stato della sidebar dal context.
 * 
 * Il layout usa flexbox per creare una struttura responsive
 * con sidebar e contenuto principale.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../context/AppContext';

const Layout = ({ children }) => {
  // ===========================
  // RECUPERO STATO GLOBALE
  // ===========================
  
  const { temaCorrente, sidebarOpen: sidebarAperta } = useApp();
  
  // ===========================
  // STILE LAYOUT
  // ===========================
  
  /**
   * Configuro il layout principale con:
   * - Display flex per organizzare sidebar e contenuto
   * - Altezza piena viewport
   * - Colori dinamici basati sul tema
   * - Overflow hidden per gestire lo scroll nei figli
   */
  const stileLayout = {
    display: 'flex',
    height: '100vh',
    background: temaCorrente.background,
    color: temaCorrente.text,
    overflow: 'hidden'
  };

  return <div style={stileLayout}>{children}</div>;
};

export default Layout;