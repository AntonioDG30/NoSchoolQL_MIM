import { useApp } from '../context/AppContext';

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

export default Main;