import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Registro() {
  const [user, setUser] = useState(null);
  const [classiData, setClassiData] = useState({});
  const [classiVisibili, setClassiVisibili] = useState({});
  const [studentiVisibili, setStudentiVisibili] = useState({});
  const [studenteSelezionato, setStudenteSelezionato] = useState(null);
  const [votiStudente, setVotiStudente] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const tipo = localStorage.getItem('tipo');
    const id = localStorage.getItem('id');

    if (!tipo || !id) {
      navigate('/login');
    } else {
      setUser({ tipo, id });

      if (tipo === 'studente') {
        axios.get('http://localhost:3000/api/registro/studente/voti', {
          headers: { Authorization: `${tipo.toUpperCase()}:${id}` },
        })
          .then(res => {
            setStudenteSelezionato(res.data.studente);
            setVotiStudente(res.data.voti);
          })
          .catch(err => {
            console.error('❌ Errore nel caricamento voti studente:', err);
          });
      }

      if (tipo === 'docente') {
        axios.get('http://localhost:3000/api/registro/docente/classi', {
          headers: { Authorization: `${tipo.toUpperCase()}:${id}` },
        })
          .then(res => {
            const mappa = {};
            res.data.classi.forEach(entry => {
              if (!mappa[entry.classe]) mappa[entry.classe] = [];
              mappa[entry.classe].push({
                studente: entry.studente,
                voti: entry.voti
              });
            });
            setClassiData(mappa);
          })
          .catch(err => {
            console.error('❌ Errore nel caricamento classi docente:', err);
          });
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('tipo');
    localStorage.removeItem('id');
    navigate('/');
  };

  const toggleClasse = (classe) => {
    setClassiVisibili(prev => ({ ...prev, [classe]: !prev[classe] }));
  };

  const toggleStudente = (idStudente) => {
    setStudentiVisibili(prev => ({ ...prev, [idStudente]: !prev[idStudente] }));
  };

  // Funzione di raggruppamento voti per materia
  const raggruppaVotiPerMateria = (voti) => {
    const mappa = {};
    voti.forEach(v => {
      if (!mappa[v.materia]) mappa[v.materia] = [];
      mappa[v.materia].push(v.voto);
    });
    return mappa;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Registro Elettronico</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {user?.tipo === 'studente' && studenteSelezionato && (
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-2">
            Benvenuto, {studenteSelezionato.nome} {studenteSelezionato.cognome}
          </h2>
          <h3 className="text-lg mb-2">I tuoi voti:</h3>
          <ul className="list-disc ml-6">
            {votiStudente.map((voto, idx) => (
              <li key={idx}>
                {voto.materia}: <strong>{voto.voto}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {user?.tipo === 'docente' && (
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Classi assegnate</h2>
          <ul className="space-y-4">
            {Object.entries(classiData).map(([classe, studenti], idx) => (
              <li key={idx} className="border p-4 rounded">
                <button
                  onClick={() => toggleClasse(classe)}
                  className="text-blue-700 font-medium text-lg flex items-center"
                >
                  {classiVisibili[classe] ? '▼' : '▶'}&nbsp;{classe}
                </button>

                {classiVisibili[classe] && (
                  <ul className="ml-6 mt-2 space-y-2">
                    {studenti.map((entry, i) => (
                      <li key={i}>
                        <button
                          onClick={() => toggleStudente(entry.studente.id_studente)}
                          className="text-green-700 underline"
                        >
                          {entry.studente.nome} {entry.studente.cognome}
                        </button>

                        {studentiVisibili[entry.studente.id_studente] && (
                          <ul className="ml-6 mt-1 text-sm">
                            {Object.entries(raggruppaVotiPerMateria(entry.voti)).map(([materia, votiMateria], j) => (
                              <li key={j} className="mb-1">
                                <span className="font-medium text-gray-800">{materia}:</span>{' '}
                                <span className="text-blue-800">{votiMateria.join(', ')}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
