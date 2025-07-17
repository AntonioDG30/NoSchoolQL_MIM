import { useApp } from '../../../context/AppContext';
import { 
  CheckCircle,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react';

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

export default Alert;