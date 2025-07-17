
import { useTheme } from '../../../context/ThemeContext';

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

export default LoadingBar;