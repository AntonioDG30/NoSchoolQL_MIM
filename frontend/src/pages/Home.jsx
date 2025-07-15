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
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    gradientSecondary: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    gradientHero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    gradientSecondary: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    gradientHero: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)'
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
    overflow-x: hidden;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-20deg); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out;
  }

  .animate-slideIn {
    animation: slideIn 0.8s ease-out;
  }

  .animate-slideInLeft {
    animation: slideInLeft 0.8s ease-out;
  }

  .animate-slideInRight {
    animation: slideInRight 0.8s ease-out;
  }

  .animate-scaleIn {
    animation: scaleIn 0.6s ease-out;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-rotate {
    animation: rotate 20s linear infinite;
  }

  .animate-wave {
    animation: wave 2s ease-in-out infinite;
  }

  /* Hover effects */
  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-lift:hover {
    transform: translateY(-8px);
  }

  /* Glass effect */
  .glass {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  /* Gradient text */
  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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

  /* Custom scrollbar */
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
`;

// Inject global styles
if (typeof document !== 'undefined' && !document.getElementById('home-modern-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'home-modern-styles';
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

// ==================== COMPONENTS ====================
const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, style = {}, className = '', ...props }) => {
  const [theme] = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const baseStyle = {
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden'
  };

  const sizes = {
    sm: { padding: '10px 20px', fontSize: '14px' },
    md: { padding: '14px 28px', fontSize: '16px' },
    lg: { padding: '18px 36px', fontSize: '18px' }
  };

  const variants = {
    primary: {
      background: theme.gradientPrimary,
      color: '#ffffff',
      boxShadow: isHovered ? theme.shadowLg : theme.shadowMd,
      transform: isPressed ? 'scale(0.98)' : isHovered ? 'translateY(-2px)' : 'translateY(0)'
    },
    secondary: {
      backgroundColor: theme.backgroundTertiary,
      color: theme.text,
      border: `2px solid ${theme.border}`,
      transform: isPressed ? 'scale(0.98)' : 'scale(1)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.primary,
      transform: isPressed ? 'scale(0.98)' : 'scale(1)'
    }
  };

  return (
    <button
      className={className}
      style={{
        ...baseStyle,
        ...sizes[size],
        ...variants[variant],
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', style = {}, hoverable = false, gradient = false, onClick }) => {
  const [theme] = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    backgroundColor: gradient ? 'transparent' : theme.cardBackground,
    background: gradient ? theme.gradientPrimary : undefined,
    borderRadius: '20px',
    padding: '32px',
    boxShadow: hoverable && isHovered ? theme.shadowXl : theme.shadowMd,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: hoverable ? 'pointer' : 'default',
    transform: hoverable && isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
    border: `1px solid ${theme.border}`,
    position: 'relative',
    overflow: 'hidden',
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

const FeatureCard = ({ icon: Icon, title, description, link, linkText, color, delay = 0 }) => {
  const [theme] = useTheme();
  const [isHovered, setIsHovered] = useState(false);  
  return (
    <Card
      hoverable
      className="animate-scaleIn"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `${color}20`,
        filter: 'blur(40px)',
        transition: 'all 0.5s ease',
        transform: isHovered ? 'scale(1.5)' : 'scale(1)'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `${color}15`,
        filter: 'blur(30px)'
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: `0 8px 16px ${color}40`,
          transition: 'all 0.3s ease',
          transform: isHovered ? 'rotate(-5deg) scale(1.1)' : 'rotate(0) scale(1)'
        }}>
          <Icon size={32} color="white" />
        </div>

        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '12px',
          color: theme.text
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          marginBottom: '24px',
          flex: 1
        }}>
          {description}
        </p>

        <a 
          href={link}
          style={{ textDecoration: 'none' }}
        >
          <Button 
            variant="primary" 
            icon={ArrowRight}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              transform: isHovered ? 'translateX(0)' : 'translateX(0)'
            }}
          >
            {linkText}
            <div style={{
              position: 'absolute',
              right: '20px',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
            }}>
              →
            </div>
          </Button>
        </a>
      </div>
    </Card>
  );
};

const StatCard = ({ icon: Icon, value, label, color }) => {
  const [theme] = useTheme();
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '20px',
      borderRadius: '16px',
      backgroundColor: theme.backgroundTertiary,
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <p style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '4px'
        }}>
          {value}
        </p>
        <p style={{
          fontSize: '14px',
          color: theme.textSecondary
        }}>
          {label}
        </p>
      </div>
    </div>
  );
};

const ParticleBackground = () => {
  const [theme] = useTheme();
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    animationDuration: Math.random() * 20 + 10,
    animationDelay: Math.random() * 20
  }));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0
    }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            backgroundColor: theme.primary,
            opacity: 0.1,
            left: `${particle.left}%`,
            bottom: '-20px',
            animation: `float ${particle.animationDuration}s ease-in-out ${particle.animationDelay}s infinite`
          }}
        />
      ))}
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
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? themes.dark : themes.light;

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={[theme, toggleTheme, isDark]}>
      {children}
    </ThemeContext.Provider>
  );
};

// ==================== MAIN COMPONENT ====================
function HomeContent() {
  const [theme, toggleTheme, isDark] = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats] = useState({
    students: 1250,
    teachers: 85,
    classes: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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
      
      {/* Hero Section */}
      <div style={{
        background: theme.gradientHero,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background shapes */}
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

        {/* Header */}
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

        {/* Hero Content */}
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

          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            maxWidth: '800px',
            margin: '0 auto'
          , animationDelay: '0.4s' }} className="animate-slideIn">
            <StatCard icon={Users} value={stats.students} label="Studenti" color="white" />
            <StatCard icon={UserCheck} value={stats.teachers} label="Docenti" color="white" />
            <StatCard icon={School} value={stats.classes} label="Classi" color="white" />
          </div>
        </div>
      </div>

      {/* Features Section */}
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

      {/* Footer */}
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
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
