import { useApp } from '../context/AppContext';

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

export default Sidebar;