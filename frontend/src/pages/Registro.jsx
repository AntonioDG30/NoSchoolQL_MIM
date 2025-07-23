/**
 * COMPONENTE REGISTRO ELETTRONICO
 * 
 * Questa è l'applicazione principale del registro elettronico.
 * Gestisco due modalità:
 * - DOCENTE: visualizzazione classi, gestione voti studenti
 * - STUDENTE: visualizzazione propri voti e statistiche
 * 
 * L'app carica automaticamente i dati appropriati in base al
 * tipo di utente e gestisce la navigazione tra le diverse viste.
 * 
 * @author Antonio Di Giorgio
 */

import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler
} from 'chart.js';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Filter,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  LogOut,
  Award,
  BarChart3,
  Sun,
  Moon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Save,
  X,
  User,
  School,
  Activity,
  Target,
  Clock,
  FileText,
  PieChart,
  Zap
} from 'lucide-react';

// Registro i componenti Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler
);

// Import temi e stili
import themes from '../theme/themes';
import '../theme/globalStyles';
import { AppProvider, useApp } from '../context/AppContext';

// Import componenti UI
import Button from '../components/ui/registro/Button_Registro';
import Card from '../components/ui/registro/Card_Registro';
import Input from '../components/ui/registro/Input_Registro';
import Select from '../components/ui/registro/Select_Registro';
import Badge from '../components/ui/registro/Badge_Registro';
import Alert from '../components/ui/registro/Alert_Registro';
import Modal from '../components/ui/registro/Modal_Registro';
import LoadingSpinner from '../components/ui/registro/Spinner_Registro';

// Import componenti layout
import Content from '../layout/Content';
import Header from '../layout/Header';
import Layout from '../layout/Layout';
import Main from '../layout/Main';
import Sidebar from '../layout/Sidebar';

// Import viste docente
import DocenteDashboard from '../views/docente/DocenteDashboard';
import DocenteSidebar from '../views/docente/DocenteSidebar';
import StudentCard from '../views/docente/StudentCard';
import VotiList from '../views/docente/VotiList';
import VotoForm from '../views/docente/VotoForm';

// Import viste studente
import DashboardGenerale from '../views/studente/DashboardGenerale';
import MateriaView from '../views/studente/MateriaView';
import StudenteDashboard from '../views/studente/StudenteDashboard';
import StudenteSidebar from '../views/studente/StudenteSidebar';
import StudentVotoCard from '../views/studente/StudentVotoCard';

/**
 * Componente principale del registro.
 * Gestisce routing, caricamento dati e stato globale.
 */
const AppRegistro = () => {
  // ===========================
  // RECUPERO STATO GLOBALE
  // ===========================
  
  const {
    utente,
    impostaUtente,
    vistaCorrente,
    impostaVistaCorrente,
    temaCorrente,
    chiaveTema: tema,           
    alternaTema,
    sidebarAperta,
    impostaSidebarAperta,
    caricamento,
    errore,
    impostaErrore,
    impostaCaricamento
  } = useApp();
  
  // ===========================
  // STATO LOCALE
  // ===========================
  
  // Stati per docente
  const [classeSelezionata, impostaClasseSelezionata] = useState(null);
  const [materiaSelezionata, impostaMateriaSelezionata] = useState(null);
  const [classiDocente, impostaClassiDocente] = useState([]);
  const [materieDocente, impostaMaterieDocente] = useState([]);
  const [studentiClasse, impostaStudentiClasse] = useState([]);
  
  // Stati per studente
  const [materieStudente, impostaMaterieStudente] = useState([]);

  // ===========================
  // INIZIALIZZAZIONE
  // ===========================
  
  /**
   * All'avvio, verifico se ci sono credenziali salvate
   * in localStorage e le ripristino.
   */
  useEffect(() => {
    const tipo = localStorage.getItem('tipo');
    const id = localStorage.getItem('id');

    if (tipo && id) {
      impostaUtente({ tipo, id });
      impostaVistaCorrente('dashboard');
    }
  }, []);

  /**
   * Quando l'utente è autenticato e siamo nella dashboard,
   * carico i dati appropriati in base al tipo di utente.
   */
  useEffect(() => {
    if (utente && vistaCorrente === 'dashboard') {
      if (utente.tipo === 'docente') {
        caricaDatiDocente();
      } else {
        caricaDatiStudente();
      }
    }
  }, [utente, vistaCorrente]);

  /**
   * Quando un docente seleziona una classe,
   * carico la lista degli studenti di quella classe.
   */
  useEffect(() => {
    if (classeSelezionata && utente?.tipo === 'docente') {
      caricaStudentiClasse();
    }
  }, [classeSelezionata]);

  // ===========================
  // CARICAMENTO DATI DOCENTE
  // ===========================
  
  /**
   * Carico classi e materie del docente.
   * Uso Promise.all per parallelizzare le richieste.
   */
  const caricaDatiDocente = async () => {
    impostaCaricamento(true);
    impostaErrore(null);
    
    try {
      const headers = {
        Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`
      };

      const [rispostaClassi, rispostaMaterie] = await Promise.all([
        fetch('http://localhost:3000/api/registro/docente/classi', { headers }),
        fetch('http://localhost:3000/api/registro/docente/materie', { headers })
      ]);

      if (!rispostaClassi.ok || !rispostaMaterie.ok) {
        throw new Error('Errore nel caricamento dei dati docente');
      }

      const [datiClassi, datiMaterie] = await Promise.all([
        rispostaClassi.json(),
        rispostaMaterie.json()
      ]);
      
      // Estraggo classi uniche
      const classiUniche = [...new Set(datiClassi.classi.map(c => c.nome_classe))];
      impostaClassiDocente(classiUniche);
      impostaMaterieDocente(datiMaterie.materie);
    } catch (error) {
      console.error('Errore caricamento dati docente:', error);
      impostaErrore(error.message);
    } finally {
      impostaCaricamento(false);
    }
  };

  // ===========================
  // CARICAMENTO DATI STUDENTE
  // ===========================
  
  /**
   * Carico i voti dello studente e estraggo
   * le materie uniche per la navigazione.
   */
  const caricaDatiStudente = async () => {
    impostaCaricamento(true);
    impostaErrore(null);
    
    try {
      const risposta = await fetch('http://localhost:3000/api/registro/studente/voti', {
        headers: {
          Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`
        }
      });

      if (!risposta.ok) {
        throw new Error('Errore nel caricamento dei dati studente');
      }

      const datiVoti = await risposta.json();
      
      // Estraggo materie uniche dai voti
      const materieUniche = [...new Set(datiVoti.voti.map(v => v.materia))];
      impostaMaterieStudente(materieUniche);
    } catch (error) {
      console.error('Errore caricamento dati studente:', error);
      impostaErrore(error.message);
    } finally {
      impostaCaricamento(false);
    }
  };

  // ===========================
  // CARICAMENTO STUDENTI CLASSE
  // ===========================
  
  /**
   * Carico gli studenti della classe selezionata
   * dal docente per visualizzare i loro voti.
   */
  const caricaStudentiClasse = async () => {
    impostaCaricamento(true);
    impostaErrore(null);
    
    try {
      const risposta = await fetch('http://localhost:3000/api/registro/docente/classi', {
        headers: {
          Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`
        }
      });

      if (!risposta.ok) {
        throw new Error('Errore nel caricamento degli studenti');
      }

      const dati = await risposta.json();
      
      // Filtro solo gli studenti della classe selezionata
      const studentiFiltrati = dati.classi.filter(c => c.nome_classe === classeSelezionata);
      impostaStudentiClasse(studentiFiltrati);
    } catch (error) {
      console.error('Errore caricamento studenti classe:', error);
      impostaErrore(error.message);
    } finally {
      impostaCaricamento(false);
    }
  };

  // Se non c'è utente autenticato, mostro lo spinner
  if (!utente) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      {/* ===========================
          SIDEBAR
          =========================== */}
      
      <Sidebar>
        {utente.tipo === 'docente' ? (
          <DocenteSidebar
            classi={classiDocente}
            classeSelezionata={classeSelezionata}
            onSelectClasse={impostaClasseSelezionata}
          />
        ) : (
          <StudenteSidebar
            materie={materieStudente}
            materiaSelezionata={materiaSelezionata}
            onSelectMateria={impostaMateriaSelezionata}
          />
        )}
      </Sidebar>

      {/* ===========================
          CONTENUTO PRINCIPALE
          =========================== */}
      
      <Main>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Toggle sidebar */}
            <button
              onClick={() => impostaSidebarAperta(!sidebarAperta)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease',
                color: temaCorrente.text
              }}
              onMouseEnter={e => e.currentTarget.style.background = temaCorrente.backgroundSecondary}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
              className="hide-tablet"
            >
              <ChevronRight 
                size={24} 
                style={{
                  transform: sidebarAperta ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </button>
            
            {/* Titolo area */}
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
                {utente.tipo === 'docente' ? 'Area Docente' : 'Area Studente'}
              </h2>
            </div>
          </div>

          {/* Toggle tema */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={alternaTema}
              style={{
                background: temaCorrente.backgroundSecondary,
                border: `1px solid ${temaCorrente.border}`,
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {tema === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </Header>

        {/* ===========================
            CONTENUTO DASHBOARD
            =========================== */}
        
        <Content>
          {/* Stati globali */}
          {caricamento && <LoadingSpinner />}
          {errore && <Alert type="error" onClose={() => impostaErrore(null)}>{errore}</Alert>}
          
          {/* Dashboard appropriata per tipo utente */}
          {utente.tipo === 'docente' ? (
            <DocenteDashboard
              classeSelezionata={classeSelezionata}
              studentiClasse={studentiClasse}
              materie={materieDocente}
            />
          ) : (
            <StudenteDashboard
              materiaSelezionata={materiaSelezionata}
            />
          )}
        </Content>
      </Main>
    </Layout>
  );
};

/**
 * Componente principale con Provider.
 * Wrappa l'app con AppProvider per fornire il context.
 */
export default function App() {
  return (
    <AppProvider>
      <AppRegistro />
    </AppProvider>
  );
}