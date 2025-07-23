/**
 * COMPONENTE MAIN
 * 
 * Creo il contenitore principale per il contenuto dell'applicazione.
 * Questo componente occupa tutto lo spazio disponibile dopo la sidebar
 * e organizza il contenuto in colonna (header + content).
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../context/AppContext';

const Main = ({ children }) => {
  // Recupero il tema corrente
  const { temaCorrente } = useApp();
  
  // ===========================
  // STILE MAIN
  // ===========================
  
  /**
   * Configuro il contenitore principale con:
   * - Flex: 1 per occupare tutto lo spazio disponibile
   * - Display flex column per organizzare header e contenuto
   * - Background secondario per differenziarlo dalla sidebar
   */
  const stileMain = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: temaCorrente.backgroundSecondary
  };

  return <main style={stileMain}>{children}</main>;
};

export default Main;