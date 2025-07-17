import { useTheme } from '../../../context/ThemeContext';
import React, { useState, useEffect, useRef } from 'react';
import Card from './Card_Statistiche';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ title, icon: Icon, expanded, onToggle, children, delay = 0 }) => {
  const [theme] = useTheme();
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    cursor: 'pointer',
    userSelect: 'none',
    borderBottom: expanded ? `1px solid ${theme.border}` : 'none',
    transition: 'all 0.3s ease'
  };

  const contentStyle = {
    maxHeight: expanded ? `${contentHeight}px` : '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
    opacity: expanded ? 1 : 0
  };

  return (
    <Card
      className="animate-slideIn"
      style={{ 
        padding: 0, 
        overflow: 'hidden',
        animationDelay: `${delay * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <div style={headerStyle} onClick={onToggle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {Icon && <Icon size={24} style={{ color: theme.primary }} />}
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            {title}
          </h3>
        </div>
        <div style={{
          transition: 'transform 0.3s ease',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          color: theme.primary
        }}>
          <ChevronDown size={20} />
        </div>
      </div>
      <div style={contentStyle}>
        <div ref={contentRef} style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </Card>
  );
};

export default Accordion;