/**
 * COMPONENTE LOGIN
 * 
 * Gestisco la pagina di autenticazione del registro elettronico.
 * Gli utenti possono accedere inserendo il loro ID (studente o docente).
 * 
 * Il sistema tenta prima l'autenticazione come studente, poi come
 * docente. In caso di successo, salvo le credenziali in localStorage
 * e reindirizzo alla dashboard appropriata.
 * 
 * @author Antonio Di Giorgio
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, School, LogOut } from 'lucide-react';

import { AppProvider, useApp } from '../context/AppContext';
import Card from '../components/ui/registro/Card_Registro';
import Input from '../components/ui/registro/Input_Registro';
import Button from '../components/ui/registro/Button_Registro';

/**
 * Contenuto interno del componente Login.
 * Separato per poter utilizzare gli hooks del context.
 */
function ContenutoLogin() {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const navigate = useNavigate();
  const { impostaUtente, impostaVistaCorrente, temaCorrente } = useApp();

  // Stati locali per il form
  const [id, impostaId] = useState('');
  const [errore, impostaErrore] = useState('');
  const [inCaricamento, impostaInCaricamento] = useState(false);

  // ===========================
  // GESTIONE LOGIN
  // ===========================
  
  /**
   * Gestisco il processo di login tentando prima come studente,
   * poi come docente. Se uno dei due ha successo, salvo i dati
   * e reindirizzo alla dashboard.
   */
  const gestisciLogin = async () => {
    // Reset errore precedente
    impostaErrore('');
    
    // Validazione input
    if (!id) {
      impostaErrore('Inserisci un ID');
      return;
    }

    impostaInCaricamento(true);

    // ===========================
    // TENTATIVO LOGIN STUDENTE
    // ===========================
    
    try {
      const rispostaStudente = await fetch('http://localhost:3000/api/registro/studente/voti', {
        headers: { Authorization: `STUDENTE:${id}` }
      });

      if (rispostaStudente.ok) {
        // Login studente riuscito
        localStorage.setItem('id', id);
        localStorage.setItem('tipo', 'studente');
        impostaUtente({ id, tipo: 'studente' });
        impostaVistaCorrente('dashboard');
        navigate('/registro');
        return;
      }
    } catch (err) {
      console.log('Errore login studente:', err);
    }

    // ===========================
    // TENTATIVO LOGIN DOCENTE
    // ===========================
    
    try {
      const rispostaDocente = await fetch('http://localhost:3000/api/registro/docente/classi', {
        headers: { Authorization: `DOCENTE:${id}` }
      });

      if (rispostaDocente.ok) {
        // Login docente riuscito
        localStorage.setItem('id', id);
        localStorage.setItem('tipo', 'docente');
        impostaUtente({ id, tipo: 'docente' });
        impostaVistaCorrente('dashboard');
        navigate('/registro');
        return;
      }
    } catch (err) {
      console.log('Errore login docente:', err);
    }

    // Se arriviamo qui, nessun login è riuscito
    impostaErrore('ID non valido. Riprova.');
    impostaInCaricamento(false);
  };

  /**
   * Reindirizzo alla home page.
   */
  const tornaAllaHome = () => {
    navigate('/');
  };

  // ===========================
  // STILI
  // ===========================
  
  const stileContenitore = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${temaCorrente.primary} 0%, ${temaCorrente.primaryHover} 100%)`,
    padding: '20px'
  };

  const stileForm = {
    width: '100%',
    maxWidth: '440px'
  };

  const stileLogo = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const stileTitolo = {
    fontSize: '32px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px'
  };

  const stileSottotitolo = {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.8)'
  };

  return (
    <div style={stileContenitore}>
      <div style={stileForm}>
        {/* ===========================
            HEADER LOGIN
            =========================== */}
        
        <div style={stileLogo} className="animate-fade-in">
          <GraduationCap size={64} color="white" style={{ marginBottom: '16px' }} />
          <h1 style={stileTitolo}>Registro Elettronico</h1>
          <p style={stileSottotitolo}>Accedi con il tuo ID</p>
        </div>

        {/* ===========================
            FORM LOGIN
            =========================== */}
        
        <Card style={{ padding: '40px' }} className="animate-slide-in">
          <Input
            label="ID Utente"
            icon={School}
            type="text"
            placeholder="es. STU000001 o DOC00001"
            value={id}
            onChange={(e) => impostaId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && gestisciLogin()}
            error={errore}
          />

          <Button
            onClick={gestisciLogin}
            disabled={inCaricamento}
            style={{ width: '100%', marginTop: '16px' }}
            size="lg"
          >
            {inCaricamento ? 'Accesso in corso...' : 'Accedi'}
          </Button>

          <Button
            onClick={tornaAllaHome}
            variant="danger"
            icon={LogOut}
            style={{ width: '100%', marginTop: '16px' }}
            size="lg"
          >
            Torna alla Home
          </Button>
        </Card>
      </div>
    </div>
  );
}

/**
 * Componente principale con Provider.
 * Wrappa il contenuto con AppProvider per fornire il context.
 */
export default function VistaLogin() {
  return (
    <AppProvider>
      <ContenutoLogin />
    </AppProvider>
  );
}