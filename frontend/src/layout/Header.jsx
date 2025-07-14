import { useApp } from '../context/AppContext';

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

export default Header;