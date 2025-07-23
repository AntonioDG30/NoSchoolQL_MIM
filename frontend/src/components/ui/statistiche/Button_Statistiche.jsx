/**
 * COMPONENTE PULSANTE PER STATISTICHE
 * 
 * Creo un pulsante personalizzato con diverse varianti stilistiche.
 * Il componente gestisce gli stati hover e active con transizioni
 * fluide e supporta icone e dimensioni multiple.
 * 
 * Varianti disponibili: primary, secondary, ghost
 * Dimensioni: sm, md, lg
 * 
 * @author Antonio Di Giorgio
 */

import { useTheme } from '../../../context/AppContext';
import React, { useState } from 'react';

/**
 * Pulsante personalizzato per le statistiche.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Contenuto del pulsante
 * @param {string} props.variant - Variante stile: 'primary' | 'secondary' | 'ghost'
 * @param {string} props.size - Dimensione: 'sm' | 'md' | 'lg'
 * @param {React.ComponentType} props.icon - Icona opzionale
 * @param {Function} props.onClick - Handler click
 * @param {Object} props.style - Stili CSS aggiuntivi
 * @param {...any} props - Altre proprietà passate al button
 */
const Pulsante = ({ 
  children, 
  variant: variante = 'primary', 
  size: dimensione = 'md', 
  icon: Icona, 
  onClick: alClick, 
  style = {}, 
  ...altreProps 
}) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const [tema] = useTheme();
  const [inHover, impostaInHover] = useState(false);
  
  // ===========================
  // CONFIGURAZIONE STILI
  // ===========================
  
  const stileBase = {
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    outline: 'none'
  };

  // Configurazione dimensioni
  const dimensioni = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '10px 20px', fontSize: '16px' },
    lg: { padding: '12px 24px', fontSize: '18px' }
  };

  /**
   * Configurazione varianti con supporto hover.
   * Primary: colore pieno con ombra
   * Secondary: bordo con sfondo trasparente
   * Ghost: solo sfondo on hover
   */
  const varianti = {
    primary: {
      backgroundColor: inHover ? tema.primaryHover : tema.primary,
      color: '#ffffff',
      boxShadow: tema.shadow
    },
    secondary: {
      backgroundColor: inHover ? tema.secondaryLight : 'transparent',
      color: tema.text,
      border: `1px solid ${tema.border}`
    },
    ghost: {
      backgroundColor: inHover ? tema.backgroundTertiary : 'transparent',
      color: tema.text
    }
  };

  return (
    <button
      style={{
        ...stileBase,
        ...dimensioni[dimensione],
        ...varianti[variante],
        ...style
      }}
      onMouseEnter={() => impostaInHover(true)}
      onMouseLeave={() => impostaInHover(false)}
      onClick={alClick}
      {...altreProps}
    >
      {/* Icona se presente */}
      {Icona && <Icona size={18} />}
      {/* Contenuto del pulsante */}
      {children}
    </button>
  );
};

export default Pulsante;