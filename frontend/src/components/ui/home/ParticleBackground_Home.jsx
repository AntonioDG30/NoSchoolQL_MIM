/**
 * COMPONENTE SFONDO PARTICELLARE
 * 
 * Creo un effetto visivo di particelle fluttuanti per lo sfondo.
 * Le particelle sono generate proceduralmente con proprietà casuali
 * e animazioni continue per creare un effetto dinamico e leggero.
 * 
 * L'effetto si adatta automaticamente al tema corrente.
 * 
 * @author Antonio Di Giorgio
 */

import { useTheme } from '../../../context/AppContext';

const SfondoParticellare = () => {
  // ===========================
  // CONFIGURAZIONE
  // ===========================
  
  // Recupero il tema corrente per il colore delle particelle
  const [tema] = useTheme();
  
  /**
   * Genero un array di 50 particelle con proprietà casuali.
   * Ogni particella ha:
   * - id: identificativo univoco
   * - size: dimensione casuale tra 2 e 6 pixel
   * - left: posizione orizzontale casuale (0-100%)
   * - animationDuration: durata animazione (10-30 secondi)
   * - animationDelay: ritardo iniziale (0-20 secondi)
   */
  const particelle = Array.from({ length: 50 }, (_, indice) => ({
    id: indice,
    dimensione: Math.random() * 4 + 2,
    posizioneX: Math.random() * 100,
    durataAnimazione: Math.random() * 20 + 10,
    ritardoAnimazione: Math.random() * 20
  }));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none', // Non interferisco con i click
      overflow: 'hidden',
      zIndex: 0
    }}>
      {/* ===========================
          RENDERING PARTICELLE
          =========================== */}
      
      {particelle.map(particella => (
        <div
          key={particella.id}
          style={{
            position: 'absolute',
            width: `${particella.dimensione}px`,
            height: `${particella.dimensione}px`,
            borderRadius: '50%',
            backgroundColor: tema.primary,
            opacity: 0.1, // Mantengo le particelle sottili
            left: `${particella.posizioneX}%`,
            bottom: '-20px', // Parto dal basso
            /**
             * Animazione "float" definita in globalStyles.
             * Le particelle fluttuano verso l'alto con movimento ondulatorio.
             * La varietà di durate e ritardi crea un effetto organico.
             */
            animation: `float ${particella.durataAnimazione}s ease-in-out ${particella.ritardoAnimazione}s infinite`
          }}
        />
      ))}
    </div>
  );
};

export default SfondoParticellare;