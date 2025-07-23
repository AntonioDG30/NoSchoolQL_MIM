/**
 * COMPONENTE HOMEPAGE
 * 
 * Questa è la pagina principale dell'applicazione NoSchoolQL.
 * Mostro una hero section con animazioni, statistiche in tempo reale,
 * e card interattive per navigare verso le funzionalità principali.
 * 
 * La pagina include:
 * - Header con orologio e toggle tema
 * - Hero section con gradiente e particelle
 * - Statistiche dal backend (scuole, docenti, classi)
 * - Card funzionalità per Statistiche e Registro
 * - Footer con crediti
 * 
 * @author Antonio Di Giorgio
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap,
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles,
  School,
  Activity,
  Database,
  FileText,
  Sun,
  Moon,
  Zap,
  Target,
  Globe,
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
  UserCheck
} from 'lucide-react';

// Import temi e stili
import themes from '../theme/themes';
import '../theme/globalStyles';

// Import context
import { AppProvider, useTheme } from '../context/AppContext';

// Import componenti UI
import ParticleBackground from '../components/ui/home/ParticleBackground_Home';
import FeatureCard from '../components/ui/home/FeatureCard_Home';
import StatCard from '../components/ui/home/StatCard_Home';
import Card from '../components/ui/home/Card_Home';
import Button from '../components/ui/home/Button_Home';

/**
 * Componente interno che contiene la logica della homepage.
 * Separato per poter usare gli hooks del context.
 */
function ContenutoHome() {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  // Hook per gestione tema
  const [tema, alternaTema, temaScuro] = useTheme();
  
  // Stato per orologio in tempo reale
  const [orarioCorrente, impostaOrarioCorrente] = useState(new Date());
  
  // Stato per statistiche dal backend
  const [statistiche, impostaStatistiche] = useState({ 
    scuole: 0, 
    docenti: 0, 
    classi: 0 
  });
  
  // Stati di caricamento ed errore
  const [caricamento, impostaCaricamento] = useState(true);
  const [errore, impostaErrore] = useState(null);

  // ===========================
  // EFFECT OROLOGIO
  // ===========================
  
  /**
   * Aggiorno l'orologio ogni secondo per mostrare l'ora corrente.
   * Pulisco l'intervallo quando il componente viene smontato.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      impostaOrarioCorrente(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ===========================
  // EFFECT CARICAMENTO STATISTICHE
  // ===========================
  
  /**
   * Recupero le statistiche dal backend all'avvio.
   * Gestisco stati di caricamento ed eventuali errori.
   */
  useEffect(() => {
    const recuperaStatistiche = async () => {
      try {
        const risposta = await fetch('http://localhost:3000/api/home/stats');
        
        if (!risposta.ok) {
          throw new Error('Errore nel recupero delle statistiche');
        }
        
        const dati = await risposta.json();
        impostaStatistiche(dati);
        
      } catch (err) {
        console.error('Errore:', err);
        impostaErrore('Errore nel caricamento delle statistiche');
      } finally {
        impostaCaricamento(false);
      }
    };

    recuperaStatistiche();
  }, []);

  // ===========================
  // CONFIGURAZIONE STILI
  // ===========================
  
  const stileContenitore = {
    minHeight: '100vh',
    backgroundColor: tema.background,
    color: tema.text,
    position: 'relative',
    overflow: 'hidden'
  };

  // ===========================
  // DATI FUNZIONALITÀ
  // ===========================
  
  /**
   * Definisco le due funzionalità principali dell'app.
   * Ogni funzionalità ha icona, titolo, descrizione e link.
   */
  const funzionalita = [
    {
      icon: BarChart3,
      title: 'Statistiche',
      description: 'Analizza i dati completi del registro con grafici interattivi e metriche dettagliate in tempo reale.',
      link: '/statistiche',
      linkText: 'Esplora Statistiche',
      color: tema.primary
    },
    {
      icon: GraduationCap,
      title: 'Registro',
      description: 'Accedi come studente o docente per gestire voti, visualizzare medie e monitorare il rendimento.',
      link: '/login',
      linkText: 'Accedi al Registro',
      color: tema.success
    }
  ];

  return (
    <div style={stileContenitore}>
      {/* Sfondo con particelle animate */}
      <ParticleBackground />
      
      {/* ===========================
          HERO SECTION
          =========================== */}
      
      <div style={{
        background: tema.gradientHero,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Blob decorativi animati */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(40px)',
          animation: 'float 10s ease-in-out infinite'
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          filter: 'blur(60px)',
          animation: 'float 15s ease-in-out infinite reverse'
        }} />

        {/* ===========================
            HEADER
            =========================== */}
        
        <header style={{
          padding: '24px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Logo e nome app */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <School size={32} color="white" />
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
              NoSchoolQL
            </span>
          </div>

          {/* Orologio e toggle tema */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Orologio (nascosto su mobile) */}
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }} className="hide-mobile">
              <Clock size={20} style={{ display: 'inline', marginRight: '8px' }} />
              {orarioCorrente.toLocaleTimeString('it-IT', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            
            {/* Toggle tema */}
            <Button
              variant="ghost"
              size="sm"
              icon={temaScuro ? Sun : Moon}
              onClick={alternaTema}
              style={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              {temaScuro ? 'Light' : 'Dark'}
            </Button>
          </div>
        </header>

        {/* ===========================
            CONTENUTO HERO
            =========================== */}
        
        <div style={{
          padding: '80px 48px 120px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <div className="animate-fadeIn">
            {/* Badge sistema scolastico */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '24px' 
            }}>
              <Sparkles size={20} color="#fbbf24" />
              <span style={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Sistema Scolastico Digitale
              </span>
            </div>
            
            {/* Titolo principale */}
            <h1 style={{
              fontSize: '56px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '24px',
              lineHeight: '1.2'
            }} className="animate-slideIn">
              Benvenuto in <br />
              <span style={{ color: '#fbbf24' }}>NoSchoolQL</span>
            </h1>
            
            {/* Descrizione */}
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '600px',
              margin: '0 auto 48px',
              lineHeight: '1.6',
              animationDelay: '0.2s'
            }} className="animate-slideIn">
              La piattaforma completa per la gestione digitale del registro scolastico. 
              Accedi alle statistiche dettagliate o gestisci i voti in modo semplice e intuitivo.
            </p>
          </div>

          {/* ===========================
              STATISTICHE HERO
              =========================== */}
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            maxWidth: '800px',
            margin: '0 auto',
            animationDelay: '0.4s'
          }} className="animate-slideIn">
            {caricamento ? (
              <p style={{ color: 'white' }}>Caricamento dati...</p>
            ) : errore ? (
              <p style={{ color: 'red' }}>{errore}</p>
            ) : (
              <>
                <StatCard 
                  icon={School} 
                  value={statistiche.scuole} 
                  label="Scuole" 
                  color="white" 
                />
                <StatCard 
                  icon={UserCheck} 
                  value={statistiche.docenti} 
                  label="Docenti" 
                  color="white" 
                />
                <StatCard 
                  icon={Users} 
                  value={statistiche.classi} 
                  label="Classi" 
                  color="white" 
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===========================
          SEZIONE FUNZIONALITÀ
          =========================== */}
      
      <div style={{
        padding: '80px 48px',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }} className="animate-fadeIn">
          <h2 style={{
            fontSize: '40px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            Scegli come procedere
          </h2>
          <p style={{
            fontSize: '18px',
            color: tema.textSecondary,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Scegli una delle due modalità per iniziare ad esplorare le funzionalità della piattaforma.
          </p>
          
          <br/><br/>
          
          {/* Griglia card funzionalità */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {funzionalita.map((funz, indice) => (
              <FeatureCard
                key={indice}
                icon={funz.icon}
                title={funz.title}
                description={funz.description}
                link={funz.link}
                linkText={funz.linkText}
                color={funz.color}
                delay={indice * 100}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===========================
          FOOTER
          =========================== */}
      
      <footer style={{
        padding: '40px 48px',
        backgroundColor: tema.backgroundSecondary,
        borderTop: `1px solid ${tema.border}`,
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <p style={{
          fontSize: '14px',
          color: tema.textTertiary
        }}>
          Creato da Antonio Di Giorgio
        </p>
      </footer>
    </div>
  );
}

/**
 * Componente principale che wrappa il contenuto con il Provider.
 * Necessario per fornire il context a tutti i componenti figli.
 */
export default function PaginaHome() {
  return (
    <AppProvider>
      <ContenutoHome />
    </AppProvider>
  );
}