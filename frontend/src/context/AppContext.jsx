import React, { useState, useEffect, createContext, useContext } from 'react';
import themes from '../theme/themes';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  // Global app state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Theme state
  const [isDark, setIsDark] = useState(false);

  // Initialize from system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handleChange = e => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);

  const themeKey = isDark ? 'dark' : 'light';
  const currentTheme = themes[themeKey];

  return (
    <AppContext.Provider value={{
      // User/auth state
      user,
      setUser,
      loading,
      setLoading,
      error,
      setError,

      // Navigation/view
      currentView,
      setCurrentView,
      sidebarOpen,
      setSidebarOpen,

      // Theme
      isDark,
      themeKey,
      currentTheme,
      toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

/**
 * Hook per tema, compatibile con destrutturazione array:
 * const [theme, toggleTheme, isDark] = useTheme();
 * opzionalmente: const [theme, toggleTheme, isDark, themeKey] = useTheme();
 */
const useTheme = () => {
  const { currentTheme, isDark, toggleTheme, themeKey } = useApp();
  return [currentTheme, toggleTheme, isDark, themeKey];
};

export { AppProvider, useApp, useTheme };