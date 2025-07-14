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

import themes from '../theme/themes';
import '../theme/globalStyles';
import { AppProvider, useApp } from '../context/AppContext';
import ApiService from '../services/ApiService';
import useApiCall from '../hooks/useApiCall';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/Spinner';
import Content from '../layout/Content';
import Header from '../layout/Header';
import Layout from '../layout/Layout';
import Main from '../layout/Main';
import Sidebar from '../layout/Sidebar';
import DocenteDashboard from '../views/docente/DocenteDashboard';
import DocenteSidebar from '../views/docente/DocenteSidebar';
import StudentCard from '../views/docente/StudentCard';
import VotiList from '../views/docente/VotiList';
import VotoForm from '../views/docente/VotoForm';
import DashboardGenerale from '../views/studente/DashboardGenerale';
import MateriaView from '../views/studente/MateriaView';
import StudenteDashboard from '../views/studente/StudenteDashboard';
import StudenteSidebar from '../views/studente/StudenteSidebar';
import StudentVotoCard from '../views/studente/StudentVotoCard';

const RegistroApp = () => {
  const {
    user, 
    setUser,
    currentView, 
    setCurrentView,
    currentTheme, 
    theme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen,
    loading,
    error,
    setError
  } = useApp();
  
  const [classeSelezionata, setClasseSelezionata] = useState(null);
  const [materiaSelezionata, setMateriaSelezionata] = useState(null);
  const [classiDocente, setClassiDocente] = useState([]);
  const [materieDocente, setMaterieDocente] = useState([]);
  const [studentiClasse, setStudentiClasse] = useState([]);
  const [materieStudente, setMaterieStudente] = useState([]);
  const execute = useApiCall();

  useEffect(() => {
    const tipo = localStorage.getItem('tipo');
    const id = localStorage.getItem('id');

    if (tipo && id) {
      setUser({ tipo, id });
      setCurrentView('dashboard');
    }
  }, []);

  useEffect(() => {
    if (user && currentView === 'dashboard') {
      if (user.tipo === 'docente') {
        loadDocenteData();
      } else {
        loadStudenteData();
      }
    }
  }, [user, currentView]);

  useEffect(() => {
    if (classeSelezionata && user?.tipo === 'docente') {
      loadStudentiClasse();
    }
  }, [classeSelezionata]);

  const loadDocenteData = async () => {
    try {
      const [classiData, materieData] = await Promise.all([
        execute(() => ApiService.getClassiDocente(user)),
        execute(() => ApiService.getMaterieDocente(user))
      ]);
      
      const classiUniche = [...new Set(classiData.classi.map(c => c.nome_classe))];
      setClassiDocente(classiUniche);
      setMaterieDocente(materieData.materie);
    } catch (error) {
      console.error('Errore caricamento dati docente:', error);
    }
  };

  const loadStudenteData = async () => {
    try {
      const votiData = await execute(() => ApiService.getVotiStudente(user));
      const materieUniche = [...new Set(votiData.voti.map(v => v.materia))];
      setMaterieStudente(materieUniche);
    } catch (error) {
      console.error('Errore caricamento dati studente:', error);
    }
  };

  const loadStudentiClasse = async () => {
    try {
      const data = await execute(() => ApiService.getClassiDocente(user));
      const studentiFiltered = data.classi.filter(c => c.nome_classe === classeSelezionata);
      setStudentiClasse(studentiFiltered);
    } catch (error) {
      console.error('Errore caricamento studenti classe:', error);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      {/* Sidebar */}
      <Sidebar>
        {user.tipo === 'docente' ? (
          <DocenteSidebar
            classi={classiDocente}
            classeSelezionata={classeSelezionata}
            onSelectClasse={setClasseSelezionata}
          />
        ) : (
          <StudenteSidebar
            materie={materieStudente}
            materiaSelezionata={materiaSelezionata}
            onSelectMateria={setMateriaSelezionata}
          />
        )}
      </Sidebar>

      {/* Main Content */}
      <Main>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
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
                color: currentTheme.text
              }}
              onMouseEnter={e => e.currentTarget.style.background = currentTheme.backgroundSecondary}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
              className="hide-tablet"
            >
              <ChevronRight 
                size={24} 
                style={{
                  transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </button>
            
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
                {user.tipo === 'docente' ? 'Area Docente' : 'Area Studente'}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={toggleTheme}
              style={{
                background: currentTheme.backgroundSecondary,
                border: `1px solid ${currentTheme.border}`,
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
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </Header>

        <Content>
          {loading && <LoadingSpinner />}
          {error && <Alert type="error" onClose={() => useApp().setError(null)}>{error}</Alert>}
          
          {user.tipo === 'docente' ? (
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

// ==================== EXPORT ====================
export default function App() {
  return (
    <AppProvider>
      <RegistroApp />
    </AppProvider>
  );
}