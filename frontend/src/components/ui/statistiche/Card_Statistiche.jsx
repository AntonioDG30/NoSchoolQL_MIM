import { useTheme } from '../../../context/AppContext';
import React, { useState } from 'react';

const Card = ({ children, className = '', style = {}, hoverable = false, onClick }) => {
  const [theme] = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    backgroundColor: theme.cardBackground,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: hoverable && isHovered ? theme.shadowLg : theme.shadow,
    transition: 'all 0.3s ease',
    cursor: hoverable ? 'pointer' : 'default',
    transform: hoverable && isHovered ? 'translateY(-4px)' : 'translateY(0)',
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