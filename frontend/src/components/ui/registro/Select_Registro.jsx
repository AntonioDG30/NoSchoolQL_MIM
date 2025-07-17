import { useApp } from '../../../context/AppContext';
import React, { useState } from 'react';

const Select = ({ label, icon: Icon, children, ...props }) => {
  const { currentTheme } = useApp();
  const [isFocused, setIsFocused] = useState(false);
  
  const selectStyle = {
    width: '100%',
    padding: Icon ? '12px 16px 12px 44px' : '12px 16px',
    fontSize: '16px',
    background: currentTheme.background,
    border: `2px solid ${isFocused ? currentTheme.primary : currentTheme.border}`,
    borderRadius: '12px',
    color: currentTheme.text,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${currentTheme.textTertiary.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '20px',
    paddingRight: '40px',
    ...props.style
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: currentTheme.textSecondary
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={20} style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: currentTheme.textTertiary,
          pointerEvents: 'none'
        }} />}
        <select
          style={selectStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {children}
        </select>
      </div>
    </div>
  );
};

export default Select;