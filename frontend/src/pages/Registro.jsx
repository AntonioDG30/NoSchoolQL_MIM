import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registro() {
  const [userData, setUserData] = useState(null);
  const [errore, setErrore] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    if (!userId || !userType) {
      navigate('/login');
      return;
    }

    async function fetchData() {
      try {
        const endpoint = userType === 'docente'
          ? '/api/registro/docente/classi'
          : '/api/registro/studente/voti';

        const res = await fetch(`http://localhost:3000${endpoint}`, {
          headers: {
            Authorization: `${userType.toUpperCase()}:${userId}`
          }
        });

        if (!res.ok) throw new Error('Autenticazione fallita.');

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error('Errore nel caricamento:', err);
        setErrore('Errore nel caricamento dei dati.');
      }
    }

    fetchData();
  }, [userId, userType, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (errore) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-red-600 text-lg font-semibold">{errore}</p>
        <button onClick={logout} className="mt-4 px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">
          🔐 Torna al Login
        </button>
      </div>
    );
  }

  if (!userData) {
    return <p className="text-center mt-10">⏳ Caricamento...</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          🎓 Benvenuto, {userData.docente?.nome || userData.studente?.nome || ''}!
        </h1>
        <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          🚪 Logout
        </button>
      </div>

      {userType === 'studente' && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📚 I tuoi voti</h2>
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Materia</th>
                <th className="px-4 py-2 text-left">Voto</th>
              </tr>
            </thead>
            <tbody>
              {userData.voti.map((v, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{v.materia}</td>
                  <td className="px-4 py-2">{v.voto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {userType === 'docente' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">📘 Classi e studenti</h2>
          {userData.classi.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow border">
              <h3 className="text-lg font-bold mb-2">Classe: {item.classe}</h3>
              <div className="pl-4">
                <p className="font-semibold">👨‍🎓 Studente: {item.studente.nome} {item.studente.cognome}</p>
                <ul className="list-disc pl-6 text-sm text-gray-700 mt-1">
                  {item.voti.map((v, vi) => (
                    <li key={vi}>{v.materia}: {v.voto}</li>
                  ))}
                </ul>
                <div className="mt-2 space-x-2">
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">➕ Aggiungi voto</button>
                  <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">✏️ Modifica</button>
                  <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">🗑️ Elimina</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
