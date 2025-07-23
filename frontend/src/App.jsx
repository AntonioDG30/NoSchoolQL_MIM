/**
 * COMPONENTE APP PRINCIPALE
 * 
 * Questo è il componente root dell'applicazione che gestisce
 * il routing principale. Definisco tutte le route dell'applicazione
 * e proteggo quelle che richiedono autenticazione.
 * 
 * Route disponibili:
 * - / : Homepage pubblica
 * - /login : Pagina di login
 * - /registro : Registro (protetto, richiede autenticazione)
 * - /statistiche : Statistiche pubbliche
 * - * : Redirect alla homepage per route non valide
 * 
 * @author Antonio Di Giorgio
 */

import { Routes, Route, Navigate } from 'react-router-dom';

// Import delle pagine
import Home from './pages/Home';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Statistiche from './pages/Statistiche';

// Import del componente per proteggere le route
import ProtectedRoute from './components/routing/ProtectedRoute'; 

function App() {
  return (
    <Routes>
      {/* ===========================
          ROUTE PUBBLICHE
          =========================== */}
      
      {/* Homepage principale */}
      <Route path="/" element={<Home />} />
      
      {/* Pagina di login per studenti e docenti */}
      <Route path="/login" element={<Login />} />
      
      {/* ===========================
          ROUTE PROTETTE
          =========================== */}
      
      {/* 
        Registro elettronico - richiede autenticazione.
        ProtectedRoute verifica la presenza dei dati di login
        e reindirizza al login se l'utente non è autenticato.
      */}
      <Route
        path="/registro"
        element={
          <ProtectedRoute>
            <Registro />
          </ProtectedRoute>
        }
      />

      {/* ===========================
          ALTRE ROUTE PUBBLICHE
          =========================== */}
      
      {/* Pagina statistiche - accessibile a tutti */}
      <Route path="/Statistiche" element={<Statistiche />} />
      
      {/* ===========================
          ROUTE DI FALLBACK
          =========================== */}
      
      {/* 
        Qualsiasi route non definita viene reindirizzata alla homepage.
        Questo gestisce URL errati o non esistenti.
      */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;