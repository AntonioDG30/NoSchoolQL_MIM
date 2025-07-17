import { useApp } from '../../../context/AppContext';
import React, { useState } from 'react';

const Button = ({ children, variant = "primary", size = "md", icon: Icon, iconPosition = "left", onClick, style = {}, className = "", ...props }) => {
  const { currentTheme } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px', iconSize: 16 },
    md: { padding: '12px 24px', fontSize: '16px', iconSize: 20 },
    lg: { padding: '16px 32px', fontSize: '18px', iconSize: 24 }
  };

  const variants = {
    primary: {
      background: isPressed ? currentTheme.primaryHover : isHovered ? currentTheme.primaryHover : currentTheme.primary,
      color: '#ffffff',
      border: 'none'
    },
    secondary: {
      background: isPressed ? currentTheme.secondaryLight : isHovered ? currentTheme.secondaryLight : 'transparent',
      color: currentTheme.text,
      border: `1px solid ${currentTheme.border}`
    },
    danger: {
      background: isPressed ? currentTheme.dangerHover : isHovered ? currentTheme.dangerHover : currentTheme.danger,
      color: '#ffffff',
      border: 'none'
    },
    ghost: {
      background: isPressed ? currentTheme.backgroundTertiary : isHovered ? currentTheme.backgroundSecondary : 'transparent',
      color: currentTheme.text,
      border: 'none'
    }
  };

  const buttonStyle = {
    ...sizes[size],
    ...variants[variant],
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isPressed ? 'scale(0.98)' : 'scale(1)',
    boxShadow: variant === 'primary' && !isPressed ? currentTheme.shadow : 'none',
    ...style
  };

  return (
    <button
      style={buttonStyle}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={sizes[size].iconSize} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={sizes[size].iconSize} />}
    </button>
  );
};

export default Button;