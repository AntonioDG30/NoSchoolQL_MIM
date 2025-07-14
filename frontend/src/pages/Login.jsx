import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, School, LogOut } from 'lucide-react';

import { AppProvider, useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function LoginContent() {
  const navigate = useNavigate();
  const { setUser, setCurrentView, currentTheme } = useApp();

  const [id, setId] = useState('');
  const [errore, setErrore] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setErrore('');
    if (!id) {
      setErrore('Inserisci un ID');
      return;
    }

    setIsLoading(true);

    try {
      const resStudente = await fetch('http://localhost:3000/api/registro/studente/voti', {
        headers: { Authorization: `STUDENTE:${id}` }
      });

      if (resStudente.ok) {
        localStorage.setItem('id', id);
        localStorage.setItem('tipo', 'studente');
        setUser({ id, tipo: 'studente' });
        setCurrentView('dashboard');
        navigate('/registro');
        return;
      }
    } catch (err) {
      console.log('Errore login studente:', err);
    }

    try {
      const resDocente = await fetch('http://localhost:3000/api/registro/docente/classi', {
        headers: { Authorization: `DOCENTE:${id}` }
      });

      if (resDocente.ok) {
        localStorage.setItem('id', id);
        localStorage.setItem('tipo', 'docente');
        setUser({ id, tipo: 'docente' });
        setCurrentView('dashboard');
        navigate('/registro');
        return;
      }
    } catch (err) {
      console.log('Errore login docente:', err);
    }

    setErrore('ID non valido. Riprova.');
    setIsLoading(false);
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.primaryHover} 100%)`,
    padding: '20px'
  };

  const formStyle = {
    width: '100%',
    maxWidth: '440px'
  };

  const logoStyle = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.8)'
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <div style={logoStyle} className="animate-fade-in">
          <GraduationCap size={64} color="white" style={{ marginBottom: '16px' }} />
          <h1 style={titleStyle}>Registro Elettronico</h1>
          <p style={subtitleStyle}>Accedi con il tuo ID</p>
        </div>

        <Card style={{ padding: '40px' }} className="animate-slide-in">
          <Input
            label="ID Utente"
            icon={School}
            type="text"
            placeholder="es. STU0001 o DOC0001"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            error={errore}
          />

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            style={{ width: '100%', marginTop: '16px' }}
            size="lg"
          >
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </Button>

          <Button
            onClick={handleBackHome}
            variant="danger"
            icon={LogOut}
            style={{ width: '100%', marginTop: '16px' }}
            size="lg"
          >
            Torna alla Home
          </Button>
        </Card>
      </div>
    </div>
  );
}

// 🔁 Questa è l'esportazione "definitiva"
export default function LoginView() {
  return (
    <AppProvider>
      <LoginContent />
    </AppProvider>
  );
}
