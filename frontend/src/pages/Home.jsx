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

import themes from '../theme/themes';
import '../theme/globalStyles';
import { AppProvider, useTheme } from '../context/AppContext';
import ParticleBackground from '../components/ui/home/ParticleBackground_Home';
import FeatureCard from '../components/ui/home/FeatureCard_Home';
import StatCard from '../components/ui/home/StatCard_Home';
import Card from '../components/ui/home/Card_Home';
import Button from '../components/ui/home/Button_Home';

function HomeContent() {
  const [theme, toggleTheme, isDark] = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ scuole: 0, docenti: 0, classi: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/home/stats');
        if (!response.ok) throw new Error('Errore nel recupero delle statistiche');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Errore:', err);
        setError('Errore nel caricamento delle statistiche');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: theme.background,
    color: theme.text,
    position: 'relative',
    overflow: 'hidden'
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Statistiche',
      description: 'Analizza i dati completi del registro con grafici interattivi e metriche dettagliate in tempo reale.',
      link: '/statistiche',
      linkText: 'Esplora Statistiche',
      color: theme.primary
    },
    {
      icon: GraduationCap,
      title: 'Registro',
      description: 'Accedi come studente o docente per gestire voti, visualizzare medie e monitorare il rendimento.',
      link: '/login',
      linkText: 'Accedi al Registro',
      color: theme.success
    }
  ];

  return (
    <div style={containerStyle}>
      <ParticleBackground />
      
      <div style={{
        background: theme.gradientHero,
        position: 'relative',
        overflow: 'hidden'
      }}>
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

        <header style={{
          padding: '24px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <School size={32} color="white" />
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
              NoSchoolQL
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }} className="hide-mobile">
              <Clock size={20} style={{ display: 'inline', marginRight: '8px' }} />
              {currentTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              icon={isDark ? Sun : Moon}
              onClick={toggleTheme}
              style={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              {isDark ? 'Light' : 'Dark'}
            </Button>
          </div>
        </header>

        <div style={{
          padding: '80px 48px 120px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <div className="animate-fadeIn">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
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
            
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '600px',
              margin: '0 auto 48px',
              lineHeight: '1.6'
            , animationDelay: '0.2s' }} className="animate-slideIn">
              La piattaforma completa per la gestione digitale del registro scolastico. 
              Accedi alle statistiche dettagliate o gestisci i voti in modo semplice e intuitivo.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            maxWidth: '800px',
            margin: '0 auto'
          , animationDelay: '0.4s' }} className="animate-slideIn">
            {loading ? (
              <p style={{ color: 'white' }}>Caricamento dati...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              <>
                <StatCard icon={School} value={stats.scuole} label="Scuole" color="white" />
                <StatCard icon={UserCheck} value={stats.docenti} label="Docenti" color="white" />
                <StatCard icon={Users} value={stats.classi} label="Classi" color="white" />
              </>
            )}
          </div>
        </div>
      </div>

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
            color: theme.textSecondary,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Scegli una delle due modalità per iniziare ad esplorare le funzionalità della piattaforma.
          </p>
          <br/><br/>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {features.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                link={feature.link}
                linkText={feature.linkText}
                color={feature.color}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </div>

      <footer style={{
        padding: '40px 48px',
        backgroundColor: theme.backgroundSecondary,
        borderTop: `1px solid ${theme.border}`,
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <p style={{
          fontSize: '14px',
          color: theme.textTertiary
        }}>
          Creato da Antonio Di Giorgio
        </p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  );
}
