/**
 * COMPONENTE ROUTE PROTETTA
 * 
 * Gestisco la protezione delle route che richiedono autenticazione.
 * Questo componente verifica se l'utente ha effettuato l'accesso
 * controllando la presenza dei dati di autenticazione nel localStorage.
 * 
 * Se l'utente non è autenticato, viene automaticamente reindirizzato
 * alla pagina di login.
 * 
 * @author Antonio Di Giorgio
 */

import { Navigate } from 'react-router-dom';

/**
 * Componente per proteggere le route che richiedono autenticazione.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Componenti figli da renderizzare se autenticato
 * @returns {React.ReactNode} I componenti figli se autenticato, altrimenti redirect al login
 */
export default function RouteProtetta({ children }) {
  // ===========================
  // VERIFICA AUTENTICAZIONE
  // ===========================
  
  // Recupero i dati di autenticazione dal localStorage
  const idUtente = localStorage.getItem('id');
  const tipoUtente = localStorage.getItem('tipo');

  // ===========================
  // CONTROLLO ACCESSO
  // ===========================
  
  /**
   * Se mancano l'ID utente o il tipo (studente/docente),
   * considero l'utente non autenticato e lo reindirizzo al login.
   * 
   * Il flag "replace" sostituisce la cronologia invece di aggiungere
   * una nuova entry, evitando problemi con il pulsante "indietro".
   */
  if (!idUtente || !tipoUtente) {
    return <Navigate to="/login" replace />;
  }

  // ===========================
  // RENDERING COMPONENTI PROTETTI
  // ===========================
  
  // Se l'utente è autenticato, renderizzo i componenti figli
  return children;
}