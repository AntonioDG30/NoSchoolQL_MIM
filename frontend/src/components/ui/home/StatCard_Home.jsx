import { useTheme } from '../../../context/ThemeContext';

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

export default StatCard;