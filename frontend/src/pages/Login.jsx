import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [id, setId] = useState('');
  const [errore, setErrore] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrore('');

    try {
      // Prova come studente
      const resStudente = await axios.get('http://localhost:3000/api/registro/studente/voti', {
        headers: { Authorization: `STUDENTE:${id}` }
      });

      if (resStudente.data?.studente) {
        localStorage.setItem('id', id);
        localStorage.setItem('tipo', 'studente');
        navigate('/registro');
        return;
      }
    } catch (err) {
      console.log('Non è uno studente:', err.response?.data?.message || err.message);
    }

    try {
      // Prova come docente
      const resDocente = await axios.get('http://localhost:3000/api/registro/docente/classi', {
        headers: { Authorization: `DOCENTE:${id}` }
      });

      if (resDocente.data?.docente) {
        localStorage.setItem('id', id);
        localStorage.setItem('tipo', 'docente');
        navigate('/registro');
        return;
      }
    } catch (err) {
      console.log('Non è un docente:', err.response?.data?.message || err.message);
    }

    setErrore('ID non valido. Riprova.');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>

        <label className="block mb-2 text-sm font-medium text-gray-700">Inserisci il tuo ID</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="es. STU0001 o DOC0001"
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Accedi
        </button>

        {errore && (
          <p className="mt-4 text-red-600 text-sm text-center">{errore}</p>
        )}
      </div>
    </div>
  );
}
