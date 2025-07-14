import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

import { 
  BookOpen, 
  LogOut,
  Home,
  School
} from 'lucide-react';

const StudenteSidebar = ({ materie, materiaSelezionata, onSelectMateria }) => {
  const { currentTheme, user } = useApp();
  const [studente, setStudente] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    // Simulate fetching studente data
    setStudente({ nome: 'Anna', cognome: 'Bianchi', classe: '5A' });
  }, []);

  const sidebarItemStyle = (isActive) => ({
    padding: '12px 16px',
    margin: '4px 12px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    background: isActive ? currentTheme.primary : 'transparent',
    color: isActive ? 'white' : currentTheme.text
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };


  return (
    <>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            {studente?.nome} {studente?.cognome}
          </h3>
          <Badge variant="primary" size="sm" icon={School}>
            Classe {studente?.classe}
          </Badge>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          style={sidebarItemStyle(!materiaSelezionata)}
          onClick={() => onSelectMateria(null)}
        >
          <Home size={20} />
          <span style={{ fontWeight: '500' }}>Dashboard</span>
        </div>

        <p style={{ 
          padding: '12px 24px',
          fontSize: '12px',
          fontWeight: '600',
          color: currentTheme.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Materie
        </p>
        
        {materie.map((materia, idx) => (
          <div
            key={idx}
            style={sidebarItemStyle(materiaSelezionata === materia)}
            onClick={() => onSelectMateria(materia)}
            onMouseEnter={e => {
              if (materiaSelezionata !== materia) {
                e.currentTarget.style.background = currentTheme.backgroundSecondary;
              }
            }}
            onMouseLeave={e => {
              if (materiaSelezionata !== materia) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <BookOpen size={20} />
            <span style={{ fontWeight: '500' }}>{materia}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '24px', borderTop: `1px solid ${currentTheme.border}` }}>
        <Button
          variant="ghost"
          icon={LogOut}
          onClick={handleLogout}
          style={{ width: '100%', justifyContent: 'flex-start' }}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default StudenteSidebar; 