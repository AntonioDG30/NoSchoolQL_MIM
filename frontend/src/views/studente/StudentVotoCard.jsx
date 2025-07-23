import { useApp } from '../../context/AppContext';

const StudentVotoCard = ({ 
  voto, 
  detailed = false,
  renderTipologia 
}) => {
  const { currentTheme } = useApp();
  
  const getVotoColor = (val) => {
    if (val >= 8) return currentTheme.success;
    if (val >= 6) return currentTheme.primary;
    return currentTheme.danger;
  };

  const normalizeTipologia = (t) => (t || '').toUpperCase();
  const tipologia = normalizeTipologia(voto.tipologia || voto.tipo); 

  const getTipologiaBadgeStyle = (t) => {
    const base = {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '999px',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase'
    };
    switch (t) {
      case 'SCRITTO':
        return { ...base, background: currentTheme.primaryLight, color: currentTheme.primary };
      case 'ORALE':
        return { ...base, background: currentTheme.infoLight || '#e0f2ff', color: currentTheme.info || '#0b6ea8' };
      case 'PRATICO':
        return { ...base, background: currentTheme.warningLight, color: currentTheme.warning };
      default:
        return { ...base, background: currentTheme.border, color: currentTheme.textSecondary };
    }
  };

  const votoColor = getVotoColor(voto.voto);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        background: currentTheme.background,
        border: `1px solid ${currentTheme.border}`,
        borderRadius: '12px',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.boxShadow = currentTheme.shadowMd;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          width: detailed ? '60px' : '48px',
            height: detailed ? '60px' : '48px',
          borderRadius: '12px',
          background: `${votoColor}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <span
          style={{
            fontSize: detailed ? '24px' : '20px',
            fontWeight: '700',
            color: votoColor
          }}
        >
          {voto.voto}
        </span>
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: '600', marginBottom: '4px' }}>
          {voto.materia}
        </p>
        <p
          style={{
            color: currentTheme.textSecondary,
            fontSize: '14px',
            margin: 0
          }}
        >
          {new Date(voto.data).toLocaleDateString('it-IT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        {detailed && (tipologia || renderTipologia) && (
          <div style={{ marginTop: '8px' }}>
            {renderTipologia
              ? renderTipologia()
              : <span style={getTipologiaBadgeStyle(tipologia)}>{tipologia}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentVotoCard;
