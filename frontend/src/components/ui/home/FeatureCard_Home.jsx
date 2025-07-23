/**
 * COMPONENTE CARD FUNZIONALITÀ
 * 
 * Creo le card interattive per mostrare le funzionalità principali
 * nella homepage. Ogni card ha animazioni hover, effetti particellari
 * e un design moderno con gradienti.
 * 
 * Le card sono completamente responsive e supportano il tema chiaro/scuro.
 * 
 * @author Antonio Di Giorgio
 */

import { useTheme } from '../../../context/AppContext';
import React, { useState } from 'react';
import Card from './Card_Home';
import Button from './Button_Home';
import { ArrowRight } from 'lucide-react';

/**
 * Componente card per visualizzare una funzionalità.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ComponentType} props.icon - Componente icona da Lucide
 * @param {string} props.title - Titolo della funzionalità
 * @param {string} props.description - Descrizione dettagliata
 * @param {string} props.link - URL di destinazione
 * @param {string} props.linkText - Testo del pulsante di azione
 * @param {string} props.color - Colore principale per gradienti e accenti
 * @param {number} props.delay - Ritardo animazione in millisecondi (default: 0)
 */
const CardFunzionalita = ({ 
  icon: Icona, 
  title: titolo, 
  description: descrizione, 
  link: collegamento, 
  linkText: testoCollegamento, 
  color: colore, 
  delay: ritardo = 0 
}) => {
  // ===========================
  // STATO E HOOKS
  // ===========================
  
  // Recupero il tema corrente dal context
  const [tema] = useTheme();
  
  // Gestisco lo stato hover per le animazioni
  const [inHover, impostaInHover] = useState(false);
  
  return (
    <Card
      hoverable
      className="animate-scaleIn"
      style={{
        animationDelay: `${ritardo}ms`,
        animationFillMode: 'both',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={() => impostaInHover(true)}
      onMouseLeave={() => impostaInHover(false)}
    >
      {/* ===========================
          EFFETTI PARTICELLARI DI SFONDO
          =========================== */}
      
      {/* Blob superiore destro - si espande on hover */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `${colore}20`,
        filter: 'blur(40px)',
        transition: 'all 0.5s ease',
        transform: inHover ? 'scale(1.5)' : 'scale(1)'
      }} />
      
      {/* Blob inferiore sinistro - statico */}
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `${colore}15`,
        filter: 'blur(30px)'
      }} />

      {/* ===========================
          CONTENUTO PRINCIPALE
          =========================== */}
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {/* Header con icona e titolo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          {/* Contenitore icona con gradiente e animazioni */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${colore} 0%, ${colore}dd 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 16px ${colore}40`,
            transition: 'all 0.3s ease',
            transform: inHover ? 'rotate(-5deg) scale(1.1)' : 'rotate(0) scale(1)'
          }}>
            <Icona size={32} color="white" />
          </div>

          {/* Titolo grande e in grassetto */}
          <h2 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: tema.text,
            margin: 0,
            lineHeight: '1'
          }}>
            {titolo}
          </h2>
        </div>

        {/* Descrizione della funzionalità */}
        <p style={{
          fontSize: '16px',
          color: tema.textSecondary,
          lineHeight: '1.6',
          marginBottom: '24px',
          flex: 1
        }}>
          {descrizione}
        </p>

        {/* ===========================
            PULSANTE DI AZIONE
            =========================== */}
        
        <a 
          href={collegamento}
          style={{ textDecoration: 'none' }}
        >
          <Button 
            variant="primary" 
            icon={ArrowRight}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${colore} 0%, ${colore}dd 100%)`,
              transform: inHover ? 'translateX(0)' : 'translateX(0)'
            }}
          >
            {testoCollegamento}
            {/* Freccia animata che si muove on hover */}
            <div style={{
              position: 'absolute',
              right: '20px',
              transition: 'transform 0.3s ease',
              transform: inHover ? 'translateX(4px)' : 'translateX(0)'
            }}>
              →
            </div>
          </Button>
        </a>
      </div>
    </Card>
  );
};

export default CardFunzionalita;