/**
 * COMPONENTE CARD PER REGISTRO
 * 
 * Creo una card contenitore per il registro elettronico.
 * La card supporta effetti hover e animazioni di ingresso
 * per migliorare l'esperienza utente.
 * 
 * È il componente base per organizzare contenuti nel registro.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../../context/AppContext';
import React, { useState } from 'react';

/**
 * Card contenitore per il registro.
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
  className: classeCSS = "", 
  style = {}, 
  hoverable: abilitaHover = false, 
  onClick: alClick 
}) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const { temaCorrente } = useApp();
  const [inHover, impostaInHover] = useState(false);
  
  // ===========================
  // STILE CARD
  // ===========================
  
  const stileCard = {
    background: temaCorrente.cardBackground,
    borderRadius: '16px',
    border: `1px solid ${temaCorrente.border}`,
    padding: '24px',
    // Transizione fluida per tutti i cambiamenti
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    // Cursore pointer solo se hoverable
    cursor: abilitaHover ? 'pointer' : 'default',
    // Effetto lift on hover
    transform: abilitaHover && inHover ? 'translateY(-2px)' : 'translateY(0)',
    // Ombra dinamica
    boxShadow: abilitaHover && inHover ? temaCorrente.shadowMd : temaCorrente.shadow,
    ...style
  };

  return (
    <div
      style={stileCard}
      className={`${classeCSS} animate-fade-in`}
      onMouseEnter={() => impostaInHover(true)}
      onMouseLeave={() => impostaInHover(false)}
      onClick={alClick}
    >
      {children}
    </div>
  );
};

export default Card;