import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  School,
  BookOpen,
  Award,
  Activity,
  Sun,
  Moon,
  Home,
  ChevronDown,
  ChevronUp,
  Globe,
  Flag,
  Grid3x3,
  List,
  Loader,
  Eye,
  EyeOff
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

// ==================== THEME SYSTEM ====================
const themes = {
  light: {
    // Base colors - matching registro elettronico
    background: '#f8fafc',
    backgroundSecondary: '#ffffff',
    backgroundTertiary: '#f1f5f9',
    
    // Text colors
    text: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#94a3b8',
    
    // Border colors
    border: '#e2e8f0',
    borderSecondary: '#cbd5e1',
    
    // Component colors
    cardBackground: '#ffffff',
    cardHover: '#f8fafc',
    headerBackground: 'rgba(255, 255, 255, 0.9)',
    
    // Interactive colors
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: '#dbeafe',
    primaryDark: '#1e40af',
    
    secondary: '#64748b',
    secondaryHover: '#475569',
    secondaryLight: '#f1f5f9',
    
    success: '#10b981',
    successHover: '#059669',
    successLight: '#d1fae5',
    
    danger: '#ef4444',
    dangerHover: '#dc2626',
    dangerLight: '#fee2e2',
    
    warning: '#f59e0b',
    warningHover: '#d97706',
    warningLight: '#fef3c7',
    
    info: '#3b82f6',
    infoHover: '#2563eb',
    infoLight: '#dbeafe',
    
    // Shadows
    shadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.06)',
    shadowMd: '0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.06)',
    shadowLg: '0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.05)',
    shadowXl: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
    
    // Chart colors
    chartColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  },
  dark: {
    // Base colors
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    
    // Text colors
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    
    // Border colors
    border: '#334155',
    borderSecondary: '#475569',
    
    // Component colors
    cardBackground: '#1e293b',
    cardHover: '#334155',
    headerBackground: 'rgba(30, 41, 59, 0.9)',
    
    // Interactive colors
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    primaryLight: '#1e3a8a',
    primaryDark: '#1e40af',
    
    secondary: '#64748b',
    secondaryHover: '#94a3b8',
    secondaryLight: '#334155',
    
    success: '#10b981',
    successHover: '#34d399',
    successLight: '#064e3b',
    
    danger: '#ef4444',
    dangerHover: '#f87171',
    dangerLight: '#7f1d1d',
    
    warning: '#f59e0b',
    warningHover: '#fbbf24',
    warningLight: '#78350f',
    
    info: '#3b82f6',
    infoHover: '#60a5fa',
    infoLight: '#1e3a8a',
    
    // Shadows
    shadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    shadowMd: '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
    shadowLg: '0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)',
    shadowXl: '0 20px 25px rgba(0, 0, 0, 0.3), 0 10px 10px rgba(0, 0, 0, 0.2)',
    
    // Chart colors
    chartColors: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6']
  }
};

// ==================== GLOBAL STYLES ====================
const globalStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }

  .animate-slideIn {
    animation: slideIn 0.6s ease-out;
  }

  .animate-slideInLeft {
    animation: slideInLeft 0.6s ease-out;
  }

  .animate-scaleIn {
    animation: scaleIn 0.4s ease-out;
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  .skeleton-dark {
    background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  /* Hover effects */
  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .hover-lift:hover {
    transform: translateY(-4px);
  }

  /* Glass effect */
  .glass {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  /* Responsive utilities */
  @media (max-width: 768px) {
    .hide-mobile {
      display: none !important;
    }
    
    .mobile-stack {
      flex-direction: column !important;
    }
    
    .mobile-full-width {
      width: 100% !important;
    }
  }

  @media (max-width: 1024px) {
    .hide-tablet {
      display: none !important;
    }
  }
`;

// Inject global styles
if (typeof document !== 'undefined' && !document.getElementById('statistiche-modern-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'statistiche-modern-styles';
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

// ==================== COMPONENTS ====================
const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, style = {}, ...props }) => {
  const [theme] = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const baseStyle = {
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    outline: 'none'
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '10px 20px', fontSize: '16px' },
    lg: { padding: '12px 24px', fontSize: '18px' }
  };

  const variants = {
    primary: {
      backgroundColor: isHovered ? theme.primaryHover : theme.primary,
      color: '#ffffff',
      boxShadow: theme.shadow
    },
    secondary: {
      backgroundColor: isHovered ? theme.secondaryLight : 'transparent',
      color: theme.text,
      border: `1px solid ${theme.border}`
    },
    ghost: {
      backgroundColor: isHovered ? theme.backgroundTertiary : 'transparent',
      color: theme.text
    }
  };

  return (
    <button
      style={{
        ...baseStyle,
        ...sizes[size],
        ...variants[variant],
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', style = {}, hoverable = false, onClick }) => {
  const [theme] = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    backgroundColor: theme.cardBackground,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: hoverable && isHovered ? theme.shadowLg : theme.shadow,
    transition: 'all 0.3s ease',
    cursor: hoverable ? 'pointer' : 'default',
    transform: hoverable && isHovered ? 'translateY(-4px)' : 'translateY(0)',
    ...style
  };

  return (
    <div
      className={`${className} ${hoverable ? 'hover-lift' : ''}`}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

const Accordion = ({ title, icon: Icon, expanded, onToggle, children, delay = 0 }) => {
  const [theme] = useTheme();
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    cursor: 'pointer',
    userSelect: 'none',
    borderBottom: expanded ? `1px solid ${theme.border}` : 'none',
    transition: 'all 0.3s ease'
  };

  const contentStyle = {
    maxHeight: expanded ? `${contentHeight}px` : '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
    opacity: expanded ? 1 : 0
  };

  return (
    <Card
      className="animate-slideIn"
      style={{ 
        padding: 0, 
        overflow: 'hidden',
        animationDelay: `${delay * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <div style={headerStyle} onClick={onToggle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {Icon && <Icon size={24} style={{ color: theme.primary }} />}
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            {title}
          </h3>
        </div>
        <div style={{
          transition: 'transform 0.3s ease',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          color: theme.primary
        }}>
          <ChevronDown size={20} />
        </div>
      </div>
      <div style={contentStyle}>
        <div ref={contentRef} style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </Card>
  );
};

const StatsCard = ({ icon: Icon, title, value, color, delay = 0 }) => {
  const [theme] = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  const cardStyle = {
    height: '100%',
    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'scale(1)' : 'scale(0.9)',
    transition: 'all 0.4s ease'
  };

  return (
    <Card style={cardStyle} hoverable>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            {title}
          </p>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
            {value || <Skeleton />}
          </h2>
        </div>
        <Icon size={48} style={{ opacity: 0.3 }} />
      </div>
      <div style={{
        position: 'absolute',
        bottom: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }} />
    </Card>
  );
};

const Skeleton = ({ width = '60px', height = '32px' }) => {
  const [theme] = useTheme();
  
  return (
    <div
      className={theme.background === themes.dark.background ? 'skeleton-dark' : 'skeleton'}
      style={{
        width,
        height,
        borderRadius: '4px',
        display: 'inline-block'
      }}
    />
  );
};

const LoadingBar = () => {
  const [theme] = useTheme();
  
  return (
    <div style={{
      width: '100%',
      height: '4px',
      backgroundColor: theme.backgroundTertiary,
      borderRadius: '2px',
      overflow: 'hidden',
      marginBottom: '24px'
    }}>
      <div style={{
        width: '30%',
        height: '100%',
        backgroundColor: theme.primary,
        borderRadius: '2px',
        animation: 'loading 1.5s ease-in-out infinite'
      }} />
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

// ==================== THEME CONTEXT ====================
const ThemeContext = React.createContext();

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? themes.dark : themes.light;

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={[theme, toggleTheme, isDark]}>
      {children}
    </ThemeContext.Provider>
  );
};

// ==================== MAIN COMPONENT ====================
function StatisticheContent() {
  const [theme, toggleTheme, isDark] = useTheme();
  const [dati, setDati] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedPanels, setExpandedPanels] = useState({
    cittadinanza: true,
    numeroVotiMateria: true,
    mediaVotiMateria: false,
    classiPerAnno: false,
    studentiPerAnno: false,
    distribuzioneVoti: false
  });
  const [viewMode, setViewMode] = useState('grid');

  const baseUrl = "http://localhost:3000/api/statistiche";

  const fetchData = async (endpoint, key) => {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`);
      const json = await res.json();
      setDati(prev => ({ ...prev, [key]: json }));
    } catch (err) {
      console.error(`Errore nel caricamento di ${key}:`, err);
    }
  };

  const togglePanel = (key) => {
    setExpandedPanels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData("/generali", "generali"),
        fetchData("/studenti/italiani-vs-stranieri", "cittadinanza"),
        fetchData("/voti/numero-per-materia", "numeroVotiMateria"),
        fetchData("/voti/media-per-materia", "mediaVotiMateria"),
        fetchData("/classi/numero-per-annocorso", "classiPerAnno"),
        fetchData("/studenti/numero-per-annocorso", "studentiPerAnno"),
        fetchData("/voti/distribuzione", "distribuzioneVoti")
      ]);
      setLoading(false);
    };
    
    loadAllData();
  }, []);

  // Chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme.text,
          padding: 16,
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: theme.cardBackground,
        titleColor: theme.text,
        bodyColor: theme.textSecondary,
        borderColor: theme.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        ticks: { 
          color: theme.textSecondary,
          font: { size: 11 }
        },
        grid: { 
          color: theme.border,
          drawBorder: false
        }
      },
      y: {
        ticks: { 
          color: theme.textSecondary,
          font: { size: 11 }
        },
        grid: { 
          color: theme.border,
          drawBorder: false
        }
      }
    }
  }), [theme]);

  const statsData = [
    { 
      icon: School, 
      title: 'Studenti', 
      value: dati.generali?.studenti, 
      color: theme.success
    },
    { 
      icon: Users, 
      title: 'Docenti', 
      value: dati.generali?.docenti, 
      color: theme.info
    },
    { 
      icon: BookOpen, 
      title: 'Classi', 
      value: dati.generali?.classi, 
      color: theme.warning
    },
    { 
      icon: Award, 
      title: 'Voti', 
      value: dati.generali?.voti, 
      color: theme.secondary
    },
    { 
      icon: TrendingUp, 
      title: 'Media Voti', 
      value: dati.generali?.media_voti, 
      color: theme.danger
    }
  ];

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: theme.background,
    color: theme.text,
    transition: 'all 0.3s ease',
    padding: '24px'
  };

  const headerStyle = {
    backgroundColor: theme.headerBackground,
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    border: `1px solid ${theme.border}`,
    boxShadow: theme.shadowMd
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(350px, 1fr))' : '1fr',
    gap: '24px',
    marginBottom: '32px'
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={headerStyle} className="animate-fadeIn glass">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Activity size={40} style={{ color: theme.primary }} />
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
                  Statistiche Generali
                </h1>
                <p style={{ color: theme.textSecondary }}>
                  Panoramica completa del registro elettronico
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '4px', backgroundColor: theme.backgroundTertiary, borderRadius: '8px', padding: '4px' }}>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={Grid3x3}
                  onClick={() => setViewMode('grid')}
                >
                  Griglia
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={List}
                  onClick={() => setViewMode('list')}
                >
                  Lista
                </Button>
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                icon={isDark ? Sun : Moon}
                onClick={toggleTheme}
              >
                {isDark ? 'Light' : 'Dark'}
              </Button>
              
              <Button
                variant="primary"
                size="sm"
                icon={Home}
                onClick={() => window.location.href = '/'}
              >
                Home
              </Button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && <LoadingBar />}

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {statsData.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} delay={index} />
          ))}
        </div>

        {/* Charts Grid */}
        <div style={gridStyle}>
          {/* Distribuzione Cittadinanza */}
          <Accordion
            title="Distribuzione Studenti"
            icon={Globe}
            expanded={expandedPanels.cittadinanza}
            onToggle={() => togglePanel('cittadinanza')}
            delay={0}
          >
            <div style={{ height: '300px' }}>
              {dati.cittadinanza ? (
                <Doughnut
                  data={{
                    labels: ['Italiani', 'Non Italiani'],
                    datasets: [{
                      data: [dati.cittadinanza.italiani, dati.cittadinanza.stranieri],
                      backgroundColor: [theme.info, theme.warning],
                      borderColor: [theme.infoHover, theme.warningHover],
                      borderWidth: 2,
                      hoverOffset: 4
                    }]
                  }}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        ...chartOptions.plugins.legend,
                        position: 'bottom'
                      }
                    }
                  }}
                />
              ) : (
                <Skeleton width="100%" height="100%" />
              )}
            </div>
          </Accordion>

          {/* Numero Voti per Materia */}
          <Accordion
            title="Numero Voti per Materia"
            icon={BarChart3}
            expanded={expandedPanels.numeroVotiMateria}
            onToggle={() => togglePanel('numeroVotiMateria')}
            delay={1}
          >
            <div style={{ height: '300px' }}>
              {dati.numeroVotiMateria ? (
                <Bar
                  data={{
                    labels: dati.numeroVotiMateria.map(item => item.materia),
                    datasets: [{
                      label: 'Numero voti',
                      data: dati.numeroVotiMateria.map(item => item.numero_voti),
                      backgroundColor: theme.success,
                      borderColor: theme.successHover,
                      borderWidth: 2,
                      borderRadius: 8
                    }]
                  }}
                  options={chartOptions}
                />
              ) : (
                <Skeleton width="100%" height="100%" />
              )}
            </div>
          </Accordion>

          {/* Media Voti per Materia */}
          <Accordion
            title="Media Voti per Materia"
            icon={TrendingUp}
            expanded={expandedPanels.mediaVotiMateria}
            onToggle={() => togglePanel('mediaVotiMateria')}
            delay={2}
          >
            <div style={{ height: '300px' }}>
              {dati.mediaVotiMateria ? (
                <Bar
                  data={{
                    labels: dati.mediaVotiMateria.map(item => item.materia),
                    datasets: [{
                      label: 'Media',
                      data: dati.mediaVotiMateria.map(item => parseFloat(item.media.toFixed(2))),
                      backgroundColor: theme.primary,
                      borderColor: theme.primaryHover,
                      borderWidth: 2,
                      borderRadius: 8
                    }]
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        beginAtZero: true,
                        max: 10
                      }
                    }
                  }}
                />
              ) : (
                <Skeleton width="100%" height="100%" />
              )}
            </div>
          </Accordion>

          {/* Classi per Anno */}
          <Accordion
            title="Classi per Anno di Corso"
            icon={School}
            expanded={expandedPanels.classiPerAnno}
            onToggle={() => togglePanel('classiPerAnno')}
            delay={3}
          >
            <div style={{ height: '300px' }}>
              {dati.classiPerAnno ? (
                <Line
                  data={{
                    labels: dati.classiPerAnno.map(item => `${item.annocorso}° Anno`),
                    datasets: [{
                      label: 'Numero classi',
                      data: dati.classiPerAnno.map(item => item.numero_classi),
                      borderColor: theme.secondary,
                      backgroundColor: `${theme.secondary}20`,
                      borderWidth: 3,
                      pointBackgroundColor: theme.secondary,
                      pointBorderColor: theme.cardBackground,
                      pointBorderWidth: 2,
                      pointRadius: 6,
                      pointHoverRadius: 8,
                      tension: 0.4,
                      fill: true
                    }]
                  }}
                  options={chartOptions}
                />
              ) : (
                <Skeleton width="100%" height="100%" />
              )}
            </div>
          </Accordion>

          {/* Studenti per Anno */}
          <Accordion
            title="Studenti per Anno di Corso"
            icon={Users}
            expanded={expandedPanels.studentiPerAnno}
            onToggle={() => togglePanel('studentiPerAnno')}
            delay={4}
          >
            <div style={{ height: '300px' }}>
              {dati.studentiPerAnno ? (
                <Bar
                  data={{
                    labels: dati.studentiPerAnno.map(item => `${item.annocorso}° Anno`),
                    datasets: [{
                      label: 'Numero studenti',
                      data: dati.studentiPerAnno.map(item => item.numero_studenti),
                      backgroundColor: theme.warning,
                      borderColor: theme.warningHover,
                      borderWidth: 2,
                      borderRadius: 8
                    }]
                  }}
                  options={chartOptions}
                />
              ) : (
                <Skeleton width="100%" height="100%" />
              )}
            </div>
          </Accordion>

          {/* Distribuzione Voti */}
          <Accordion
            title="Distribuzione dei Voti"
            icon={Award}
            expanded={expandedPanels.distribuzioneVoti}
            onToggle={() => togglePanel('distribuzioneVoti')}
            delay={5}
          >
            <div style={{ height: '300px' }}>
              {dati.distribuzioneVoti ? (
                <Bar
                  data={{
                    labels: dati.distribuzioneVoti.map(item => `Voto ${item.voto}`),
                    datasets: [{
                      label: 'Frequenza',
                      data: dati.distribuzioneVoti.map(item => item.count),
                      backgroundColor: dati.distribuzioneVoti.map(item => {
                        const voto = item.voto;
                        if (voto >= 8) return theme.success;
                        if (voto >= 6) return theme.info;
                        return theme.danger;
                      }),
                      borderColor: dati.distribuzioneVoti.map(item => {
                        const voto = item.voto;
                        if (voto >= 8) return theme.successHover;
                        if (voto >= 6) return theme.infoHover;
                        return theme.dangerHover;
                      }),
                      borderWidth: 2,
                      borderRadius: 8
                    }]
                  }}
                  options={chartOptions}
                />
              ) : (
                <Skeleton width="100%" height="100%" />
              )}
            </div>
          </Accordion>
        </div>

        {/* Advanced Analytics Section */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <PieChart size={28} style={{ color: theme.primary }} />
            Analisi Avanzate
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Performance Indicator */}
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Performance Generale</h3>
                <Activity size={24} style={{ color: theme.primary }} />
              </div>
              
              {dati.generali && (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: theme.textSecondary }}>Media Voti</span>
                      <span style={{ fontWeight: 'bold', color: getVotoColor(dati.generali.media_voti, theme) }}>
                        {dati.generali.media_voti}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: theme.backgroundTertiary,
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(dati.generali.media_voti / 10) * 100}%`,
                        height: '100%',
                        backgroundColor: getVotoColor(dati.generali.media_voti, theme),
                        transition: 'width 1s ease'
                      }} />
                    </div>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginTop: '20px'
                  }}>
                    <div style={{ 
                      padding: '12px',
                      backgroundColor: theme.backgroundTertiary,
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '4px' }}>
                        Rapporto Studenti/Docenti
                      </p>
                      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {(dati.generali.studenti / dati.generali.docenti).toFixed(1)}
                      </p>
                    </div>
                    <div style={{ 
                      padding: '12px',
                      backgroundColor: theme.backgroundTertiary,
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '4px' }}>
                        Media Studenti/Classe
                      </p>
                      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {(dati.generali.studenti / dati.generali.classi).toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Top Materie */}
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Top Materie per Media</h3>
                <TrendingUp size={24} style={{ color: theme.success }} />
              </div>
              
              {dati.mediaVotiMateria && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {dati.mediaVotiMateria
                    .sort((a, b) => b.media - a.media)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={item.materia} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px',
                        backgroundColor: theme.backgroundTertiary,
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: index === 0 ? theme.warning : theme.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: '500' }}>{item.materia}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 'bold', color: getVotoColor(item.media, theme) }}>
                            {item.media.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function
function getVotoColor(voto, theme) {
  if (voto >= 8) return theme.success;
  if (voto >= 6) return theme.info;
  return theme.danger;
}

// ==================== EXPORT ====================
export default function Statistiche() {
  return (
    <ThemeProvider>
      <StatisticheContent />
    </ThemeProvider>
  );
}