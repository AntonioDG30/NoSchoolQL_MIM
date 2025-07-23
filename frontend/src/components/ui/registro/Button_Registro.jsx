/**
 * COMPONENTE PULSANTE PER REGISTRO
 * 
 * Creo un pulsante personalizzato per il registro elettronico.
 * Supporta diverse varianti, dimensioni, icone e stati interattivi.
 * 
 * Il pulsante gestisce automaticamente gli stati hover e pressed
 * con animazioni fluide e feedback visivo.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../../context/AppContext';
import React, { useState } from 'react';

/**
 * Pulsante personalizzato per il registro.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Contenuto del pulsante
 * @param {string} props.variant - Variante: 'primary' | 'secondary' | 'danger' | 'ghost'
 * @param {string} props.size - Dimensione: 'sm' | 'md' | 'lg'
 * @param {React.ComponentType} props.icon - Icona opzionale
 * @param {string} props.iconPosition - Posizione icona: 'left' | 'right'
 * @param {Function} props.onClick - Handler click
 * @param {Object} props.style - Stili CSS aggiuntivi
 * @param {string} props.className - Classi CSS aggiuntive
 * @param {...any} props - Altre proprietà del button HTML
 */
const Pulsante = ({ 
  children, 
  variant: variante = "primary", 
  size: dimensione = "md", 
  icon: Icona, 
  iconPosition: posizioneIcona = "left", 
  onClick: alClick, 
  style = {}, 
  className: classeCSS = "", 
  ...altreProps 
}) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const { temaCorrente } = useApp();
  const [inHover, impostaInHover] = useState(false);
  const [premuto, impostaPremuto] = useState(false);
  
  // ===========================
  // CONFIGURAZIONE DIMENSIONI
  // ===========================
  
  const dimensioni = {
    sm: { padding: '8px 16px', fontSize: '14px', iconSize: 16 },
    md: { padding: '12px 24px', fontSize: '16px', iconSize: 20 },
    lg: { padding: '16px 32px', fontSize: '18px', iconSize: 24 }
  };

  // ===========================
  // CONFIGURAZIONE VARIANTI
  // ===========================
  
  /**
   * Ogni variante ha stili specifici che cambiano
   * in base agli stati hover e pressed.
   */
  const varianti = {
    primary: {
      background: premuto ? temaCorrente.primaryHover : inHover ? temaCorrente.primaryHover : temaCorrente.primary,
      color: '#ffffff',
      border: 'none'
    },
    secondary: {
      background: premuto ? temaCorrente.secondaryLight : inHover ? temaCorrente.secondaryLight : 'transparent',
      color: temaCorrente.text,
      border: `1px solid ${temaCorrente.border}`
    },
    danger: {
      background: premuto ? temaCorrente.dangerHover : inHover ? temaCorrente.dangerHover : temaCorrente.danger,
      color: '#ffffff',
      border: 'none'
    },
    ghost: {
      background: premuto ? temaCorrente.backgroundTertiary : inHover ? temaCorrente.backgroundSecondary : 'transparent',
      color: temaCorrente.text,
      border: 'none'
    }
  };

  // ===========================
  // STILE PULSANTE
  // ===========================
  
  const stilePulsante = {
    ...dimensioni[dimensione],
    ...varianti[variante],
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    // Effetto scale quando premuto
    transform: premuto ? 'scale(0.98)' : 'scale(1)',
    // Ombra solo per variante primary
    boxShadow: variante === 'primary' && !premuto ? temaCorrente.shadow : 'none',
    ...style
  };

  return (
    <button
      style={stilePulsante}
      className={classeCSS}
      onMouseEnter={() => impostaInHover(true)}
      onMouseLeave={() => impostaInHover(false)}
      onMouseDown={() => impostaPremuto(true)}
      onMouseUp={() => impostaPremuto(false)}
      onClick={alClick}
      {...altreProps}
    >
      {/* Icona a sinistra se presente e posizione è 'left' */}
      {Icona && posizioneIcona === 'left' && <Icona size={dimensioni[dimensione].iconSize} />}
      
      {/* Contenuto del pulsante */}
      {children}
      
      {/* Icona a destra se presente e posizione è 'right' */}
      {Icona && posizioneIcona === 'right' && <Icona size={dimensioni[dimensione].iconSize} />}
    </button>
  );
};

export default Pulsante;