/**
 * ENTRY POINT DELL'APPLICAZIONE REACT
 * 
 * Questo è il punto di ingresso principale dell'applicazione React.
 * Qui configuro:
 * - Il rendering dell'app nel DOM
 * - React StrictMode per controlli aggiuntivi in sviluppo
 * - BrowserRouter per la gestione del routing
 * 
 * L'app viene renderizzata nell'elemento con id 'root'
 * presente nel file index.html.
 * 
 * @author Antonio Di Giorgio
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// ===========================
// RENDERING APPLICAZIONE
// ===========================

/**
 * Creo il root React e renderizzo l'applicazione.
 * 
 * StrictMode attiva controlli aggiuntivi in sviluppo:
 * - Identifica componenti con lifecycle non sicuri
 * - Avverte su uso deprecato delle API
 * - Identifica effetti collaterali inaspettati
 * - Garantisce che i componenti siano puri
 * 
 * BrowserRouter fornisce il context per il routing,
 * permettendo l'uso di Route, Link, Navigate, ecc.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);