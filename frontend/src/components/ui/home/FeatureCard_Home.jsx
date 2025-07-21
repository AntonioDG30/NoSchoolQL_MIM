import { useTheme } from '../../../context/AppContext';
import React, { useState } from 'react';
import Card from './Card_Home';
import Button from './Button_Home';
import { 
    ArrowRight 
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, link, linkText, color, delay = 0 }) => {
  const [theme] = useTheme();
  const [isHovered, setIsHovered] = useState(false);  
  return (
    <Card
      hoverable
      className="animate-scaleIn"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `${color}20`,
        filter: 'blur(40px)',
        transition: 'all 0.5s ease',
        transform: isHovered ? 'scale(1.5)' : 'scale(1)'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `${color}15`,
        filter: 'blur(30px)'
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 16px ${color}40`,
            transition: 'all 0.3s ease',
            transform: isHovered ? 'rotate(-5deg) scale(1.1)' : 'rotate(0) scale(1)'
          }}>
            <Icon size={32} color="white" />
          </div>

          <h2 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: theme.text,
            margin: 0,
            lineHeight: '1'
          }}>
            {title}
          </h2>
        </div>



        <p style={{
          fontSize: '16px',
          color: theme.textSecondary,
          lineHeight: '1.6',
          marginBottom: '24px',
          flex: 1
        }}>
          {description}
        </p>

        <a 
          href={link}
          style={{ textDecoration: 'none' }}
        >
          <Button 
            variant="primary" 
            icon={ArrowRight}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              transform: isHovered ? 'translateX(0)' : 'translateX(0)'
            }}
          >
            {linkText}
            <div style={{
              position: 'absolute',
              right: '20px',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
            }}>
              →
            </div>
          </Button>
        </a>
      </div>
    </Card>
  );
};

export default FeatureCard;