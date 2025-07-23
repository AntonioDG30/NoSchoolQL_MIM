/**
 * COMPONENTE SELECT PER REGISTRO
 * 
 * Creo un menu a tendina personalizzato per il registro elettronico.
 * Il select supporta etichette, icone e si adatta al tema corrente.
 * 
 * Include uno stile personalizzato per la freccia del dropdown
 * che si integra con il design dell'applicazione.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../../context/AppContext';
import React, { useState } from 'react';

/**
 * Menu a tendina personalizzato.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {string} props.label - Etichetta del select
 * @param {React.ComponentType} props.icon - Icona opzionale
 * @param {React.ReactNode} props.children - Opzioni del select
 * @param {...any} props - Altre proprietà del select HTML
 */
const Select = ({ 
  label: etichetta, 
  icon: Icona, 
  children, 
  ...altreProps 
}) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const { temaCorrente } = useApp();
  const [inFocus, impostaInFocus] = useState(false);
  
  // ===========================
  // STILE SELECT
  // ===========================
  
  /**
   * Stile del select con:
   * - Freccia personalizzata tramite SVG in background
   * - Rimozione appearance default del browser
   * - Bordo dinamico basato sul focus
   */
  const stileSelect = {
    width: '100%',
    padding: Icona ? '12px 16px 12px 44px' : '12px 16px',
    fontSize: '16px',
    background: temaCorrente.background,
    border: `2px solid ${inFocus ? temaCorrente.primary : temaCorrente.border}`,
    borderRadius: '12px',
    color: temaCorrente.text,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    appearance: 'none', // Rimuovo lo stile default
    // Freccia personalizzata come immagine di sfondo
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${temaCorrente.textTertiary.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '20px',
    paddingRight: '40px', // Spazio per la freccia
    ...altreProps.style
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Etichetta se presente */}
      {etichetta && (
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: temaCorrente.textSecondary
        }}>
          {etichetta}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {/* Icona se presente */}
        {Icona && <Icona size={20} style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: temaCorrente.textTertiary,
          pointerEvents: 'none'
        }} />}
        
        {/* Campo select */}
        <select
          style={stileSelect}
          onFocus={() => impostaInFocus(true)}
          onBlur={() => impostaInFocus(false)}
          {...altreProps}
        >
          {children}
        </select>
      </div>
    </div>
  );
};

export default Select;