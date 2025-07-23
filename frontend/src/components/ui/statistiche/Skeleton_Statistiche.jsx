/**
 * COMPONENTE SKELETON LOADER
 * 
 * Creo un placeholder animato per mostrare il caricamento
 * di contenuti. Supporta dimensioni personalizzabili e si
 * adatta automaticamente al tema chiaro/scuro.
 * 
 * Lo skeleton mostra un'animazione shimmer che simula
 * il caricamento del contenuto reale.
 * 
 * @author Antonio Di Giorgio
 */

import { useTheme } from '../../../context/AppContext';
import themes from '../../../theme/themes';

/**
 * Skeleton loader per il caricamento dei contenuti.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {string} props.width - Larghezza dello skeleton (default: '60px')
 * @param {string} props.height - Altezza dello skeleton (default: '32px')
 */
const Skeleton = ({ width: larghezza = '60px', height: altezza = '32px' }) => {
  // Recupero il tema per determinare la classe CSS corretta
  const [tema] = useTheme();
  
  /**
   * Scelgo la classe skeleton appropriata basandomi sul tema.
   * Le classi 'skeleton' e 'skeleton-dark' sono definite
   * in globalStyles.js con animazioni shimmer ottimizzate
   * per i rispettivi temi.
   */
  const classeSkeleton = tema.background === themes.dark.background 
    ? 'skeleton-dark' 
    : 'skeleton';
  
  return (
    <div
      className={classeSkeleton}
      style={{
        width: larghezza,
        height: altezza,
        borderRadius: '4px',
        display: 'inline-block'
      }}
    />
  );
};

export default Skeleton;