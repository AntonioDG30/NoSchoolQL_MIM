import { useApp } from '../../context/AppContext';

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

export default Badge;