/**
 * COMPONENTE CARD PERSONALIZZATA
 * 
 * Creo una card riutilizzabile con supporto per hover, gradienti e animazioni.
 * La card è il blocco costruttivo principale per l'interfaccia,
 * usata per contenere varie sezioni di contenuto.
 * 
 * Supporta modalità hoverable per interattività e gradiente per hero sections.
 * 
 * @author Antonio Di Giorgio
 */

import { useTheme } from '../../../context/AppContext';
import React, { useState } from 'react';

/**
 * Card contenitore con stili e animazioni.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Contenuto della card
 * @param {string} props.className - Classi CSS aggiuntive
 * @param {Object} props.style - Stili CSS aggiuntivi
 * @param {boolean} props.hoverable - Se true, abilita effetti hover
 * @param {boolean} props.gradient - Se true, usa sfondo gradiente invece di colore solido
 * @param {Function} props.onClick - Handler click opzionale
 */
const Card = ({ 
  children, 
  className: classeCSS = '', 
  style = {}, 
  hoverable: abilitaHover = false, 
  gradient: gradiente = false, 
  onClick: alClick 
}) => {
  // ===========================
  // STATO E HOOKS
  // ===========================
  
  const [tema] = useTheme();
  const [inHover, impostaInHover] = useState(false);
  
  // ===========================
  // STILI DINAMICI
  // ===========================
  
  /**
   * Costruisco gli stili della card dinamicamente basandomi su:
   * - Tema corrente (chiaro/scuro)
   * - Stato hover
   * - Opzioni hoverable e gradient
   */
  const stileCard = {
    // Sfondo: gradiente o colore solido basato sulla prop
    backgroundColor: gradiente ? 'transparent' : tema.cardBackground,
    background: gradiente ? tema.gradientPrimary : undefined,
    
    // Stili di base
    borderRadius: '20px',
    padding: '32px',
    
    // Ombra dinamica: più pronunciata on hover se hoverable
    boxShadow: abilitaHover && inHover ? tema.shadowXl : tema.shadowMd,
    
    // Transizione fluida per tutti i cambiamenti
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Cursore pointer solo se hoverable
    cursor: abilitaHover ? 'pointer' : 'default',
    
    // Trasformazioni: sollevo e ingrandisco leggermente on hover
    transform: abilitaHover && inHover 
      ? 'translateY(-8px) scale(1.02)' 
      : 'translateY(0) scale(1)',
    
    // Altri stili
    border: `1px solid ${tema.border}`,
    position: 'relative',
    overflow: 'hidden',
    
    // Sovrascrivo con stili custom se forniti
    ...style
  };

  return (
    <div
      className={`${classeCSS} ${abilitaHover ? 'hover-lift' : ''}`}
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