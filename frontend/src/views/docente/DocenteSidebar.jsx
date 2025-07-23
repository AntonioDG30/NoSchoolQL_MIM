import { useApp } from '../../context/AppContext';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Badge from '../../components/ui/registro/Badge_Registro';
import Button from '../../components/ui/registro/Button_Registro';

import { 
  BookOpen, 
  Users, 
  LogOut
} from 'lucide-react';

const DocenteSidebar = ({ classi, classeSelezionata, onSelectClasse }) => {
  const { currentTheme, user, setLoading, setError } = useApp();
  const [docente, setDocente] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocente = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/registro/docente/info', {
          headers: {
            Authorization: `${user.tipo.toUpperCase()}:${user.id}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setDocente(data);
      } catch (err) {
        console.error('Errore nel recupero del docente:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocente();
  }, [user, setLoading, setError]);

  const classiOrdinate = useMemo(() => {
    if (!Array.isArray(classi)) return [];

    const parseClasse = (c) => {
      if (typeof c !== 'string') return { anno: Number.MAX_SAFE_INTEGER, lettera: 'Z', raw: c };
      const match = c.match(/^(\d+)\s*([A-Za-z])/); 
      if (!match) {
        return { anno: Number.MAX_SAFE_INTEGER, lettera: 'Z', raw: c }; 
      }
      return {
        anno: parseInt(match[1], 10),
        lettera: match[2].toUpperCase(),
        raw: c
      };
    };

    return [...classi].sort((a, b) => {
      const ca = parseClasse(a);
      const cb = parseClasse(b);

      if (ca.anno !== cb.anno) return ca.anno - cb.anno;
      if (ca.lettera < cb.lettera) return -1;
      if (ca.lettera > cb.lettera) return 1;
      return 0;
    });
  }, [classi]);

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
              {classiOrdinate.length} classi
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
        
        {classiOrdinate.map((classe, idx) => (
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