import { useApp } from '../../../context/AppContext';
import React, { useState } from 'react';


const Card = ({ children, className = "", style = {}, hoverable = false, onClick }) => {
  const { currentTheme } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    background: currentTheme.cardBackground,
    borderRadius: '16px',
    border: `1px solid ${currentTheme.border}`,
    padding: '24px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: hoverable ? 'pointer' : 'default',
    transform: hoverable && isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hoverable && isHovered ? currentTheme.shadowMd : currentTheme.shadow,
    ...style
  };

  return (
    <div
      style={cardStyle}
      className={`${className} animate-fade-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;