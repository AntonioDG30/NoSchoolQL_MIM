/**
 * CONTEXT GLOBALE DELL'APPLICAZIONE
 * 
 * Gestisco lo stato globale dell'applicazione attraverso React Context.
 * Questo include:
 * - Dati utente e autenticazione
 * - Stato di caricamento ed errori
 * - Vista corrente e stato sidebar
 * - Tema (chiaro/scuro) con auto-detection
 * 
 * Fornisco anche hooks personalizzati per accedere facilmente al context.
 * 
 * @author Antonio Di Giorgio
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import themes from '../theme/themes';

// ===========================
// CREAZIONE CONTEXT
// ===========================

const ContextApp = createContext();

/**
 * Provider del context globale dell'applicazione.
 * Avvolge l'intera app per fornire accesso allo stato globale.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Componenti figli
 */
const AppProvider = ({ children }) => {
  // ===========================
  // STATO UTENTE E AUTENTICAZIONE
  // ===========================
  
  const [utente, impostaUtente] = useState(null);
  const [caricamento, impostaCaricamento] = useState(false);
  const [errore, impostaErrore] = useState(null);
  
  // ===========================
  // STATO INTERFACCIA
  // ===========================
  
  const [vistaCorrente, impostaVistaCorrente] = useState('login');
  const [sidebarAperta, impostaSidebarAperta] = useState(true);
  
  // ===========================
  // GESTIONE TEMA
  // ===========================
  
  const [temaScuro, impostaTemaScuro] = useState(false);

  /**
   * All'avvio, rilevo le preferenze del sistema per il tema.
   * Uso la media query 'prefers-color-scheme' per determinare
   * se l'utente preferisce il tema scuro.
   */
  useEffect(() => {
    // Controllo le preferenze del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    impostaTemaScuro(mediaQuery.matches);

    /**
     * Aggiungo un listener per reagire ai cambiamenti delle preferenze
     * del sistema in tempo reale (es. quando l'utente cambia tema OS).
     */
    const gestisciCambio = e => impostaTemaScuro(e.matches);
    mediaQuery.addEventListener('change', gestisciCambio);
    
    // Cleanup: rimuovo il listener quando il componente viene smontato
    return () => mediaQuery.removeEventListener('change', gestisciCambio);
  }, []);

  // Funzione per alternare manualmente il tema
  const alternaTema = () => impostaTemaScuro(precedente => !precedente);

  // Determino quale tema usare
  const chiaveTema = temaScuro ? 'dark' : 'light';
  const temaCorrente = themes[chiaveTema];

  // ===========================
  // VALORE DEL CONTEXT
  // ===========================
  
  /**
   * Espongo tutti i valori e le funzioni necessarie
   * attraverso il context provider.
   */
  return (
    <ContextApp.Provider value={{
      // Stato utente
      utente,
      impostaUtente,
      caricamento,
      impostaCaricamento,
      errore,
      impostaErrore,

      // Stato interfaccia
      vistaCorrente,
      impostaVistaCorrente,
      sidebarAperta,
      impostaSidebarAperta,

      // Tema
      temaScuro,
      chiaveTema,
      temaCorrente,
      alternaTema,
    }}>
      {children}
    </ContextApp.Provider>
  );
};

// ===========================
// HOOKS PERSONALIZZATI
// ===========================

/**
 * Hook per accedere al context dell'applicazione.
 * Verifica che sia usato all'interno del Provider.
 * 
 * @returns {Object} Valore del context
 * @throws {Error} Se usato fuori dal Provider
 */
const useApp = () => {
  const context = useContext(ContextApp);
  
  if (!context) {
    throw new Error('useApp deve essere utilizzato all\'interno di AppProvider');
  }
  
  return context;
};

/**
 * Hook specializzato per la gestione del tema.
 * Restituisce un array con tema corrente, funzione toggle, stato dark e chiave tema.
 * 
 * @returns {Array} [temaCorrente, alternaTema, temaScuro, chiaveTema]
 */
const useTheme = () => {
  const { temaCorrente, temaScuro, alternaTema, chiaveTema } = useApp();
  return [temaCorrente, alternaTema, temaScuro, chiaveTema];
};

// ===========================
// EXPORT
// ===========================

export { AppProvider, useApp, useTheme };
