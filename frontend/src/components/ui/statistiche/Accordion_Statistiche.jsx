/**
 * COMPONENTE ACCORDION
 * 
 * Creo un accordion (fisarmonica) per contenuti collassabili.
 * Utilizzo animazioni fluide per l'espansione/contrazione del contenuto
 * e calcolo dinamicamente l'altezza per transizioni smooth.
 * 
 * L'accordion supporta icone, animazioni di ingresso e gestione
 * dello stato espanso/collassato.
 * 
 * @author Antonio Di Giorgio
 */

import { useTheme } from '../../../context/AppContext';
import React, { useState, useEffect, useRef } from 'react';
import Card from './Card_Statistiche';
import { ChevronDown } from 'lucide-react';

/**
 * Accordion per contenuti espandibili.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {string} props.title - Titolo dell'accordion
 * @param {React.ComponentType} props.icon - Icona opzionale
 * @param {boolean} props.expanded - Stato espanso/collassato
 * @param {Function} props.onToggle - Callback per toggle stato
 * @param {React.ReactNode} props.children - Contenuto dell'accordion
 * @param {number} props.delay - Ritardo animazione (default: 0)
 */
const Accordion = ({ 
  title: titolo, 
  icon: Icona, 
  expanded: espanso, 
  onToggle: alToggle, 
  children, 
  delay: ritardo = 0 
}) => {
  // ===========================
  // HOOKS E RIFERIMENTI
  // ===========================
  
  const [tema] = useTheme();
  
  // Riferimento al contenuto per calcolare l'altezza
  const rifContenuto = useRef(null);
  
  // Altezza del contenuto per l'animazione
  const [altezzaContenuto, impostaAltezzaContenuto] = useState(0);

  /**
   * Calcolo l'altezza del contenuto quando cambia
   * per permettere transizioni fluide.
   */
  useEffect(() => {
    if (rifContenuto.current) {
      impostaAltezzaContenuto(rifContenuto.current.scrollHeight);
    }
  }, [children]);

  // ===========================
  // STILI DINAMICI
  // ===========================
  
  const stileHeader = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    cursor: 'pointer',
    userSelect: 'none',
    borderBottom: espanso ? `1px solid ${tema.border}` : 'none',
    transition: 'all 0.3s ease'
  };

  /**
   * Stile del contenuto con altezza dinamica.
   * Uso max-height invece di height per una transizione
   * più fluida e compatibile con contenuti dinamici.
   */
  const stileContenuto = {
    maxHeight: espanso ? `${altezzaContenuto}px` : '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
    opacity: espanso ? 1 : 0
  };

  return (
    <Card
      className="animate-slideIn"
      style={{ 
        padding: 0, 
        overflow: 'hidden',
        animationDelay: `${ritardo * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      {/* ===========================
          HEADER CLICCABILE
          =========================== */}
      
      <div style={stileHeader} onClick={alToggle}>
        {/* Icona e titolo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {Icona && <Icona size={24} style={{ color: tema.primary }} />}
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            {titolo}
          </h3>
        </div>
        
        {/* Chevron che ruota quando espanso */}
        <div style={{
          transition: 'transform 0.3s ease',
          transform: espanso ? 'rotate(180deg)' : 'rotate(0)',
          color: tema.primary
        }}>
          <ChevronDown size={20} />
        </div>
      </div>
      
      {/* ===========================
          CONTENUTO ESPANDIBILE
          =========================== */}
      
      <div style={stileContenuto}>
        <div ref={rifContenuto} style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </Card>
  );
};

export default Accordion;