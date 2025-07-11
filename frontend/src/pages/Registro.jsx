import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);


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
  const [startDateDocente, setStartDateDocente] = useState('');
  const [endDateDocente, setEndDateDocente] = useState('');
  const [classePerMedia, setClassePerMedia] = useState('');
  const [materiaPerClasse, setMateriaPerClasse] = useState('');
  const [mediaClasse, setMediaClasse] = useState(null);
  const [mediePerMateria, setMediePerMateria] = useState([]);
  const [distribuzioneVoti, setDistribuzioneVoti] = useState([]);
  const [mediaGenerale, setMediaGenerale] = useState(null);
  const [filtroMateria, setFiltroMateria] = useState('');
  const [filtroDataInizio, setFiltroDataInizio] = useState('');
  const [filtroDataFine, setFiltroDataFine] = useState('');




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

        axios.get('http://localhost:3000/api/registro/studente/media-per-materia', {
          headers: { Authorization: `${tipo.toUpperCase()}:${id}` },
        }).then(res => setMediePerMateria(res.data.medie));

        axios.get('http://localhost:3000/api/registro/studente/distribuzione-voti', {
          headers: { Authorization: `${tipo.toUpperCase()}:${id}` },
        }).then(res => setDistribuzioneVoti(res.data.distribuzione));

        axios.get('http://localhost:3000/api/registro/studente/media-generale', {
          headers: { Authorization: `${tipo.toUpperCase()}:${id}` },
        }).then(res => setMediaGenerale(res.data.media));

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

  const apriDettagliStudente = (studente) => {
    setStudenteSelezionato(studente);
    setMediaStudente(null);
    setInserimentoVotoAperto(false);
    setMateriaPerModifica('');
    setMediaVisibile(false);
    setModificaVisibile('');
    setVotoSelezionato(null);

    axios.get(`http://localhost:3000/api/registro/docente/studente/${studente.id_studente}/voti`, {
      headers: { Authorization: `${user.tipo.toUpperCase()}:${user.id}` },
    })
    .then(res => setVotiStudente(res.data.voti))
    .catch(err => console.error('Errore nel caricamento voti aggiornati dello studente', err));
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
      setVotiStudente(prev =>
        prev.map(v =>
          v.id_voto === votoSelezionato.id_voto
            ? { ...v, voto: Number(nuovoVoto) }
            : v
        )
      );
      setVotoSelezionato(null);
      setNuovoVoto('');
      setModificaVisibile('');
    }).catch(err => console.error('Errore modifica voto', err));
  };

  const eliminaVoto = () => {
    if (!votoSelezionato) return alert('⚠️ Seleziona prima un voto da eliminare');

    if (!window.confirm('Sei sicuro di voler eliminare questo voto?')) return;

    axios.delete('http://localhost:3000/api/registro/docente/voto', {
      headers: { Authorization: `${user.tipo.toUpperCase()}:${user.id}` },
      data: { id_voto: votoSelezionato.id_voto }
    })
    .then(() => {
      alert('✅ Voto eliminato con successo');
      setVotiStudente(prev =>
        prev.filter(v => v.id_voto !== votoSelezionato.id_voto)
      );
      setVotoSelezionato(null);
      setNuovoVoto('');
      setModificaVisibile('');
    })
    .catch(err => {
      console.error('Errore eliminazione voto', err);
      alert('❌ Errore durante l\'eliminazione del voto');
    });
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
    }).then(res => {
      alert('✅ Voto inserito con successo');
      setVotiStudente(prev => [...prev, res.data.voto]);
      setNuovoVotoMateria('');
      setNuovoVotoValore('');
      setNuovoVotoData('');
      setInserimentoVotoAperto(false);
    }).catch(err => console.error('Errore inserimento voto singolo', err));
  };

  const calcolaMediaClasse = (id_classe, materia) => {
    if (!id_classe || !materia) {
      alert('⚠️ Specificare sia la classe che la materia.');
      return;
    }

    axios.get(`http://localhost:3000/api/registro/docente/classe/${id_classe}/materia/${materia}/media`, {
      headers: { Authorization: `${user.tipo.toUpperCase()}:${user.id}` }
    }).then(res => {
      setMediaClasse(res.data.media);
    }).catch(err => {
      console.error('Errore nel calcolo della media classe:', err);
      alert('❌ Errore nel calcolo della media della classe');
    });
  };



  const filtraVotiDocentePerData = () => {
    if (!startDateDocente || !endDateDocente || !studenteSelezionato) return alert('Compila tutte le informazioni');
    axios.get(`http://localhost:3000/api/registro/docente/studente/${studenteSelezionato.id_studente}/voti-filtro?startDate=${startDateDocente}&endDate=${endDateDocente}`, {
      headers: { Authorization: `${user.tipo.toUpperCase()}:${user.id}` }
    }).then(res => setVotiStudente(res.data.voti));
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
                            onClick={() => apriDettagliStudente(item.studente)}
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

          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Calcola media di una classe per materia</h3>

            <select
              className="border px-2 py-1 mr-2"
              value={classePerMedia}
              onChange={e => setClassePerMedia(e.target.value)}
            >
              <option value="">-- Seleziona classe --</option>
              {Array.from(new Set(classiData.map(c => c.id_classe))).map((id, i) => (
                <option key={i} value={id}>{id}</option>
              ))}
            </select>

            <select
              value={materiaClasse}
              onChange={e => setMateriaClasse(e.target.value)}
              className="border px-2 py-1 mr-2"
            >
              <option value="">-- Seleziona materia --</option>
              {materieDocente.map((mat, i) => (
                <option key={i} value={mat}>{mat}</option>
              ))}
            </select>

            <button
              onClick={() => {
                calcolaMediaClasse(classePerMedia, materiaClasse);
                setMateriaPerClasse(materiaClasse);
              }}
              className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
            >
              Calcola Media per {materiaClasse}
            </button>

            {mediaClasse && (
              <p className="mt-2 font-medium">
                📈 Media di {materiaPerClasse} in {classePerMedia}: <strong>{mediaClasse}</strong>
              </p>
            )}
          </div>



          {studenteSelezionato && (
            <div className="mt-6 bg-gray-50 border p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Voti di {studenteSelezionato.nome} {studenteSelezionato.cognome}
              </h3>

              <div className="mb-3">
                <input type="date" value={startDateDocente} onChange={e => setStartDateDocente(e.target.value)} className="mr-2 border" />
                <input type="date" value={endDateDocente} onChange={e => setEndDateDocente(e.target.value)} className="mr-2 border" />
                <button onClick={filtraVotiDocentePerData} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Filtra per data
                </button>
              </div>


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
                          className="bg-blue-600 text-white px-3 py-1 mr-2 rounded"
                        >
                          Salva
                        </button>

                        <button
                          onClick={eliminaVoto}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Elimina
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


      {user?.tipo === 'studente' && studenteSelezionato && (
        <div className="bg-white shadow p-4 rounded mt-4">
          <h2 className="text-xl font-semibold mb-2">
            Voti di {studenteSelezionato.nome} {studenteSelezionato.cognome}
          </h2>

          {votiStudente.length === 0 ? (
            <p>Nessun voto disponibile.</p>
          ) : (
            <ul className="list-disc ml-6">
              {votiStudente.map((v, i) => (
                <li key={i}>
                  {v.materia}: {v.voto} ({new Date(v.data).toLocaleDateString()})
                </li>
              ))}
              <div className="mt-6">
  <h3 className="text-lg font-semibold">📈 Media per materia</h3>
  <ul className="list-disc ml-6">
    {mediePerMateria.map((item, i) => (
      <li key={i}>{item.materia}: <strong>{item.media}</strong></li>
    ))}
  </ul>
</div>

<div className="mt-6">
  <h3 className="text-lg font-semibold">📊 Distribuzione voti</h3>
  <Bar
    data={{
      labels: distribuzioneVoti.map(d => d._id),
      datasets: [{
        label: 'Frequenza voti',
        data: distribuzioneVoti.map(d => d.count),
        backgroundColor: 'rgba(59,130,246,0.7)'
      }]
    }}
    options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
  />
</div>

<div className="mt-6">
  <h3 className="text-lg font-semibold">🗓️ Filtra voti per data</h3>
  <input
    type="date"
    value={filtroDataInizio}
    onChange={e => setFiltroDataInizio(e.target.value)}
    className="border px-2 py-1 mr-2"
  />
  <input
    type="date"
    value={filtroDataFine}
    onChange={e => setFiltroDataFine(e.target.value)}
    className="border px-2 py-1 mr-2"
  />
  <button
    onClick={() => {
      if (!filtroDataInizio || !filtroDataFine) return alert('Compila entrambe le date');
      axios.get(`http://localhost:3000/api/registro/studente/voti-filtrati?startDate=${filtroDataInizio}&endDate=${filtroDataFine}`, {
        headers: { Authorization: `${user.tipo.toUpperCase()}:${user.id}` }
      }).then(res => setVotiStudente(res.data.voti));
    }}
    className="bg-blue-500 text-white px-3 py-1 rounded"
  >
    Filtra
  </button>
</div>

<div className="mt-6">
  <h3 className="text-lg font-semibold">🗂️ Filtra per materia</h3>
  <input
    type="text"
    value={filtroMateria}
    onChange={e => setFiltroMateria(e.target.value)}
    placeholder="Nome materia"
    className="border px-2 py-1 mr-2"
  />
  <button
    onClick={() => {
      if (!filtroMateria) return alert('Inserisci il nome della materia');
      axios.get(`http://localhost:3000/api/registro/studente/voti-materia/${filtroMateria}`, {
        headers: { Authorization: `${user.tipo.toUpperCase()}:${user.id}` }
      }).then(res => setVotiStudente(res.data.voti));
    }}
    className="bg-purple-600 text-white px-3 py-1 rounded"
  >
    Filtra materia
  </button>
</div>

<div className="mt-6">
  <h3 className="text-lg font-semibold">🧾 Media generale</h3>
  <p>La tua media generale è: <strong>{mediaGenerale}</strong></p>
</div>

            </ul>
          )}
        </div>
      )}
    </div>
  );
}
