/**
 * COMPONENTE CONTENT
 * 
 * Definisco l'area principale del contenuto con padding
 * e gestione dello scroll. Questo componente contiene
 * tutto il contenuto scrollabile dell'applicazione.
 * 
 * @author Antonio Di Giorgio
 */

const Content = ({ children }) => {
  // ===========================
  // STILE CONTENUTO
  // ===========================
  
  /**
   * Configuro l'area contenuto con:
   * - Flex: 1 per occupare lo spazio disponibile
   * - Padding uniforme per spaziatura
   * - Overflow per scroll verticale quando necessario
   * - Overflow-x hidden per prevenire scroll orizzontale
   */
  const stileContenuto = {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    overflowX: 'hidden'
  };

  return <div style={stileContenuto}>{children}</div>;
};

export default Content;