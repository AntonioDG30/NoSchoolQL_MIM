import { useTheme } from '../../../context/AppContext';
import React, { useState } from 'react';

const Card = ({ children, className = '', style = {}, hoverable = false, gradient = false, onClick }) => {
  const [theme] = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    backgroundColor: gradient ? 'transparent' : theme.cardBackground,
    background: gradient ? theme.gradientPrimary : undefined,
    borderRadius: '20px',
    padding: '32px',
    boxShadow: hoverable && isHovered ? theme.shadowXl : theme.shadowMd,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: hoverable ? 'pointer' : 'default',
    transform: hoverable && isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
    border: `1px solid ${theme.border}`,
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  return (
    <div
      className={`${className} ${hoverable ? 'hover-lift' : ''}`}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default Card;