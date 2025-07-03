import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Registro() {
  const [user, setUser] = useState(null);
  const [classiData, setClassiData] = useState([]);
  const [studenteSelezionato, setStudenteSelezionato] = useState(null);
  const [votiStudente, setVotiStudente] = useState([]);
  const [classiVisibili, setClassiVisibili] = useState({});
  const [mediaStudente, setMediaStudente] = useState(null);
  const [materiaClasse, setMateriaClasse] = useState('');
  const [votoClasse, setVotoClasse] = useState('');
  const [materieDocente, setMaterieDocente] = useState([]);
  const [materiaPerModifica, setMateriaPerModifica] = useState('');
  const [votoSelezionato, setVotoSelezionato] = useState(null);
  const [nuovoVoto, setNuovoVoto] = useState('');
  const [formAperto, setFormAperto] = useState({});
  const [votiPerClasse, setVotiPerClasse] = useState({});
  const [inserimentoVotoAperto, setInserimentoVotoAperto] = useState(false);
  const [nuovoVotoMateria, setNuovoVotoMateria] = useState('');
  const [nuovoVotoValore, setNuovoVotoValore] = useState('');
  const [nuovoVotoData, setNuovoVotoData] = useState('');
  const [mediaVisibile, setMediaVisibile] = useState(false);
  const [modificaVisibile, setModificaVisibile] = useState('');

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
          setClassiData(res.data.classi);
        })
        .catch(err => {
          console.error('❌ Errore nel caricamento classi docente:', err);
        });

        axios.get('http://localhost:3000/api/registro/docente/materie', {
          headers: { Authorization: `${tipo.toUpperCase()}:${id}` },
        })
        .then(res => setMaterieDocente(res.data.materie))
        .catch(err => console.error('Errore caricamento materie docente', err));
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

  const toggleForm = (classe) => {
    setFormAperto(prev => ({ ...prev, [classe]: !prev[classe] }));
    setMateriaClasse('');
    setVotiPerClasse(prev => ({ ...prev, [classe]: {} }));
  };

  const handleVotoChange = (classe, idStudente, voto) => {
    setVotiPerClasse(prev => ({
      ...prev,
      [classe]: {
        ...prev[classe],
        [idStudente]: voto
      }
    }));
  };

  const inviaVotiTuttaClasse = (classe) => {
    if (!materiaClasse) {
      alert('⚠️ Seleziona una materia prima di inviare i voti.');
      return;
    }

    const payload = Object.entries(votiPerClasse[classe] || {})
      .filter(([_, voto]) => voto !== '')
      .map(([id_studente, voto]) => ({
        id_studente,
        voto: Number(voto),
        materia: materiaClasse
      }));

    axios.post('http://localhost:3000/api/registro/docente/classe/voti', {
      id_classe: classe,
      materia: materiaClasse,
      voti: payload
    }, {
      headers: { Authorization: `${user.tipo.toUpperCase()}:${user.id}` },
    })
      .then(() => {
        alert('✅ Voti assegnati');
        setFormAperto(prev => ({ ...prev, [classe]: false }));
        setMateriaClasse('');
        setVotiPerClasse(prev => ({ ...prev, [classe]: {} }));
      })
      .catch(err => console.error('Errore invio voti tutta la classe', err));
  };

  const apriDettagliStudente = (studente, voti) => {
    setStudenteSelezionato(studente);
    setVotiStudente(voti);
    setMediaStudente(null);
    setInserimentoVotoAperto(false);
    setMateriaPerModifica('');
    setMediaVisibile(false);
    setModificaVisibile('');
  };

  const toggleMedia = () => {
    if (mediaVisibile) {
      setMediaVisibile(false);
      setMediaStudente(null);
    } else {
      axios.get(`http://localhost:3000/api/registro/docente/studente/${studenteSelezionato.id_studente}/media`, {
        headers: { Authorization: `${user.tipo.toUpperCase()}:${user.id}` },
      })
      .then(res => {
        setMediaStudente(res.data.media);
        setMediaVisibile(true);
      })
      .catch(err => console.error('Errore media studente', err));
    }
  };

  const inviaModificaVoto = () => {
    axios.put('http://localhost:3000/api/registro/docente/voto', {
      id_voto: votoSelezionato.id_voto,
      voto: Number(nuovoVoto)
    }, {
      headers: { Authorization: `${user.tipo.toUpperCase()}:${user.id}` },
    }).then(() => {
      alert('✅ Voto modificato con successo');
      setVotoSelezionato(null);
      setNuovoVoto('');
      setModificaVisibile('');
    }).catch(err => console.error('Errore modifica voto', err));
  };

  const inviaNuovoVotoSingolo = () => {
    if (!nuovoVotoMateria || !nuovoVotoValore || !nuovoVotoData) {
      alert('⚠️ Compila tutti i campi per inserire un nuovo voto.');
      return;
    }

    axios.post('http://localhost:3000/api/registro/docente/voto', {
      id_studente: studenteSelezionato.id_studente,
      materia: nuovoVotoMateria,
      voto: Number(nuovoVotoValore),
      data: nuovoVotoData
    }, {
      headers: { Authorization: `${user.tipo.toUpperCase()}:${user.id}` },
    }).then(() => {
      alert('✅ Voto inserito con successo');
      setNuovoVotoMateria('');
      setNuovoVotoValore('');
      setNuovoVotoData('');
      setInserimentoVotoAperto(false);
    }).catch(err => console.error('Errore inserimento voto singolo', err));
  };


  const votiPerMateria = votiStudente.reduce((acc, voto) => {
    acc[voto.materia] = acc[voto.materia] || [];
    acc[voto.materia].push(voto);
    return acc;
  }, {});

  const classiUniche = Array.from(new Set(classiData.map(item => item.nome_classe)));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Registro Elettronico</h1>
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {user?.tipo === 'docente' && (
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Classi assegnate</h2>
          <ul className="space-y-4">
            {classiUniche.map((classe, idx) => (
              <li key={idx} className="border p-3 rounded">
                <button
                  onClick={() => toggleClasse(classe)}
                  className="text-blue-600 font-medium text-lg flex items-center"
                >
                  {classiVisibili[classe] ? '▼' : '▶'}&nbsp;{classe}
                </button>

                {classiVisibili[classe] && (
                  <>
                    <button
                      onClick={() => toggleForm(classe)}
                      className="mt-3 bg-indigo-500 text-white px-3 py-1 rounded"
                    >
                      {formAperto[classe] ? 'Annulla inserimento voti' : 'Inserisci voto per tutta la classe'}
                    </button>

                    {formAperto[classe] && (
                      <div className="mt-3 border p-3 rounded bg-gray-50">
                        <select
                          value={materiaClasse}
                          onChange={e => setMateriaClasse(e.target.value)}
                          className="border px-2 py-1 mb-3"
                        >
                          <option value="">-- Seleziona materia --</option>
                          {materieDocente.map((mat, i) => (
                            <option key={i} value={mat}>{mat}</option>
                          ))}
                        </select>

                        <ul className="space-y-2">
                          {classiData.filter(c => c.nome_classe === classe).map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span>{item.studente.nome} {item.studente.cognome}: </span>
                              <input
                                type="number"
                                placeholder="Voto"
                                value={votiPerClasse[classe]?.[item.studente.id_studente] || ''}
                                onChange={e => handleVotoChange(classe, item.studente.id_studente, e.target.value)}
                                className="border px-2 py-1"
                              />
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => inviaVotiTuttaClasse(classe)}
                          className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Invia voti
                        </button>
                      </div>
                    )}

                    <ul className="ml-6 mt-4 space-y-1">
                      {classiData.filter(c => c.nome_classe === classe).map((item, i) => (
                        <li key={i}>
                          <button
                            className="text-green-700 underline"
                            onClick={() => apriDettagliStudente(item.studente, item.voti)}
                          >
                            {item.studente.nome} {item.studente.cognome}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>

          {studenteSelezionato && (
            <div className="mt-6 bg-gray-50 border p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Voti di {studenteSelezionato.nome} {studenteSelezionato.cognome}
              </h3>

              <ul className="list-disc ml-6 space-y-1">
                {Object.entries(votiPerMateria).map(([materia, voti], idx) => (
                  <li key={idx}>
                    <strong>{materia}</strong>
                    <ul className="ml-4">
                      {voti.map((v, i) => (
                        <li key={i}>{v.voto} ({new Date(v.data).toLocaleDateString()})</li>
                      ))}
                    </ul>

                    <button
                      className="text-indigo-600 text-sm mb-2 underline"
                      onClick={() => setInserimentoVotoAperto(prev => !prev)}
                    >
                      {inserimentoVotoAperto ? 'Annulla inserimento voto' : 'Inserisci nuovo voto'}
                    </button>

                    <button
                      className="text-blue-600 text-sm mt-1 underline"
                      onClick={() => setModificaVisibile(prev => prev === materia ? '' : materia)}
                    >
                      {modificaVisibile === materia ? 'Annulla modifica' : `Modifica un voto di ${materia}`}
                    </button>

                    <button
                      onClick={toggleMedia}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      {mediaVisibile ? 'Nascondi media' : 'Calcola media studente'}
                    </button>
                    {mediaVisibile && mediaStudente && <p className="mt-2">📊 Media: <strong>{mediaStudente}</strong></p>}

                    {inserimentoVotoAperto && (
                      <div className="mb-4">
                        <select
                          value={nuovoVotoMateria}
                          onChange={e => setNuovoVotoMateria(e.target.value)}
                          className="border px-2 py-1 mr-2"
                        >
                          <option value="">-- Materia --</option>
                          {materieDocente.map((mat, i) => (
                            <option key={i} value={mat}>{mat}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Voto"
                          value={nuovoVotoValore}
                          onChange={e => setNuovoVotoValore(e.target.value)}
                          className="border px-2 py-1 mr-2"
                        />
                        <input
                          type="date"
                          value={nuovoVotoData}
                          onChange={e => setNuovoVotoData(e.target.value)}
                          className="border px-2 py-1 mr-2"
                        />
                        <button
                          onClick={inviaNuovoVotoSingolo}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Inserisci
                        </button>
                      </div>
                    )}

                    {modificaVisibile === materia && (
                      <div className="mt-2">
                        <select
                          onChange={e => setVotoSelezionato(JSON.parse(e.target.value))}
                          className="border px-2 py-1 mr-2"
                        >
                          <option value="">-- Seleziona voto da modificare --</option>
                          {voti.map((v, i) => (
                            <option key={i} value={JSON.stringify(v)}>
                              {new Date(v.data).toLocaleDateString()} - {v.voto}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Nuovo voto"
                          value={nuovoVoto}
                          onChange={e => setNuovoVoto(e.target.value)}
                          className="border px-2 py-1 mr-2"
                        />
                        <button
                          onClick={inviaModificaVoto}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Salva
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
