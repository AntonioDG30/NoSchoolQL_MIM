import { useApp } from '../../context/AppContext';

const StudentVotoCard = ({ voto, detailed = false }) => {
  const { currentTheme } = useApp();
  
  const getVotoColor = (voto) => {
    if (voto >= 8) return currentTheme.success;
    if (voto >= 6) return currentTheme.primary;
    return currentTheme.danger;
  };

  const votoColor = getVotoColor(voto.voto);

  return (
    <div style={{
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
    }}>
      <div style={{
        width: detailed ? '60px' : '48px',
        height: detailed ? '60px' : '48px',
        borderRadius: '12px',
        background: `${votoColor}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <span style={{
          fontSize: detailed ? '24px' : '20px',
          fontWeight: '700',
          color: votoColor
        }}>
          {voto.voto}
        </span>
      </div>
      
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: '600', marginBottom: '4px' }}>
          {voto.materia}
        </p>
        <p style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
          {new Date(voto.data).toLocaleDateString('it-IT', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        {detailed && voto.tipo && (
          <Badge variant="secondary" size="sm" style={{ marginTop: '8px' }}>
            {voto.tipo}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default StudentVotoCard; 