/**
 * CONTROLLER REGISTRO ELETTRONICO
 * 
 * Gestisco tutte le operazioni del registro elettronico per studenti e docenti.
 * Questo controller gestisce la visualizzazione e modifica dei voti, il calcolo delle medie,
 * e tutte le operazioni CRUD relative al registro.
 * 
 * Il controller è diviso in sezioni logiche:
 * - Operazioni comuni
 * - Operazioni per studenti
 * - Operazioni per docenti
 * 
 * @author Antonio Di Giorgio
 */

const { ottieniCollezioni } = require('../db/connection');

// ===========================
// SEZIONE STUDENTI
// ===========================

/**
 * OPERAZIONI DISPONIBILI PER GLI STUDENTI
 * Gli studenti possono solo visualizzare i propri dati,
 * non possono modificare o inserire voti.
 */

/**
 * Recupero tutti i voti dello studente autenticato.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniVotiStudente(req, res) {
  // Recupero i dati dell'utente dal middleware di autenticazione
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;

  // ===========================
  // VERIFICA AUTORIZZAZIONE
  // ===========================
  
  // Verifico che l'utente sia uno studente
  if (tipoUtente !== 'studente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  try {
    // Ottengo le collezioni necessarie
    const { collezioneStudenti, collezioneVoti } = ottieniCollezioni();

    // ===========================
    // RECUPERO DATI STUDENTE
    // ===========================
    
    // Verifico che lo studente esista nel database
    const studente = await collezioneStudenti.findOne({ 
      id_studente: idUtente 
    });
    
    if (!studente) {
      return res.status(404).json({ 
        messaggio: 'Studente non trovato' 
      });
    }

    // ===========================
    // RECUPERO VOTI
    // ===========================
    
    // Recupero tutti i voti dello studente
    const voti = await collezioneVoti.find({ 
      id_studente: idUtente 
    }).toArray();
    
    // Restituisco i dati dello studente e i suoi voti
    return res.json({ 
      studente, 
      voti 
    });
    
  } catch (errore) {
    console.error('Errore recupero voti studente:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Calcolo la media generale dello studente su tutti i voti.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function calcolaMediaGeneraleStudente(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;

  // Verifico che l'utente sia uno studente
  if (tipoUtente !== 'studente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  try {
    const { collezioneVoti } = ottieniCollezioni();

    // ===========================
    // CALCOLO MEDIA
    // ===========================
    
    /**
     * Utilizzo l'aggregazione MongoDB per calcolare
     * la media in modo efficiente lato database
     */
    const aggregazioneMedia = await collezioneVoti.aggregate([
      { $match: { id_studente: idUtente } },
      { $group: { _id: null, media: { $avg: "$voto" } } }
    ]).toArray();

    const media = aggregazioneMedia[0]?.media?.toFixed(2) || "0.00";

    return res.json({ media });
    
  } catch (errore) {
    console.error('Errore calcolo media generale:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Calcolo la media dei voti per ogni materia dello studente.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function calcolaMediaPerMateriaStudente(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;

  if (tipoUtente !== 'studente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  try {
    const { collezioneVoti } = ottieniCollezioni();

    // ===========================
    // AGGREGAZIONE PER MATERIA
    // ===========================
    
    /**
     * Raggruppo i voti per materia e calcolo la media
     * per ognuna di esse
     */
    const medie = await collezioneVoti.aggregate([
      { $match: { id_studente: idUtente } },
      { $group: { _id: "$materia", media: { $avg: "$voto" } } }
    ]).toArray();

    // Formatto il risultato in modo leggibile
    const risultato = medie.map(m => ({
      materia: m._id,
      media: m.media.toFixed(2)
    }));

    return res.json({ medie: risultato });
    
  } catch (errore) {
    console.error('Errore calcolo media per materia:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Ottengo la distribuzione dei voti dello studente (quanti voti per ogni valutazione).
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniDistribuzioneVotiStudente(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;

  if (tipoUtente !== 'studente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  try {
    const { collezioneVoti } = ottieniCollezioni();

    // ===========================
    // CALCOLO DISTRIBUZIONE
    // ===========================
    
    /**
     * Raggruppo i voti per valore e conto le occorrenze
     * Ordino per voto crescente per una visualizzazione logica
     */
    const distribuzione = await collezioneVoti.aggregate([
      { $match: { id_studente: idUtente } },
      { $group: { _id: "$voto", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();

    return res.json({ distribuzione });
    
  } catch (errore) {
    console.error('Errore calcolo distribuzione voti:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Recupero i voti dello studente filtrati per intervallo di date.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniVotiStudenteFiltriPerData(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;
  const { dataInizio, dataFine } = req.query;

  if (tipoUtente !== 'studente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  // ===========================
  // VALIDAZIONE DATE
  // ===========================
  
  if (!dataInizio || !dataFine) {
    return res.status(400).json({ 
      messaggio: 'Intervallo di date non valido' 
    });
  }

  // Converto le stringhe in oggetti Date
  const dataInizioObj = new Date(dataInizio);
  const dataFineObj = new Date(dataFine);
  
  // Imposto la data di fine alle 23:59:59 per includere tutto il giorno
  dataFineObj.setHours(23, 59, 59, 999);

  try {
    const { collezioneVoti } = ottieniCollezioni();

    // ===========================
    // QUERY CON FILTRO DATE
    // ===========================
    
    const voti = await collezioneVoti.find({
      id_studente: idUtente,
      data: {
        $gte: dataInizioObj,
        $lte: dataFineObj
      }
    }).toArray();

    return res.json({ voti });
    
  } catch (errore) {
    console.error('Errore recupero voti con filtro data:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Recupero i voti dello studente per una specifica materia.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniVotiStudentePerMateria(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;
  const { materia } = req.params;

  if (tipoUtente !== 'studente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  // Verifico che la materia sia specificata
  if (!materia) {
    return res.status(400).json({ 
      messaggio: 'Materia non specificata' 
    });
  }

  try {
    const { collezioneVoti } = ottieniCollezioni();

    // Recupero i voti filtrati per materia
    const voti = await collezioneVoti.find({
      id_studente: idUtente,
      materia
    }).toArray();

    return res.json({ voti });
    
  } catch (errore) {
    console.error('Errore recupero voti per materia:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Recupero le informazioni personali dello studente autenticato.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniInfoStudente(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;

  if (tipoUtente !== 'studente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  try {
    const { collezioneStudenti, collezioneClassi } = ottieniCollezioni();
    
    // ===========================
    // RECUPERO DATI STUDENTE
    // ===========================
    
    const studente = await collezioneStudenti.findOne({ 
      id_studente: idUtente 
    });

    if (!studente) {
      return res.status(404).json({ 
        messaggio: 'Studente non trovato' 
      });
    }

    // ===========================
    // RECUPERO CLASSE
    // ===========================
    
    // Recupero anche le informazioni sulla classe dello studente
    const classe = await collezioneClassi.findOne({ 
      id_classe: studente.id_classe 
    });

    res.json({
      nome: studente.nome,
      cognome: studente.cognome,
      classe: classe?.nome_classe || 'N/D'
    });
    
  } catch (errore) {
    console.error('Errore recupero info studente:', errore);
    res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

// ===========================
// SEZIONE DOCENTI
// ===========================

/**
 * OPERAZIONI DISPONIBILI PER I DOCENTI
 * I docenti possono visualizzare, inserire, modificare ed eliminare voti
 * per gli studenti delle loro classi.
 */

/**
 * Recupero tutte le classi assegnate al docente con i relativi studenti e voti.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniClassiDocente(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;

  // Verifico che l'utente sia un docente
  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  try {
    const {
      collezioneDocenti,
      collezioneAssegnazioni,
      collezioneClassi,
      collezioneStudenti,
      collezioneVoti
    } = ottieniCollezioni();

    // ===========================
    // VERIFICA DOCENTE
    // ===========================
    
    const docente = await collezioneDocenti.findOne({ 
      id_docente: idUtente 
    });
    
    if (!docente) {
      return res.status(404).json({ 
        messaggio: 'Docente non trovato' 
      });
    }

    // ===========================
    // RECUPERO ASSEGNAZIONI
    // ===========================
    
    // Recupero tutte le assegnazioni del docente
    const assegnazioni = await collezioneAssegnazioni.find({ 
      id_docente: idUtente 
    }).toArray();
    
    // Estraggo gli ID delle classi assegnate
    const idClassi = assegnazioni.map(a => a.id_classe);

    // ===========================
    // RECUPERO CLASSI
    // ===========================
    
    // Recupero i dettagli delle classi
    const classi = await collezioneClassi.find({ 
      id_classe: { $in: idClassi } 
    }).toArray();

    // ===========================
    // COSTRUZIONE RISULTATO
    // ===========================
    
    /**
     * Per ogni classe, recupero gli studenti e i voti
     * inseriti da questo docente
     */
    const risultato = [];

    for (const classe of classi) {
      // Recupero gli studenti della classe
      const studenti = await collezioneStudenti.find({ 
        id_classe: classe.id_classe 
      }).toArray();
      
      // Per ogni studente recupero i voti
      for (const studente of studenti) {
        const voti = await collezioneVoti.find({
          id_studente: studente.id_studente,
          id_docente: idUtente
        }).toArray();

        risultato.push({
          id_classe: classe.id_classe,
          nome_classe: classe.nome_classe,
          studente,
          voti
        });
      }
    }

    return res.json({ 
      docente, 
      classi: risultato 
    });
    
  } catch (errore) {
    console.error('Errore recupero classi docente:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Inserisco un nuovo voto per uno studente.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function inserisciVoto(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;
  const { id_studente, materia, voto, tipo, data } = req.body;

  // Verifico che l'utente sia un docente
  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  // ===========================
  // VALIDAZIONE DATI
  // ===========================
  
  // Verifico che tutti i campi obbligatori siano presenti
  if (!id_studente || !materia || typeof voto !== 'number' || !tipo || !data) {
    console.error('Dati mancanti:', { id_studente, materia, voto, tipo, data });
    return res.status(400).json({ 
      messaggio: 'Dati incompleti o errati' 
    });
  }

  try {
    const { collezioneVoti } = ottieniCollezioni();

    // ===========================
    // CREAZIONE VOTO
    // ===========================
    
    // Genero un ID univoco per il voto
    const idVoto = `VOT${Date.now()}`;
    
    // Creo l'oggetto voto
    const nuovoVoto = {
      id_voto: idVoto,
      id_studente,
      id_docente: idUtente,
      materia,
      voto: Number(voto),
      tipologia: tipo,
      data: new Date(data)
    };

    // Inserisco il voto nel database
    await collezioneVoti.insertOne(nuovoVoto);
    
    return res.status(201).json({ 
      messaggio: 'Voto inserito', 
      voto: nuovoVoto 
    });
    
  } catch (errore) {
    console.error('Errore inserimento voto:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Modifico un voto esistente.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function modificaVoto(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;
  const { id_voto, tipologia, voto } = req.body;

  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  // ===========================
  // VALIDAZIONE DATI
  // ===========================
  
  if (!id_voto || typeof voto !== 'number' || Number.isNaN(voto)) {
    return res.status(400).json({ 
      messaggio: 'Dati mancanti o invalidi' 
    });
  }

  try {
    const { collezioneVoti } = ottieniCollezioni();

    // ===========================
    // PREPARAZIONE UPDATE
    // ===========================
    
    // Preparo l'oggetto con i campi da aggiornare
    const campiDaAggiornare = { voto };
    
    // Aggiungo la tipologia solo se fornita
    if (tipologia !== undefined) {
      campiDaAggiornare.tipologia = tipologia;
    }

    // ===========================
    // ESECUZIONE UPDATE
    // ===========================
    
    /**
     * Aggiorno il voto solo se appartiene al docente corrente
     * Questo garantisce che un docente possa modificare solo i propri voti
     */
    const risultato = await collezioneVoti.updateOne(
      { id_voto, id_docente: idUtente },
      { $set: campiDaAggiornare }
    );

    // Verifico se il voto è stato trovato e modificato
    if (risultato.matchedCount === 0) {
      return res.status(404).json({ 
        messaggio: 'Voto non trovato o non autorizzato' 
      });
    }

    return res.json({ 
      messaggio: 'Voto modificato' 
    });
    
  } catch (errore) {
    console.error('Errore modifica voto:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Elimino un voto esistente.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function eliminaVoto(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;
  const { id_voto } = req.body;

  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  // Verifico che l'ID del voto sia fornito
  if (!id_voto) {
    return res.status(400).json({ 
      messaggio: 'ID voto mancante' 
    });
  }

  try {
    const { collezioneVoti } = ottieniCollezioni();

    // ===========================
    // ELIMINAZIONE VOTO
    // ===========================
    
    /**
     * Elimino il voto solo se appartiene al docente corrente
     * Questo garantisce che un docente possa eliminare solo i propri voti
     */
    const risultato = await collezioneVoti.deleteOne({ 
      id_voto, 
      id_docente: idUtente 
    });

    // Verifico se il voto è stato trovato ed eliminato
    if (risultato.deletedCount === 0) {
      return res.status(404).json({ 
        messaggio: 'Voto non trovato o non autorizzato' 
      });
    }

    return res.json({ 
      messaggio: 'Voto eliminato' 
    });
    
  } catch (errore) {
    console.error('Errore eliminazione voto:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Recupero le classi del docente con gli studenti associati.
 * Versione ottimizzata per il caricamento iniziale.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniClassiConStudenti(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;

  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  try {
    const {
      collezioneDocenti,
      collezioneAssegnazioni,
      collezioneClassi,
      collezioneStudenti,
      collezioneVoti
    } = ottieniCollezioni();

    // ===========================
    // RECUPERO ASSEGNAZIONI
    // ===========================
    
    const assegnazioni = await collezioneAssegnazioni.find({ 
      id_docente: idUtente 
    }).toArray();
    
    const idClassi = assegnazioni.map(a => a.id_classe);
    
    // Recupero le classi
    const classi = await collezioneClassi.find({ 
      id_classe: { $in: idClassi } 
    }).toArray();

    // ===========================
    // COSTRUZIONE RISULTATO
    // ===========================
    
    const risultatoClassi = [];

    for (const classe of classi) {
      // Recupero gli studenti della classe
      const studenti = await collezioneStudenti.find({ 
        id_classe: classe.id_classe 
      }).toArray();
      
      const studentiConVoti = [];

      // Per ogni studente recupero i voti
      for (const studente of studenti) {
        const voti = await collezioneVoti.find({
          id_studente: studente.id_studente,
          id_docente: idUtente
        }).toArray();

        studentiConVoti.push({
          studente,
          voti
        });
      }

      risultatoClassi.push({
        id_classe: classe.id_classe,
        studenti: studentiConVoti
      });
    }

    return res.json({ 
      classi: risultatoClassi 
    });
    
  } catch (errore) {
    console.error('Errore recupero classi con studenti:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Calcolo la media dei voti di uno studente per il docente corrente.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function calcolaMediaStudente(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;
  const { id_studente } = req.params;

  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  try {
    const { collezioneVoti } = ottieniCollezioni();

    // ===========================
    // CALCOLO MEDIA
    // ===========================
    
    /**
     * Calcolo la media solo dei voti inseriti dal docente corrente
     * per lo studente specificato
     */
    const aggregazioneMedia = await collezioneVoti.aggregate([
      {
        $match: {
          id_studente,
          id_docente: idUtente
        }
      },
      {
        $group: {
          _id: null,
          media: { $avg: "$voto" }
        }
      }
    ]).toArray();

    const media = aggregazioneMedia[0]?.media?.toFixed(2) || "0.00";

    res.json({ 
      id_studente, 
      media 
    });
    
  } catch (errore) {
    console.error('Errore calcolo media studente:', errore);
    res.status(500).json({ 
      messaggio: 'Errore nel calcolo della media', 
      errore: errore.message 
    });
  }
}

/**
 * Recupero le materie insegnate dal docente.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniMaterieDocente(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;

  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  try {
    const { collezioneAssegnazioni } = ottieniCollezioni();
    
    // ===========================
    // RECUPERO MATERIE
    // ===========================
    
    // Recupero tutte le assegnazioni del docente
    const assegnazioni = await collezioneAssegnazioni.find({ 
      id_docente: idUtente 
    }).toArray();
    
    // Estraggo le materie uniche usando un Set
    const materie = [...new Set(assegnazioni.map(a => a.materia))];

    return res.json({ materie });
    
  } catch (errore) {
    console.error('Errore recupero materie docente:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Inserisco voti per tutti gli studenti di una classe in una singola operazione.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function inserisciVotiInserisciVotiClasse(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;
  const { id_classe, materia, tipo, voti } = req.body;

  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  // ===========================
  // VALIDAZIONE DATI
  // ===========================
  
  if (!id_classe || !materia || !tipo || !Array.isArray(voti)) {
    return res.status(400).json({ 
      messaggio: 'Dati incompleti o errati' 
    });
  }

  try {
    const { collezioneVoti } = ottieniCollezioni();
    
    // ===========================
    // PREPARAZIONE VOTI
    // ===========================
    
    /**
     * Preparo l'array di voti da inserire in blocco
     * Genero un ID univoco per ogni voto
     */
    const votiDaInserire = voti.map(v => ({
      id_voto: `VOT${Date.now()}${Math.floor(Math.random() * 1000)}`,
      id_docente: idUtente,
      id_studente: v.id_studente,
      materia: v.materia || materia,
      tipologia: v.tipo || tipo,
      voto: Number(v.voto),
      data: new Date()
    }));

    // Verifico che ci siano voti validi da inserire
    if (votiDaInserire.length === 0) {
      return res.status(400).json({ 
        messaggio: 'Nessun voto valido da inserire' 
      });
    }

    // ===========================
    // INSERIMENTO IN BLOCCO
    // ===========================
    
    // Utilizzo insertMany per ottimizzare l'operazione
    await collezioneVoti.insertMany(votiDaInserire);
    
    return res.status(201).json({ 
      messaggio: 'Voti inseriti correttamente' 
    });
    
  } catch (errore) {
    console.error('Errore inserimento voti classe:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Recupero i voti di uno studente inseriti dal docente corrente.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniVotiStudentePerDocente(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;
  const { id_studente } = req.params;

  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  try {
    const { collezioneStudenti, collezioneVoti } = ottieniCollezioni();

    // ===========================
    // VERIFICA STUDENTE
    // ===========================
    
    const studente = await collezioneStudenti.findOne({ 
      id_studente 
    });
    
    if (!studente) {
      return res.status(404).json({ 
        messaggio: 'Studente non trovato' 
      });
    }

    // ===========================
    // RECUPERO VOTI
    // ===========================
    
    // Recupero solo i voti inseriti dal docente corrente
    const voti = await collezioneVoti.find({
      id_studente,
      id_docente: idUtente
    }).toArray();

    return res.json({ 
      studente, 
      voti 
    });
    
  } catch (errore) {
    console.error('Errore recupero voti studente per docente:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Recupero i voti di uno studente con filtro per date.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniVotiStudentePerDocenteConFiltro(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;
  const { id_studente } = req.params;
  const { dataInizio, dataFine } = req.query;

  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  // ===========================
  // VALIDAZIONE DATE
  // ===========================
  
  if (!dataInizio || !dataFine) {
    return res.status(400).json({ 
      messaggio: 'Intervallo di date non valido' 
    });
  }

  try {
    const { collezioneVoti } = ottieniCollezioni();

    // Converto le date
    const dataInizioObj = new Date(dataInizio);
    const dataFineObj = new Date(dataFine);
    dataFineObj.setHours(23, 59, 59, 999);

    // ===========================
    // QUERY CON FILTRI
    // ===========================
    
    const voti = await collezioneVoti.find({
      id_studente,
      id_docente: idUtente,
      data: {
        $gte: dataInizioObj,
        $lte: dataFineObj
      }
    }).toArray();

    return res.json({ voti });
    
  } catch (errore) {
    console.error('Errore recupero voti con filtro:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Calcolo la media di una classe per una specifica materia.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function calcolaMediaClassePerMateria(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;
  const { id_classe, materia } = req.params;

  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  // ===========================
  // VALIDAZIONE PARAMETRI
  // ===========================
  
  if (!id_classe || !materia) {
    return res.status(400).json({ 
      messaggio: 'Classe o materia non specificata' 
    });
  }

  try {
    const { collezioneStudenti, collezioneVoti } = ottieniCollezioni();

    // ===========================
    // RECUPERO STUDENTI
    // ===========================
    
    // Recupero tutti gli studenti della classe
    const studenti = await collezioneStudenti.find({ 
      id_classe 
    }).toArray();
    
    // Estraggo gli ID degli studenti
    const idStudenti = studenti.map(s => s.id_studente);

    // ===========================
    // CALCOLO MEDIA
    // ===========================
    
    /**
     * Calcolo la media dei voti per la materia specificata
     * considerando tutti gli studenti della classe
     */
    const aggregazioneMedia = await collezioneVoti.aggregate([
      {
        $match: {
          id_studente: { $in: idStudenti },
          materia
        }
      },
      {
        $group: {
          _id: null,
          media: { $avg: "$voto" }
        }
      }
    ]).toArray();

    const media = aggregazioneMedia[0]?.media?.toFixed(2) || "0.00";

    return res.json({ 
      id_classe, 
      materia, 
      media 
    });
    
  } catch (errore) {
    console.error('Errore calcolo media classe:', errore);
    return res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

/**
 * Recupero le informazioni del docente autenticato.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniInfoDocente(req, res) {
  const idUtente = req.idUtente;
  const tipoUtente = req.tipoUtente;

  if (tipoUtente !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Accesso negato' 
    });
  }

  try {
    const { collezioneDocenti } = ottieniCollezioni();
    
    // ===========================
    // RECUPERO INFO DOCENTE
    // ===========================
    
    const docente = await collezioneDocenti.findOne({ 
      id_docente: idUtente 
    });

    if (!docente) {
      return res.status(404).json({ 
        messaggio: 'Docente non trovato' 
      });
    }

    // Restituisco solo le informazioni essenziali
    res.json({ 
      nome: docente.nome, 
      cognome: docente.cognome 
    });
    
  } catch (errore) {
    console.error('Errore recupero info docente:', errore);
    res.status(500).json({ 
      messaggio: 'Errore interno', 
      errore: errore.message 
    });
  }
}

// ===========================
// EXPORT DEL MODULO
// ===========================

/**
 * Esporto tutte le funzioni del controller.
 * Le funzioni sono organizzate per tipo di utente e operazione.
 */
module.exports = {
  // Operazioni Studente
  ottieniVotiStudente,
  calcolaMediaGeneraleStudente,
  calcolaMediaPerMateriaStudente,
  ottieniDistribuzioneVotiStudente,
  ottieniVotiStudenteFiltriPerData,
  ottieniVotiStudentePerMateria,
  ottieniInfoStudente,
  
  // Operazioni Docente
  ottieniClassiDocente,
  inserisciVoto,
  modificaVoto,
  eliminaVoto,
  ottieniClassiConStudenti,
  calcolaMediaStudente,
  ottieniMaterieDocente,
  inserisciVotiInserisciVotiClasse,
  ottieniVotiStudentePerDocente,
  ottieniVotiStudentePerDocenteConFiltro,
  calcolaMediaClassePerMateria,
  ottieniInfoDocente
};