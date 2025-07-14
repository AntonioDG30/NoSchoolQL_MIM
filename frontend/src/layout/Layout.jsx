import { useApp } from '../context/AppContext';

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

export default Layout;