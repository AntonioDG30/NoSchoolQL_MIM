import { useApp } from '../../context/AppContext';
import { useState } from 'react';

const Input = ({ label, icon: Icon, error, ...props }) => {
  const { currentTheme } = useApp();
  const [isFocused, setIsFocused] = useState(false);
  
  const containerStyle = {
    marginBottom: '16px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: currentTheme.textSecondary
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: Icon ? '12px 16px 12px 44px' : '12px 16px',
    fontSize: '16px',
    background: currentTheme.background,
    border: `2px solid ${isFocused ? currentTheme.primary : error ? currentTheme.danger : currentTheme.border}`,
    borderRadius: '12px',
    color: currentTheme.text,
    transition: 'all 0.2s ease',
    ...props.style
  };

  const iconStyle = {
    position: 'absolute',
    left: '16px',
    color: currentTheme.textTertiary,
    pointerEvents: 'none'
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        {Icon && <Icon size={20} style={iconStyle} />}
        <input
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <p style={{ color: currentTheme.danger, fontSize: '14px', marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;