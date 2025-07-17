import { useTheme } from '../../../context/ThemeContext';
import React, { useState } from 'react';

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, style = {}, ...props }) => {
  const [theme] = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const baseStyle = {
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    outline: 'none'
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '10px 20px', fontSize: '16px' },
    lg: { padding: '12px 24px', fontSize: '18px' }
  };

  const variants = {
    primary: {
      backgroundColor: isHovered ? theme.primaryHover : theme.primary,
      color: '#ffffff',
      boxShadow: theme.shadow
    },
    secondary: {
      backgroundColor: isHovered ? theme.secondaryLight : 'transparent',
      color: theme.text,
      border: `1px solid ${theme.border}`
    },
    ghost: {
      backgroundColor: isHovered ? theme.backgroundTertiary : 'transparent',
      color: theme.text
    }
  };

  return (
    <button
      style={{
        ...baseStyle,
        ...sizes[size],
        ...variants[variant],
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;