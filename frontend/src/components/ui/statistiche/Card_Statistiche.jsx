/**
 * COMPONENTE CARD PER STATISTICHE
 * 
 * Creo una card contenitore riutilizzabile con supporto per
 * hover effects e animazioni. La card è il blocco costruttivo
 * base per l'interfaccia delle statistiche.
 * 
 * Supporta modalità hoverable con effetto lift e ombra dinamica.
 * 
 * @author Antonio Di Giorgio
 */

import { useTheme } from '../../../context/AppContext';
import React, { useState } from 'react';

/**
 * Card contenitore per le statistiche.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Contenuto della card
 * @param {string} props.className - Classi CSS aggiuntive
 * @param {Object} props.style - Stili CSS aggiuntivi
 * @param {boolean} props.hoverable - Se true, abilita effetti hover
 * @param {Function} props.onClick - Handler click opzionale
 */
const Card = ({ 
  children, 
  className: classeCSS = '', 
  style = {}, 
  hoverable: abilitaHover = false, 
  onClick: alClick 
}) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const [tema] = useTheme();
  const [inHover, impostaInHover] = useState(false);
  
  // ===========================
  // STILI DINAMICI
  // ===========================
  
  /**
   * Costruisco gli stili della card con supporto
   * per effetti hover se abilitati.
   */
  const stileCard = {
    backgroundColor: tema.cardBackground,
    borderRadius: '16px',
    padding: '24px',
    // Ombra dinamica: più pronunciata on hover
    boxShadow: abilitaHover && inHover ? tema.shadowLg : tema.shadow,
    transition: 'all 0.3s ease',
    // Cursore pointer solo se hoverable
    cursor: abilitaHover ? 'pointer' : 'default',
    // Effetto lift on hover
    transform: abilitaHover && inHover ? 'translateY(-4px)' : 'translateY(0)',
    ...style
  };

  return (
    <div
      className={`${classeCSS} ${abilitaHover ? 'hover-lift' : ''} animate-fade-in`}
      style={stileCard}
      onClick={alClick}
      onMouseEnter={() => impostaInHover(true)}
      onMouseLeave={() => impostaInHover(false)}
    >
      {children}
    </div>
  );
};

export default Card;