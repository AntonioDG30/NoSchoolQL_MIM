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

// ==================== THEME SYSTEM ====================
const themes = {
  light: {
    // Base colors
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
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
    sidebarBackground: '#ffffff',
    headerBackground: '#ffffff',
    
    // Interactive colors
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: '#dbeafe',
    
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
    
    // Shadows
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
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
    sidebarBackground: '#1e293b',
    headerBackground: '#1e293b',
    
    // Interactive colors
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    primaryLight: '#1e3a8a',
    
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
    
    // Shadows
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
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

  /* Animations */
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes expandHeight {
    from {
      opacity: 0;
      max-height: 0;
      transform: scaleY(0);
    }
    to {
      opacity: 1;
      max-height: 1000px;
      transform: scaleY(1);
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

  /* Utility classes */
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }

  .animate-slide-in-right {
    animation: slideInFromRight 0.3s ease-out;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-expand {
    animation: expandHeight 0.3s ease-out;
    transform-origin: top;
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }

  /* Responsive utilities */
  @media (max-width: 1024px) {
    .hide-tablet {
      display: none !important;
    }
  }

  @media (max-width: 768px) {
    .hide-mobile {
      display: none !important;
    }
    
    .mobile-full-width {
      width: 100% !important;
    }
    
    .mobile-stack {
      flex-direction: column !important;
    }
  }

  /* Smooth transitions for theme changes */
  * {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }

  /* Glass effect */
  .glass {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
  }

  /* Custom focus styles */
  input:focus, select:focus, textarea:focus, button:focus {
    outline: none;
  }
`;

// Inject global styles
if (typeof document !== 'undefined' && !document.getElementById('registro-modern-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'registro-modern-styles';
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

// ==================== CONTEXT ====================
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const currentTheme = themes[theme];

  return (
    <AppContext.Provider value={{ 
      user, setUser, 
      loading, setLoading, 
      error, setError, 
      currentView, setCurrentView,
      theme, toggleTheme, currentTheme,
      sidebarOpen, setSidebarOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// ==================== API SERVICE ====================
class ApiService {
  static baseURL = 'http://localhost:3000/api/registro';

  static getHeaders(user) {
    return {
      Authorization: `${user.tipo.toUpperCase()}:${user.id}`
    };
  }

  static async fetchAPI(endpoint, options = {}) {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Studente APIs
  static async getVotiStudente(user) {
    return this.fetchAPI(`${this.baseURL}/studente/voti`, {
      headers: this.getHeaders(user)
    });
  }

  static async getMediaPerMateria(user) {
    return this.fetchAPI(`${this.baseURL}/studente/media-per-materia`, {
      headers: this.getHeaders(user)
    });
  }

  static async getDistribuzioneVoti(user) {
    return this.fetchAPI(`${this.baseURL}/studente/distribuzione-voti`, {
      headers: this.getHeaders(user)
    });
  }

  static async getMediaGenerale(user) {
    return this.fetchAPI(`${this.baseURL}/studente/media-generale`, {
      headers: this.getHeaders(user)
    });
  }

  static async getVotiFiltratiPerData(user, startDate, endDate) {
    return this.fetchAPI(`${this.baseURL}/studente/voti-filtrati?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.getHeaders(user)
    });
  }

  static async getVotiPerMateria(user, materia) {
    return this.fetchAPI(`${this.baseURL}/studente/voti-materia/${materia}`, {
      headers: this.getHeaders(user)
    });
  }

  // Docente APIs
  static async getClassiDocente(user) {
    return this.fetchAPI(`${this.baseURL}/docente/classi`, {
      headers: this.getHeaders(user)
    });
  }

  static async getMaterieDocente(user) {
    return this.fetchAPI(`${this.baseURL}/docente/materie`, {
      headers: this.getHeaders(user)
    });
  }

  static async getVotiStudenteDocente(user, idStudente) {
    return this.fetchAPI(`${this.baseURL}/docente/studente/${idStudente}/voti`, {
      headers: this.getHeaders(user)
    });
  }

  static async getMediaStudente(user, idStudente) {
    return this.fetchAPI(`${this.baseURL}/docente/studente/${idStudente}/media`, {
      headers: this.getHeaders(user)
    });
  }

  static async inserisciVoto(user, data) {
    return this.fetchAPI(`${this.baseURL}/docente/voto`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(user),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  static async modificaVoto(user, data) {
    return this.fetchAPI(`${this.baseURL}/docente/voto`, {
      method: 'PUT',
      headers: {
        ...this.getHeaders(user),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  static async eliminaVoto(user, idVoto) {
    return this.fetchAPI(`${this.baseURL}/docente/voto`, {
      method: 'DELETE',
      headers: {
        ...this.getHeaders(user),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_voto: idVoto })
    });
  }

  static async inserisciVotiClasse(user, data) {
    return this.fetchAPI(`${this.baseURL}/docente/classe/voti`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(user),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  static async getMediaClasse(user, idClasse, materia) {
    return this.fetchAPI(`${this.baseURL}/docente/classe/${idClasse}/materia/${materia}/media`, {
      headers: this.getHeaders(user)
    });
  }

  static async getVotiDocenteFiltrati(user, idStudente, startDate, endDate) {
    return this.fetchAPI(`${this.baseURL}/docente/studente/${idStudente}/voti-filtro?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.getHeaders(user)
    });
  }
}

// ==================== CUSTOM HOOKS ====================
const useApiCall = () => {
  const { setLoading, setError } = useApp();
  
  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return execute;
};

// ==================== MODERN UI COMPONENTS ====================
const Button = ({ children, variant = "primary", size = "md", icon: Icon, iconPosition = "left", onClick, style = {}, className = "", ...props }) => {
  const { currentTheme } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px', iconSize: 16 },
    md: { padding: '12px 24px', fontSize: '16px', iconSize: 20 },
    lg: { padding: '16px 32px', fontSize: '18px', iconSize: 24 }
  };

  const variants = {
    primary: {
      background: isPressed ? currentTheme.primaryHover : isHovered ? currentTheme.primaryHover : currentTheme.primary,
      color: '#ffffff',
      border: 'none'
    },
    secondary: {
      background: isPressed ? currentTheme.secondaryLight : isHovered ? currentTheme.secondaryLight : 'transparent',
      color: currentTheme.text,
      border: `1px solid ${currentTheme.border}`
    },
    danger: {
      background: isPressed ? currentTheme.dangerHover : isHovered ? currentTheme.dangerHover : currentTheme.danger,
      color: '#ffffff',
      border: 'none'
    },
    ghost: {
      background: isPressed ? currentTheme.backgroundTertiary : isHovered ? currentTheme.backgroundSecondary : 'transparent',
      color: currentTheme.text,
      border: 'none'
    }
  };

  const buttonStyle = {
    ...sizes[size],
    ...variants[variant],
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isPressed ? 'scale(0.98)' : 'scale(1)',
    boxShadow: variant === 'primary' && !isPressed ? currentTheme.shadow : 'none',
    ...style
  };

  return (
    <button
      style={buttonStyle}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={sizes[size].iconSize} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={sizes[size].iconSize} />}
    </button>
  );
};

const Card = ({ children, className = "", style = {}, hoverable = false, onClick }) => {
  const { currentTheme } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    background: currentTheme.cardBackground,
    borderRadius: '16px',
    border: `1px solid ${currentTheme.border}`,
    boxShadow: currentTheme.shadow,
    padding: '24px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: hoverable ? 'pointer' : 'default',
    transform: hoverable && isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hoverable && isHovered ? currentTheme.shadowMd : currentTheme.shadow,
    ...style
  };

  return (
    <div
      style={cardStyle}
      className={`${className} animate-fade-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Input = ({ label, icon: Icon, error, ...props }) => {
  const { currentTheme } = useApp();
  const [isFocused, setIsFocused] = useState(false);
  
  const containerStyle = {
    marginBottom: '16px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: currentTheme.textSecondary
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: Icon ? '12px 16px 12px 44px' : '12px 16px',
    fontSize: '16px',
    background: currentTheme.background,
    border: `2px solid ${isFocused ? currentTheme.primary : error ? currentTheme.danger : currentTheme.border}`,
    borderRadius: '12px',
    color: currentTheme.text,
    transition: 'all 0.2s ease',
    ...props.style
  };

  const iconStyle = {
    position: 'absolute',
    left: '16px',
    color: currentTheme.textTertiary,
    pointerEvents: 'none'
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        {Icon && <Icon size={20} style={iconStyle} />}
        <input
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <p style={{ color: currentTheme.danger, fontSize: '14px', marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  );
};

const Select = ({ label, icon: Icon, children, ...props }) => {
  const { currentTheme } = useApp();
  const [isFocused, setIsFocused] = useState(false);
  
  const selectStyle = {
    width: '100%',
    padding: Icon ? '12px 16px 12px 44px' : '12px 16px',
    fontSize: '16px',
    background: currentTheme.background,
    border: `2px solid ${isFocused ? currentTheme.primary : currentTheme.border}`,
    borderRadius: '12px',
    color: currentTheme.text,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${currentTheme.textTertiary.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '20px',
    paddingRight: '40px',
    ...props.style
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: currentTheme.textSecondary
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={20} style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: currentTheme.textTertiary,
          pointerEvents: 'none'
        }} />}
        <select
          style={selectStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {children}
        </select>
      </div>
    </div>
  );
};

const Badge = ({ children, variant = "primary", size = "md", icon: Icon }) => {
  const { currentTheme } = useApp();
  
  const variants = {
    primary: {
      background: currentTheme.primaryLight,
      color: currentTheme.primary
    },
    success: {
      background: currentTheme.successLight,
      color: currentTheme.success
    },
    danger: {
      background: currentTheme.dangerLight,
      color: currentTheme.danger
    },
    warning: {
      background: currentTheme.warningLight,
      color: currentTheme.warning
    }
  };

  const sizes = {
    sm: { padding: '4px 8px', fontSize: '12px' },
    md: { padding: '6px 12px', fontSize: '14px' },
    lg: { padding: '8px 16px', fontSize: '16px' }
  };

  const badgeStyle = {
    ...variants[variant],
    ...sizes[size],
    borderRadius: '999px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  };

  return (
    <span style={badgeStyle}>
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
};

const Alert = ({ children, type = "info", icon: CustomIcon, onClose }) => {
  const { currentTheme } = useApp();
  
  const types = {
    info: {
      background: currentTheme.primaryLight,
      color: currentTheme.primary,
      icon: AlertCircle
    },
    success: {
      background: currentTheme.successLight,
      color: currentTheme.success,
      icon: CheckCircle
    },
    error: {
      background: currentTheme.dangerLight,
      color: currentTheme.danger,
      icon: XCircle
    },
    warning: {
      background: currentTheme.warningLight,
      color: currentTheme.warning,
      icon: AlertCircle
    }
  };

  const config = types[type];
  const Icon = CustomIcon || config.icon;

  const alertStyle = {
    background: config.background,
    color: config.color,
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px',
    position: 'relative'
  };

  return (
    <div style={alertStyle} className="animate-slide-in">
      <Icon size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: config.color,
            padding: '4px'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

const LoadingSpinner = () => {
  const { currentTheme } = useApp();
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: `3px solid ${currentTheme.border}`,
        borderTopColor: currentTheme.primary,
        borderRadius: '50%'
      }} className="animate-spin" />
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const { currentTheme } = useApp();
  
  if (!isOpen) return null;

  const sizes = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  };

  const modalStyle = {
    background: currentTheme.cardBackground,
    borderRadius: '20px',
    width: '100%',
    maxWidth: sizes[size],
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: currentTheme.shadowXl
  };

  const headerStyle = {
    padding: '24px',
    borderBottom: `1px solid ${currentTheme.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const bodyStyle = {
    padding: '24px',
    overflowY: 'auto',
    flex: 1
  };

  return (
    <div style={overlayStyle} onClick={onClose} className="animate-fade-in">
      <div style={modalStyle} onClick={e => e.stopPropagation()} className="animate-slide-in">
        <div style={headerStyle}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: currentTheme.text }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: currentTheme.textSecondary,
              padding: '8px',
              borderRadius: '8px',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.target.style.background = currentTheme.backgroundSecondary}
            onMouseLeave={e => e.target.style.background = 'none'}
          >
            <X size={24} />
          </button>
        </div>
        <div style={bodyStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ==================== LAYOUT COMPONENTS ====================
const Layout = ({ children }) => {
  const { currentTheme, sidebarOpen } = useApp();
  
  const layoutStyle = {
    display: 'flex',
    height: '100vh',
    background: currentTheme.background,
    color: currentTheme.text,
    overflow: 'hidden'
  };

  return <div style={layoutStyle}>{children}</div>;
};

const Sidebar = ({ children, width = 280 }) => {
  const { currentTheme, sidebarOpen } = useApp();
  
  const sidebarStyle = {
    width: sidebarOpen ? `${width}px` : '0',
    height: '100vh',
    background: currentTheme.sidebarBackground,
    borderRight: `1px solid ${currentTheme.border}`,
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0
  };

  const contentStyle = {
    width: `${width}px`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <aside style={sidebarStyle}>
      <div style={contentStyle}>
        {children}
      </div>
    </aside>
  );
};

const Header = ({ children }) => {
  const { currentTheme } = useApp();
  
  const headerStyle = {
    height: '70px',
    background: currentTheme.headerBackground,
    borderBottom: `1px solid ${currentTheme.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    flexShrink: 0
  };

  return <header style={headerStyle}>{children}</header>;
};

const Main = ({ children }) => {
  const { currentTheme } = useApp();
  
  const mainStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: currentTheme.backgroundSecondary
  };

  return <main style={mainStyle}>{children}</main>;
};

const Content = ({ children }) => {
  const contentStyle = {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    overflowX: 'hidden'
  };

  return <div style={contentStyle}>{children}</div>;
};

// ==================== LOGIN VIEW ====================
const LoginView = () => {
  const { setUser, setCurrentView, currentTheme } = useApp();
  const [loginData, setLoginData] = useState({ tipo: 'studente', id: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginData.id) {
      alert('Inserisci un ID');
      return;
    }

    setIsLoading(true);
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('tipo', loginData.tipo);
    localStorage.setItem('id', loginData.id);
    
    setUser({ tipo: loginData.tipo, id: loginData.id });
    setCurrentView('dashboard');
    setIsLoading(false);
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.primaryHover} 100%)`,
    padding: '20px'
  };

  const formStyle = {
    width: '100%',
    maxWidth: '440px'
  };

  const logoStyle = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.8)'
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <div style={logoStyle} className="animate-fade-in">
          <GraduationCap size={64} color="white" style={{ marginBottom: '16px' }} />
          <h1 style={titleStyle}>Registro Elettronico</h1>
          <p style={subtitleStyle}>Accedi al tuo account</p>
        </div>

        <Card style={{ padding: '40px' }} className="animate-slide-in">
          <Select
            label="Tipo utente"
            icon={User}
            value={loginData.tipo}
            onChange={(e) => setLoginData({...loginData, tipo: e.target.value})}
          >
            <option value="studente">Studente</option>
            <option value="docente">Docente</option>
          </Select>

          <Input
            label="ID Utente"
            icon={School}
            type="text"
            placeholder="Inserisci il tuo ID"
            value={loginData.id}
            onChange={(e) => setLoginData({...loginData, id: e.target.value})}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            style={{ width: '100%', marginTop: '24px' }}
            size="lg"
          >
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </Button>
        </Card>
      </div>
    </div>
  );
};

// ==================== DOCENTE COMPONENTS ====================
const DocenteSidebar = ({ classi, classeSelezionata, onSelectClasse }) => {
  const { currentTheme, user } = useApp();
  const [docente, setDocente] = useState(null);
  
  useEffect(() => {
    // Simulate fetching docente data
    setDocente({ nome: 'Mario', cognome: 'Rossi' });
  }, []);

  const sidebarItemStyle = (isActive) => ({
    padding: '12px 16px',
    margin: '4px 12px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    background: isActive ? currentTheme.primary : 'transparent',
    color: isActive ? 'white' : currentTheme.text
  });

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            {docente?.nome} {docente?.cognome}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge variant="primary" size="sm" icon={BookOpen}>
              {classi.length} classi
            </Badge>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <p style={{ 
          padding: '0 24px 12px',
          fontSize: '12px',
          fontWeight: '600',
          color: currentTheme.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Le tue classi
        </p>
        
        {classi.map((classe, idx) => (
          <div
            key={idx}
            style={sidebarItemStyle(classeSelezionata === classe)}
            onClick={() => onSelectClasse(classe)}
            onMouseEnter={e => {
              if (classeSelezionata !== classe) {
                e.currentTarget.style.background = currentTheme.backgroundSecondary;
              }
            }}
            onMouseLeave={e => {
              if (classeSelezionata !== classe) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <Users size={20} />
            <span style={{ fontWeight: '500' }}>{classe}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '24px', borderTop: `1px solid ${currentTheme.border}` }}>
        <Button
          variant="ghost"
          icon={LogOut}
          onClick={handleLogout}
          style={{ width: '100%', justifyContent: 'flex-start' }}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

const DocenteDashboard = ({ classeSelezionata, studentiClasse, materie }) => {
  const { currentTheme, user } = useApp();
  const [materiaSelezionata, setMateriaSelezionata] = useState('');
  const [expandedStudents, setExpandedStudents] = useState([]);
  const [filtri, setFiltri] = useState({ periodo: '', tipo: '' });
  const execute = useApiCall();

  const toggleStudentExpansion = (studentId) => {
    setExpandedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  if (!classeSelezionata) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '24px'
      }}>
        <School size={80} color={currentTheme.textTertiary} />
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: currentTheme.textSecondary }}>
          Seleziona una classe per iniziare
        </h2>
        <p style={{ color: currentTheme.textTertiary, textAlign: 'center', maxWidth: '400px' }}>
          Scegli una delle tue classi dalla sidebar per visualizzare gli studenti e gestire i voti
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Dashboard Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Classe {classeSelezionata}
        </h1>
        <p style={{ color: currentTheme.textSecondary, fontSize: '18px' }}>
          {studentiClasse.length} studenti
        </p>
      </div>

      {/* Controls Section */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {materie.length > 1 && (
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Select
                label="Materia"
                icon={BookOpen}
                value={materiaSelezionata}
                onChange={(e) => setMateriaSelezionata(e.target.value)}
              >
                <option value="">Tutte le materie</option>
                {materie.map((mat, i) => (
                  <option key={i} value={mat}>{mat}</option>
                ))}
              </Select>
            </div>
          )}
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input
              label="Filtra per periodo"
              icon={Calendar}
              type="date"
              value={filtri.periodo}
              onChange={(e) => setFiltri({...filtri, periodo: e.target.value})}
            />
          </div>

          <Button icon={Filter} variant="secondary">
            Altri filtri
          </Button>
        </div>
      </Card>

      {/* Students List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {studentiClasse.map((item, idx) => (
          <StudentCard
            key={idx}
            studente={item.studente}
            isExpanded={expandedStudents.includes(item.studente.id_studente)}
            onToggle={() => toggleStudentExpansion(item.studente.id_studente)}
            materie={materie}
          />
        ))}
      </div>
    </div>
  );
};

const StudentCard = ({ studente, isExpanded, onToggle, materie }) => {
  const { currentTheme, user } = useApp();
  const [voti, setVoti] = useState([]);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVotoForm, setShowVotoForm] = useState(false);
  const execute = useApiCall();

  useEffect(() => {
    if (isExpanded && voti.length === 0) {
      loadVoti();
    }
  }, [isExpanded]);

  const loadVoti = async () => {
    setLoading(true);
    try {
      const data = await execute(() => 
        ApiService.getVotiStudenteDocente(user, studente.id_studente)
      );
      setVoti(data.voti);
    } catch (error) {
      console.error('Errore caricamento voti:', error);
    }
    setLoading(false);
  };

  const calcolaMedia = async () => {
    try {
      const data = await execute(() => 
        ApiService.getMediaStudente(user, studente.id_studente)
      );
      setMedia(data.media);
    } catch (error) {
      console.error('Errore calcolo media:', error);
    }
  };

  const handleAddVoto = async (votoData) => {
    try {
      await execute(() => 
        ApiService.inserisciVoto(user, {
          ...votoData,
          id_studente: studente.id_studente
        })
      );
      await loadVoti();
      setShowVotoForm(false);
    } catch (error) {
      console.error('Errore inserimento voto:', error);
    }
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    cursor: 'pointer',
    padding: '4px'
  };

  const studentInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1
  };

  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.primaryHover})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '18px'
  };

  const getInitials = (nome, cognome) => {
    return `${nome.charAt(0)}${cognome.charAt(0)}`.toUpperCase();
  };

  return (
    <Card style={{ padding: '20px' }}>
      <div style={headerStyle} onClick={onToggle}>
        <div style={studentInfoStyle}>
          <div style={avatarStyle}>
            {getInitials(studente.nome, studente.cognome)}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
              {studente.nome} {studente.cognome}
            </h3>
            <p style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
              ID: {studente.id_studente}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {media && (
            <Badge variant="success" size="lg">
              Media: {media}
            </Badge>
          )}
          <div style={{
            transition: 'transform 0.3s ease',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)'
          }}>
            <ChevronDown size={24} color={currentTheme.textSecondary} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '24px' }} className="animate-expand">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: `1px solid ${currentTheme.border}`
              }}>
                <Button 
                  icon={Plus} 
                  size="sm"
                  onClick={() => setShowVotoForm(true)}
                >
                  Inserisci voto
                </Button>
                <Button 
                  icon={Activity} 
                  variant="secondary" 
                  size="sm"
                  onClick={calcolaMedia}
                >
                  Calcola media
                </Button>
                <Button icon={FileText} variant="secondary" size="sm">
                  Report
                </Button>
              </div>

              {/* Add Voto Form */}
              {showVotoForm && (
                <VotoForm
                  materie={materie}
                  onSubmit={handleAddVoto}
                  onCancel={() => setShowVotoForm(false)}
                />
              )}

              {/* Voti List */}
              <VotiList
                voti={voti}
                onUpdate={loadVoti}
              />
            </>
          )}
        </div>
      )}
    </Card>
  );
};

const VotoForm = ({ materie, onSubmit, onCancel, votoEdit = null }) => {
  const { currentTheme } = useApp();
  const [formData, setFormData] = useState({
    materia: votoEdit?.materia || '',
    voto: votoEdit?.voto || '',
    data: votoEdit?.data ? new Date(votoEdit.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    tipo: votoEdit?.tipo || 'scritto'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.materia || !formData.voto || !formData.data) {
      alert('Compila tutti i campi');
      return;
    }
    onSubmit({
      ...formData,
      voto: Number(formData.voto)
    });
  };

  return (
    <Card style={{ 
      marginBottom: '24px',
      background: currentTheme.backgroundTertiary 
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Select
            label="Materia"
            value={formData.materia}
            onChange={(e) => setFormData({...formData, materia: e.target.value})}
            required
          >
            <option value="">Seleziona materia</option>
            {materie.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </Select>

          <Input
            label="Voto"
            type="number"
            min="1"
            max="10"
            step="0.5"
            value={formData.voto}
            onChange={(e) => setFormData({...formData, voto: e.target.value})}
            required
          />

          <Input
            label="Data"
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({...formData, data: e.target.value})}
            required
          />

          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({...formData, tipo: e.target.value})}
          >
            <option value="scritto">Scritto</option>
            <option value="orale">Orale</option>
            <option value="pratico">Pratico</option>
          </Select>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <Button type="submit" icon={Save} size="sm">
            {votoEdit ? 'Modifica' : 'Salva'}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Annulla
          </Button>
        </div>
      </form>
    </Card>
  );
};

const VotiList = ({ voti, onUpdate }) => {
  const { currentTheme, user } = useApp();
  const [editingVoto, setEditingVoto] = useState(null);
  const execute = useApiCall();

  const handleEdit = async (voto, nuovoValore) => {
    try {
      await execute(() => 
        ApiService.modificaVoto(user, {
          id_voto: voto.id_voto,
          voto: Number(nuovoValore)
        })
      );
      onUpdate();
      setEditingVoto(null);
    } catch (error) {
      console.error('Errore modifica voto:', error);
    }
  };

  const handleDelete = async (voto) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo voto?')) return;
    
    try {
      await execute(() => 
        ApiService.eliminaVoto(user, voto.id_voto)
      );
      onUpdate();
    } catch (error) {
      console.error('Errore eliminazione voto:', error);
    }
  };

  const getVotoColor = (voto) => {
    if (voto >= 8) return currentTheme.success;
    if (voto >= 6) return currentTheme.primary;
    return currentTheme.danger;
  };

  const votiPerMateria = voti.reduce((acc, voto) => {
    if (!acc[voto.materia]) acc[voto.materia] = [];
    acc[voto.materia].push(voto);
    return acc;
  }, {});

  if (voti.length === 0) {
    return (
      <Alert type="info">
        Nessun voto presente per questo studente
      </Alert>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {Object.entries(votiPerMateria).map(([materia, votiMateria]) => (
        <div key={materia}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: currentTheme.textSecondary 
          }}>
            {materia}
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
            {votiMateria.map((voto) => (
              <div
                key={voto.id_voto}
                style={{
                  background: currentTheme.background,
                  border: `2px solid ${currentTheme.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = currentTheme.shadowMd;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {editingVoto === voto.id_voto ? (
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    defaultValue={voto.voto}
                    onBlur={(e) => handleEdit(voto, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleEdit(voto, e.target.value);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '24px',
                      fontWeight: '700',
                      textAlign: 'center',
                      border: `2px solid ${currentTheme.primary}`,
                      borderRadius: '8px',
                      background: currentTheme.background
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: getVotoColor(voto.voto),
                      marginBottom: '8px'
                    }}>
                      {voto.voto}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: currentTheme.textTertiary
                    }}>
                      {new Date(voto.data).toLocaleDateString('it-IT')}
                    </div>
                  </>
                )}

                {/* Action buttons */}
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  display: 'flex',
                  gap: '4px',
                  opacity: 0,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <button
                    onClick={() => setEditingVoto(voto.id_voto)}
                    style={{
                      background: currentTheme.backgroundSecondary,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Edit2 size={14} color={currentTheme.textSecondary} />
                  </button>
                  <button
                    onClick={() => handleDelete(voto)}
                    style={{
                      background: currentTheme.dangerLight,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={14} color={currentTheme.danger} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ==================== STUDENTE COMPONENTS ====================
const StudenteSidebar = ({ materie, materiaSelezionata, onSelectMateria }) => {
  const { currentTheme, user } = useApp();
  const [studente, setStudente] = useState(null);
  
  useEffect(() => {
    // Simulate fetching studente data
    setStudente({ nome: 'Anna', cognome: 'Bianchi', classe: '5A' });
  }, []);

  const sidebarItemStyle = (isActive) => ({
    padding: '12px 16px',
    margin: '4px 12px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    background: isActive ? currentTheme.primary : 'transparent',
    color: isActive ? 'white' : currentTheme.text
  });

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            {studente?.nome} {studente?.cognome}
          </h3>
          <Badge variant="primary" size="sm" icon={School}>
            Classe {studente?.classe}
          </Badge>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          style={sidebarItemStyle(!materiaSelezionata)}
          onClick={() => onSelectMateria(null)}
        >
          <Home size={20} />
          <span style={{ fontWeight: '500' }}>Dashboard</span>
        </div>

        <p style={{ 
          padding: '12px 24px',
          fontSize: '12px',
          fontWeight: '600',
          color: currentTheme.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Materie
        </p>
        
        {materie.map((materia, idx) => (
          <div
            key={idx}
            style={sidebarItemStyle(materiaSelezionata === materia)}
            onClick={() => onSelectMateria(materia)}
            onMouseEnter={e => {
              if (materiaSelezionata !== materia) {
                e.currentTarget.style.background = currentTheme.backgroundSecondary;
              }
            }}
            onMouseLeave={e => {
              if (materiaSelezionata !== materia) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <BookOpen size={20} />
            <span style={{ fontWeight: '500' }}>{materia}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '24px', borderTop: `1px solid ${currentTheme.border}` }}>
        <Button
          variant="ghost"
          icon={LogOut}
          onClick={handleLogout}
          style={{ width: '100%', justifyContent: 'flex-start' }}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

const StudenteDashboard = ({ materiaSelezionata }) => {
  const { currentTheme, user } = useApp();
  const [votiGenerali, setVotiGenerali] = useState([]);
  const [votiMateria, setVotiMateria] = useState([]);
  const [mediePerMateria, setMediePerMateria] = useState([]);
  const [mediaGenerale, setMediaGenerale] = useState(null);
  const [distribuzioneVoti, setDistribuzioneVoti] = useState([]);
  const [loading, setLoading] = useState(true);
  const execute = useApiCall();

  useEffect(() => {
    if (materiaSelezionata) {
      loadVotiMateria();
    } else {
      loadDashboardGenerale();
    }
  }, [materiaSelezionata]);

  const loadDashboardGenerale = async () => {
    setLoading(true);
    try {
      const [votiData, medieData, distribuzioneData, mediaData] = await Promise.all([
        execute(() => ApiService.getVotiStudente(user)),
        execute(() => ApiService.getMediaPerMateria(user)),
        execute(() => ApiService.getDistribuzioneVoti(user)),
        execute(() => ApiService.getMediaGenerale(user))
      ]);

      setVotiGenerali(votiData.voti);
      setMediePerMateria(medieData.medie);
      setDistribuzioneVoti(distribuzioneData.distribuzione);
      setMediaGenerale(mediaData.media);
    } catch (error) {
      console.error('Errore caricamento dashboard:', error);
    }
    setLoading(false);
  };

  const loadVotiMateria = async () => {
    setLoading(true);
    try {
      const data = await execute(() => 
        ApiService.getVotiPerMateria(user, materiaSelezionata)
      );
      setVotiMateria(data.voti);
    } catch (error) {
      console.error('Errore caricamento voti materia:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (materiaSelezionata) {
    return <MateriaView materia={materiaSelezionata} voti={votiMateria} />;
  }

  return <DashboardGenerale 
    voti={votiGenerali}
    mediePerMateria={mediePerMateria}
    mediaGenerale={mediaGenerale}
    distribuzioneVoti={distribuzioneVoti}
  />;
};

const DashboardGenerale = ({ voti, mediePerMateria, mediaGenerale, distribuzioneVoti }) => {
  const { currentTheme } = useApp();

  // Stats cards data
  const stats = [
    {
      title: 'Media Generale',
      value: mediaGenerale || '0.00',
      icon: TrendingUp,
      color: currentTheme.primary,
      bgColor: currentTheme.primaryLight
    },
    {
      title: 'Voti Totali',
      value: voti.length,
      icon: Award,
      color: currentTheme.success,
      bgColor: currentTheme.successLight
    },
    {
      title: 'Miglior Media',
      value: mediePerMateria.length > 0 
        ? Math.max(...mediePerMateria.map(m => parseFloat(m.media))).toFixed(2)
        : '0.00',
      icon: Zap,
      color: currentTheme.warning,
      bgColor: currentTheme.warningLight
    },
    {
      title: 'Materie',
      value: mediePerMateria.length,
      icon: BookOpen,
      color: currentTheme.secondary,
      bgColor: currentTheme.secondaryLight
    }
  ];

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: currentTheme.cardBackground,
        titleColor: currentTheme.text,
        bodyColor: currentTheme.textSecondary,
        borderColor: currentTheme.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: currentTheme.border,
          drawBorder: false
        },
        ticks: {
          color: currentTheme.textSecondary
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: currentTheme.textSecondary
        }
      }
    }
  };

  const lineChartData = {
    labels: voti.slice(-10).map(v => new Date(v.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })),
    datasets: [{
      label: 'Andamento voti',
      data: voti.slice(-10).map(v => v.voto),
      borderColor: currentTheme.primary,
      backgroundColor: `${currentTheme.primary}20`,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: currentTheme.primary,
      pointBorderColor: currentTheme.cardBackground,
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const barChartData = {
    labels: distribuzioneVoti.map(d => `Voto ${d._id}`),
    datasets: [{
      label: 'Frequenza',
      data: distribuzioneVoti.map(d => d.count),
      backgroundColor: currentTheme.primary,
      borderRadius: 8
    }]
  };

  const doughnutData = {
    labels: mediePerMateria.map(m => m.materia),
    datasets: [{
      data: mediePerMateria.map(m => parseFloat(m.media)),
      backgroundColor: [
        currentTheme.primary,
        currentTheme.success,
        currentTheme.warning,
        currentTheme.danger,
        currentTheme.secondary
      ],
      borderWidth: 0,
      borderRadius: 4
    }]
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Section */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Dashboard Studente
        </h1>
        <p style={{ color: currentTheme.textSecondary, fontSize: '18px' }}>
          Panoramica del tuo andamento scolastico
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {stats.map((stat, idx) => (
          <Card key={idx} hoverable className="animate-slide-in-right" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: currentTheme.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
                  {stat.title}
                </p>
                <p style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={28} color={stat.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Andamento Voti */}
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Andamento Voti
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </Card>

        {/* Distribuzione Voti */}
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Distribuzione Voti
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Medie per Materia */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Medie per Materia
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={doughnutData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  position: 'right',
                  labels: {
                    color: currentTheme.text,
                    padding: 12,
                    font: {
                      size: 14
                    }
                  }
                }
              }
            }} />
          </div>
        </Card>

        {/* Recent Grades */}
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Ultimi Voti
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {voti.slice(-5).reverse().map((voto, idx) => (
              <StudentVotoCard key={idx} voto={voto} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const MateriaView = ({ materia, voti }) => {
  const { currentTheme } = useApp();
  const [viewMode, setViewMode] = useState('grid'); // grid or timeline

  const media = voti.length > 0 
    ? (voti.reduce((sum, v) => sum + v.voto, 0) / voti.length).toFixed(2)
    : '0.00';

  const trend = voti.length > 1 
    ? voti[voti.length - 1].voto > voti[voti.length - 2].voto 
    : null;

  const getVotoColor = (voto) => {
    if (voto >= 8) return currentTheme.success;
    if (voto >= 6) return currentTheme.primary;
    return currentTheme.danger;
  };

  // Prepare chart data
  const chartData = {
    labels: voti.map(v => new Date(v.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })),
    datasets: [{
      label: 'Voti',
      data: voti.map(v => v.voto),
      borderColor: currentTheme.primary,
      backgroundColor: `${currentTheme.primary}20`,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: voti.map(v => getVotoColor(v.voto)),
      pointBorderColor: currentTheme.cardBackground,
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: currentTheme.cardBackground,
        titleColor: currentTheme.text,
        bodyColor: currentTheme.textSecondary,
        borderColor: currentTheme.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
          color: currentTheme.textSecondary
        },
        grid: {
          color: currentTheme.border,
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: currentTheme.textSecondary
        }
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          {materia}
        </h1>
        <p style={{ color: currentTheme.textSecondary, fontSize: '18px' }}>
          {voti.length} voti registrati
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: currentTheme.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
                Media
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: getVotoColor(parseFloat(media)) }}>
                {media}
              </p>
            </div>
            <Target size={40} color={currentTheme.textTertiary} />
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: currentTheme.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
                Ultimo Voto
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: getVotoColor(voti[voti.length - 1]?.voto || 0) }}>
                {voti[voti.length - 1]?.voto || '-'}
              </p>
            </div>
            {trend !== null && (
              trend ? <TrendingUp size={40} color={currentTheme.success} /> : <TrendingDown size={40} color={currentTheme.danger} />
            )}
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: currentTheme.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
                Voto Migliore
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: currentTheme.success }}>
                {voti.length > 0 ? Math.max(...voti.map(v => v.voto)) : '-'}
              </p>
            </div>
            <Award size={40} color={currentTheme.success} />
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
          Andamento nel tempo
        </h3>
        <div style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </Card>

      {/* View Mode Toggle */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <Button
          variant={viewMode === 'grid' ? 'primary' : 'secondary'}
          size="sm"
          icon={BarChart3}
          onClick={() => setViewMode('grid')}
        >
          Griglia
        </Button>
        <Button
          variant={viewMode === 'timeline' ? 'primary' : 'secondary'}
          size="sm"
          icon={Clock}
          onClick={() => setViewMode('timeline')}
        >
          Timeline
        </Button>
      </div>

      {/* Voti Display */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          {voti.map((voto, idx) => (
            <Card key={idx} hoverable style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                color: getVotoColor(voto.voto),
                marginBottom: '12px'
              }}>
                {voto.voto}
              </div>
              <p style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                {new Date(voto.data).toLocaleDateString('it-IT')}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {voti.map((voto, idx) => (
            <StudentVotoCard key={idx} voto={voto} detailed />
          ))}
        </div>
      )}
    </div>
  );
};

const StudentVotoCard = ({ voto, detailed = false }) => {
  const { currentTheme } = useApp();
  
  const getVotoColor = (voto) => {
    if (voto >= 8) return currentTheme.success;
    if (voto >= 6) return currentTheme.primary;
    return currentTheme.danger;
  };

  const votoColor = getVotoColor(voto.voto);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      background: currentTheme.background,
      border: `1px solid ${currentTheme.border}`,
      borderRadius: '12px',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateX(4px)';
      e.currentTarget.style.boxShadow = currentTheme.shadowMd;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateX(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{
        width: detailed ? '60px' : '48px',
        height: detailed ? '60px' : '48px',
        borderRadius: '12px',
        background: `${votoColor}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <span style={{
          fontSize: detailed ? '24px' : '20px',
          fontWeight: '700',
          color: votoColor
        }}>
          {voto.voto}
        </span>
      </div>
      
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: '600', marginBottom: '4px' }}>
          {voto.materia}
        </p>
        <p style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
          {new Date(voto.data).toLocaleDateString('it-IT', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        {detailed && voto.tipo && (
          <Badge variant="secondary" size="sm" style={{ marginTop: '8px' }}>
            {voto.tipo}
          </Badge>
        )}
      </div>
    </div>
  );
};

// ==================== MAIN APP COMPONENT ====================
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

  if (currentView === 'login') {
    return <LoginView />;
  }

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