import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Badge from '../../components/ui/registro/Badge_Registro';
import Button from '../../components/ui/registro/Button_Registro';

import { 
  BookOpen, 
  Users, 
  LogOut
} from 'lucide-react';

import ApiService from '../../services/ApiService';
import useApiCall from '../../hooks/useApiCall';


const DocenteSidebar = ({ classi, classeSelezionata, onSelectClasse }) => {
  const { currentTheme, user } = useApp();
  const [docente, setDocente] = useState(null);
  const navigate = useNavigate();

  
  const execute = useApiCall();

  useEffect(() => {
    const fetchDocente = async () => {
      try {
        const data = await execute(() => ApiService.getInfoDocente(user));
        setDocente(data);
      } catch (err) {
        console.error('Errore nel recupero del docente:', err);
      }
    };

    fetchDocente();
  }, [user]);


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
            {docente?.nome} {docente?.cognome}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge variant="primary" size="sm" icon={BookOpen}>
              {classi.length} classi
            </Badge>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <p style={{ 
          padding: '0 24px 12px',
          fontSize: '12px',
          fontWeight: '600',
          color: currentTheme.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Le tue classi
        </p>
        
        {classi.map((classe, idx) => (
          <div
            key={idx}
            style={sidebarItemStyle(classeSelezionata === classe)}
            onClick={() => onSelectClasse(classe)}
            onMouseEnter={e => {
              if (classeSelezionata !== classe) {
                e.currentTarget.style.background = currentTheme.backgroundSecondary;
              }
            }}
            onMouseLeave={e => {
              if (classeSelezionata !== classe) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <Users size={20} />
            <span style={{ fontWeight: '500' }}>{classe}</span>
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

export default DocenteSidebar;