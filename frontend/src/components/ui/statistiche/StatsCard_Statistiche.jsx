import { useTheme } from '../../../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import Card from './Card_Statistiche';
import Skeleton from './Skeleton_Statistiche';

const StatsCard = ({ icon: Icon, title, value, color, delay = 0 }) => {
  const [theme] = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  const cardStyle = {
    height: '100%',
    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'scale(1)' : 'scale(0.9)',
    transition: 'all 0.4s ease'
  };

  return (
    <Card style={cardStyle} hoverable>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            {title}
          </p>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
            {value || <Skeleton />}
          </h2>
        </div>
        <Icon size={48} style={{ opacity: 0.3 }} />
      </div>
      <div style={{
        position: 'absolute',
        bottom: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }} />
    </Card>
  );
};

export default StatsCard;