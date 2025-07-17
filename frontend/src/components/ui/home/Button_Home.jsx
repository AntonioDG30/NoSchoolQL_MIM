import { useTheme } from '../../../context/ThemeContext';
import React, { useState } from 'react';

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, style = {}, className = '', ...props }) => {
  const [theme] = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const baseStyle = {
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden'
  };

  const sizes = {
    sm: { padding: '10px 20px', fontSize: '14px' },
    md: { padding: '14px 28px', fontSize: '16px' },
    lg: { padding: '18px 36px', fontSize: '18px' }
  };

  const variants = {
    primary: {
      background: theme.gradientPrimary,
      color: '#ffffff',
      boxShadow: isHovered ? theme.shadowLg : theme.shadowMd,
      transform: isPressed ? 'scale(0.98)' : isHovered ? 'translateY(-2px)' : 'translateY(0)'
    },
    secondary: {
      backgroundColor: theme.backgroundTertiary,
      color: theme.text,
      border: `2px solid ${theme.border}`,
      transform: isPressed ? 'scale(0.98)' : 'scale(1)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.primary,
      transform: isPressed ? 'scale(0.98)' : 'scale(1)'
    }
  };

  return (
    <button
      className={className}
      style={{
        ...baseStyle,
        ...sizes[size],
        ...variants[variant],
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

export default Button;