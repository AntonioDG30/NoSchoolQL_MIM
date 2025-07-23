/**
 * COMPONENTE INPUT PER REGISTRO
 * 
 * Creo un campo input personalizzato per il registro elettronico.
 * Supporta etichette, icone, stati di errore e focus con
 * transizioni fluide e feedback visivo.
 * 
 * L'input si adatta automaticamente al tema corrente.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../../context/AppContext';
import React, { useState } from 'react';

/**
 * Campo input personalizzato.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {string} props.label - Etichetta del campo
 * @param {React.ComponentType} props.icon - Icona opzionale
 * @param {string} props.error - Messaggio di errore
 * @param {...any} props - Altre proprietà dell'input HTML
 */
const Input = ({ 
  label: etichetta, 
  icon: Icona, 
  error: errore, 
  ...altreProps 
}) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const { temaCorrente } = useApp();
  const [inFocus, impostaInFocus] = useState(false);
  
  // ===========================
  // STILI
  // ===========================
  
  const stileContenitore = {
    marginBottom: '16px'
  };

  const stileEtichetta = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: temaCorrente.textSecondary
  };

  const stileWrapperInput = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  /**
   * Stile dell'input con bordo dinamico basato su:
   * - Focus: bordo primary
   * - Errore: bordo danger
   * - Default: bordo normale
   */
  const stileInput = {
    width: '100%',
    padding: Icona ? '12px 16px 12px 44px' : '12px 16px',
    fontSize: '16px',
    background: temaCorrente.background,
    border: `2px solid ${inFocus ? temaCorrente.primary : errore ? temaCorrente.danger : temaCorrente.border}`,
    borderRadius: '12px',
    color: temaCorrente.text,
    transition: 'all 0.2s ease',
    ...altreProps.style
  };

  const stileIcona = {
    position: 'absolute',
    left: '16px',
    color: temaCorrente.textTertiary,
    pointerEvents: 'none'
  };

  return (
    <div style={stileContenitore}>
      {/* Etichetta se presente */}
      {etichetta && <label style={stileEtichetta}>{etichetta}</label>}
      
      <div style={stileWrapperInput}>
        {/* Icona se presente */}
        {Icona && <Icona size={20} style={stileIcona} />}
        
        {/* Campo input */}
        <input
          style={stileInput}
          onFocus={() => impostaInFocus(true)}
          onBlur={() => impostaInFocus(false)}
          {...altreProps}
        />
      </div>
      
      {/* Messaggio di errore se presente */}
      {errore && (
        <p style={{ 
          color: temaCorrente.danger, 
          fontSize: '14px', 
          marginTop: '4px' 
        }}>
          {errore}
        </p>
      )}
    </div>
  );
};

export default Input;