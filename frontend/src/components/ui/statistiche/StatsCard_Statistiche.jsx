/**
 * COMPONENTE CARD STATISTICA
 * 
 * Visualizzo una statistica con icona, titolo e valore in una card
 * con gradiente colorato. La card ha un'animazione di ingresso
 * ritardata per creare un effetto sequenziale quando vengono
 * mostrate più card insieme.
 * 
 * Include un effetto hover e uno skeleton loader durante
 * il caricamento del valore.
 * 
 * @author Antonio Di Giorgio
 */

import { useTheme } from '../../../context/AppContext';
import React, { useState, useEffect } from 'react';
import Card from './Card_Statistiche';
import Skeleton from './Skeleton_Statistiche';

/**
 * Card per visualizzare una singola statistica.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ComponentType} props.icon - Componente icona da Lucide
 * @param {string} props.title - Titolo della statistica
 * @param {string|number} props.value - Valore da mostrare
 * @param {string} props.color - Colore del gradiente di sfondo
 * @param {number} props.delay - Ritardo animazione in unità di 100ms (default: 0)
 */
const CardStatistica = ({ 
  icon: Icona, 
  title: titolo, 
  value: valore, 
  color: colore, 
  delay: ritardo = 0 
}) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const [tema] = useTheme();
  
  // Stato per gestire l'animazione di ingresso
  const [caricato, impostaCaricato] = useState(false);

  /**
   * Applico un ritardo all'animazione di ingresso
   * per creare un effetto sequenziale quando ci sono
   * più card visualizzate insieme.
   */
  useEffect(() => {
    const timer = setTimeout(() => impostaCaricato(true), ritardo * 100);
    return () => clearTimeout(timer);
  }, [ritardo]);

  // ===========================
  // STILI DINAMICI
  // ===========================
  
  const stileCard = {
    height: '100%',
    background: `linear-gradient(135deg, ${colore} 0%, ${colore}dd 100%)`,
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    // Animazione di ingresso con scala e opacità
    opacity: caricato ? 1 : 0,
    transform: caricato ? 'scale(1)' : 'scale(0.9)',
    transition: 'all 0.4s ease'
  };

  return (
    <Card style={stileCard} hoverable>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* ===========================
            CONTENUTO PRINCIPALE
            =========================== */}
        
        <div>
          {/* Titolo della statistica */}
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            {titolo}
          </p>
          
          {/* Valore o skeleton se in caricamento */}
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
            {valore || <Skeleton />}
          </h2>
        </div>
        
        {/* Icona semi-trasparente come decorazione */}
        <Icona size={48} style={{ opacity: 0.3 }} />
      </div>
      
      {/* ===========================
          ELEMENTO DECORATIVO
          =========================== */}
      
      {/* Cerchio decorativo nell'angolo in basso a destra */}
      <div style={{
        position: 'absolute',
        bottom: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }} />
    </Card>
  );
};

export default CardStatistica;