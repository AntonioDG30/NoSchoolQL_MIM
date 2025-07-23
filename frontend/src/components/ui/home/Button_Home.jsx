/**
 * COMPONENTE PULSANTE PERSONALIZZATO
 * 
 * Creo un pulsante riutilizzabile con diverse varianti stilistiche,
 * dimensioni e supporto per icone. Il componente gestisce automaticamente
 * gli stati hover e pressed con animazioni fluide.
 * 
 * Supporta tre varianti: primary (gradiente), secondary (bordo), ghost (trasparente).
 * 
 * @author Antonio Di Giorgio
 */

import { useTheme } from '../../../context/AppContext';
import React, { useState } from 'react';

/**
 * Pulsante personalizzato con stili e animazioni.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Contenuto del pulsante
 * @param {string} props.variant - Variante stilistica: 'primary' | 'secondary' | 'ghost'
 * @param {string} props.size - Dimensione: 'sm' | 'md' | 'lg'
 * @param {React.ComponentType} props.icon - Componente icona opzionale
 * @param {Function} props.onClick - Handler click
 * @param {Object} props.style - Stili CSS aggiuntivi
 * @param {string} props.className - Classi CSS aggiuntive
 * @param {...any} props - Altre proprietà passate al button nativo
 */
const Pulsante = ({ 
  children, 
  variant: variante = 'primary', 
  size: dimensione = 'md', 
  icon: Icona, 
  onClick: alClick, 
  style = {}, 
  className: classeCSS = '', 
  ...altreProps 
}) => {
  // ===========================
  // STATO E HOOKS
  // ===========================
  
  const [tema] = useTheme();
  const [inHover, impostaInHover] = useState(false);
  const [premuto, impostaPremuto] = useState(false);
  
  // ===========================
  // STILI DI BASE
  // ===========================
  
  /**
   * Definisco gli stili di base comuni a tutte le varianti.
   * Uso transizioni cubic-bezier per animazioni più naturali.
   */
  const stileBase = {
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden'
  };

  // ===========================
  // CONFIGURAZIONE DIMENSIONI
  // ===========================
  
  const dimensioni = {
    sm: { padding: '10px 20px', fontSize: '14px' },
    md: { padding: '14px 28px', fontSize: '16px' },
    lg: { padding: '18px 36px', fontSize: '18px' }
  };

  // ===========================
  // CONFIGURAZIONE VARIANTI
  // ===========================
  
  /**
   * Ogni variante ha stili specifici che cambiano in base agli stati.
   * Primary: gradiente colorato con ombre
   * Secondary: sfondo sottile con bordo
   * Ghost: solo testo colorato, sfondo trasparente
   */
  const varianti = {
    primary: {
      background: tema.gradientPrimary,
      color: '#ffffff',
      boxShadow: inHover ? tema.shadowLg : tema.shadowMd,
      transform: premuto ? 'scale(0.98)' : inHover ? 'translateY(-2px)' : 'translateY(0)'
    },
    secondary: {
      backgroundColor: tema.backgroundTertiary,
      color: tema.text,
      border: `2px solid ${tema.border}`,
      transform: premuto ? 'scale(0.98)' : 'scale(1)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: tema.primary,
      transform: premuto ? 'scale(0.98)' : 'scale(1)'
    }
  };

  return (
    <button
      className={classeCSS}
      style={{
        ...stileBase,
        ...dimensioni[dimensione],
        ...varianti[variante],
        ...style
      }}
      onMouseEnter={() => impostaInHover(true)}
      onMouseLeave={() => impostaInHover(false)}
      onMouseDown={() => impostaPremuto(true)}
      onMouseUp={() => impostaPremuto(false)}
      onClick={alClick}
      {...altreProps}
    >
      {/* Renderizzo l'icona se presente */}
      {Icona && <Icona size={20} />}
      
      {/* Contenuto del pulsante */}
      {children}
    </button>
  );
};

export default Pulsante;