import { useApp } from '../../context/AppContext';

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

export default LoadingSpinner;