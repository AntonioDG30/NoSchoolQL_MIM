import { useApp } from '../../context/AppContext';

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const { currentTheme } = useApp();
  
  if (!isOpen) return null;

  const sizes = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  };

  const modalStyle = {
    background: currentTheme.cardBackground,
    borderRadius: '20px',
    width: '100%',
    maxWidth: sizes[size],
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: currentTheme.shadowXl
  };

  const headerStyle = {
    padding: '24px',
    borderBottom: `1px solid ${currentTheme.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const bodyStyle = {
    padding: '24px',
    overflowY: 'auto',
    flex: 1
  };

  return (
    <div style={overlayStyle} onClick={onClose} className="animate-fade-in">
      <div style={modalStyle} onClick={e => e.stopPropagation()} className="animate-slide-in">
        <div style={headerStyle}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: currentTheme.text }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: currentTheme.textSecondary,
              padding: '8px',
              borderRadius: '8px',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.target.style.background = currentTheme.backgroundSecondary}
            onMouseLeave={e => e.target.style.background = 'none'}
          >
            <X size={24} />
          </button>
        </div>
        <div style={bodyStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;