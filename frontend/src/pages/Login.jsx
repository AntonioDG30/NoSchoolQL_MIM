import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [errore, setErrore] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userId.trim()) {
      setErrore('Inserisci un ID utente.');
      return;
    }

    try {
      const headers = { Authorization: `STUDENTE:${userId}` };
      let response = await fetch('http://localhost:3000/api/registro/studente/voti', { headers });

      if (response.ok) {
        localStorage.setItem('userId', userId);
        localStorage.setItem('userType', 'studente');
        navigate('/registro');
        return;
      }

      // Prova come docente
      headers.Authorization = `DOCENTE:${userId}`;
      response = await fetch('http://localhost:3000/api/registro/docente/classi', { headers });

      if (response.ok) {
        localStorage.setItem('userId', userId);
        localStorage.setItem('userType', 'docente');
        navigate('/registro');
        return;
      }

      setErrore('Utente non trovato o ID non valido.');

    } catch (err) {
      console.error('Errore durante il login:', err);
      setErrore('Errore di connessione al server.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border shadow rounded text-center">
      <h2 className="text-2xl font-semibold mb-4">Accedi al Registro</h2>

      <input
        type="text"
        placeholder="Inserisci ID utente (es. STU0001)"
        className="border p-2 w-full rounded mb-4"
        value={userId}
        onChange={(e) => setUserId(e.target.value.toUpperCase())}
      />

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        onClick={handleLogin}
      >
        Accedi
      </button>

      {errore && <p className="text-red-600 mt-4">{errore}</p>}

      <p className="mt-6">
        <a href="/" className="text-sm text-blue-500 hover:underline">🔙 Torna alla Home</a>
      </p>
    </div>
  );
}
