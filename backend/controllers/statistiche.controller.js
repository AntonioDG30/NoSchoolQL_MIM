/**
 * CONTROLLER STATISTICHE AVANZATE
 * 
 * Gestisco tutte le richieste relative alle statistiche del sistema scolastico.
 * Questo controller fornisce analisi dettagliate su studenti, voti, classi e performance
 * con possibilità di applicare filtri geografici, temporali e demografici.
 * 
 * @author Antonio Di Giorgio
 */

const { ottieniCollezioni } = require('../db/connection');

// ===========================
// FUNZIONI UTILITY
// ===========================

/**
 * Costruisco i filtri comuni per le query MongoDB basandomi sui parametri ricevuti.
 * Questa funzione centralizza la logica di filtraggio per evitare duplicazioni.
 * 
 * @param {Object} parametriQuery - Parametri dalla query string della richiesta
 * @returns {Object} Oggetto contenente i filtri MongoDB e i filtri temporali
 */
function costruisciFiltriComuni(parametriQuery) {
  // Inizializzo gli oggetti per i filtri
  const filtri = {};
  
  // ===========================
  // FILTRI GEOGRAFICI
  // ===========================
  
  // Applico i filtri geografici se presenti
  if (parametriQuery.areageografica) filtri['anagrafica.areageografica'] = parametriQuery.areageografica;
  if (parametriQuery.regione) filtri['anagrafica.regione'] = parametriQuery.regione;
  if (parametriQuery.provincia) filtri['anagrafica.provincia'] = parametriQuery.provincia;
  if (parametriQuery.comune) filtri['anagrafica.descrizionecomune'] = parametriQuery.comune;
  
  // ===========================
  // FILTRI SCOLASTICI
  // ===========================
  
  if (parametriQuery.codicescuola) filtri.codicescuola = parametriQuery.codicescuola;
  if (parametriQuery.indirizzo) filtri.indirizzo_norm = parametriQuery.indirizzo;
  if (parametriQuery.annocorso) filtri.annocorso = parseInt(parametriQuery.annocorso);
  
  // ===========================
  // FILTRI TEMPORALI
  // ===========================
  
  const filtriTemporali = {};
  
  // Gestisco il filtro per quadrimestre
  if (parametriQuery.quadrimestre) {
    const quadrimestre = parseInt(parametriQuery.quadrimestre);
    
    if (quadrimestre === 1) {
      // Primo quadrimestre: settembre - gennaio
      filtriTemporali.data = { 
        $gte: new Date('2023-09-01'), 
        $lt: new Date('2024-02-01') 
      };
    } else if (quadrimestre === 2) {
      // Secondo quadrimestre: febbraio - giugno
      filtriTemporali.data = { 
        $gte: new Date('2024-02-01'), 
        $lt: new Date('2024-07-01') 
      };
    }
  }
  
  return { filtri, filtriTemporali };
}

// ===========================
// ENDPOINT STATISTICHE GENERALI
// ===========================

/**
 * Calcolo le statistiche generali del sistema scolastico.
 * Restituisco il numero totale di studenti, docenti, classi, voti e la media generale.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function calcolaStatisticheGenerali(req, res) {
  try {
    // Ottengo le collezioni necessarie
    const {
      collezioneStudenti,
      collezioneDocenti,
      collezioneClassi,
      collezioneVoti,
      collezioneAnagrafica
    } = ottieniCollezioni();

    // Costruisco i filtri basati sui parametri della richiesta
    const { filtri, filtriTemporali } = costruisciFiltriComuni(req.query);

    // ===========================
    // GESTIONE FILTRI GEOGRAFICI
    // ===========================
    
    let codiciScuola = null;
    
    /**
     * Se sono presenti filtri geografici, devo prima recuperare
     * i codici delle scuole che corrispondono ai criteri geografici
     */
    if (filtri['anagrafica.areageografica'] || filtri['anagrafica.regione'] || 
        filtri['anagrafica.provincia'] || filtri['anagrafica.descrizionecomune']) {
      
      // Preparo i filtri per l'anagrafica
      const filtriAnagrafica = {};
      if (filtri['anagrafica.areageografica']) filtriAnagrafica.areageografica = filtri['anagrafica.areageografica'];
      if (filtri['anagrafica.regione']) filtriAnagrafica.regione = filtri['anagrafica.regione'];
      if (filtri['anagrafica.provincia']) filtriAnagrafica.provincia = filtri['anagrafica.provincia'];
      if (filtri['anagrafica.descrizionecomune']) filtriAnagrafica.descrizionecomune = filtri['anagrafica.descrizionecomune'];
      
      // Recupero le scuole che corrispondono ai criteri geografici
      const scuole = await collezioneAnagrafica.find(filtriAnagrafica).toArray();
      codiciScuola = scuole.map(s => s.codicescuola);
    }

    // ===========================
    // FILTRI PER LE CLASSI
    // ===========================
    
    const filtriClassi = {};
    if (codiciScuola) filtriClassi.codicescuola = { $in: codiciScuola };
    if (filtri.codicescuola) filtriClassi.codicescuola = filtri.codicescuola;
    if (filtri.indirizzo_norm) filtriClassi.indirizzo_norm = filtri.indirizzo_norm;
    if (filtri.annocorso) filtriClassi.annocorso = filtri.annocorso;

    // Recupero le classi filtrate
    const classi = await collezioneClassi.find(filtriClassi).toArray();
    const idClassi = classi.map(c => c.id_classe);

    // ===========================
    // FILTRI PER GLI STUDENTI
    // ===========================
    
    const filtriStudenti = { id_classe: { $in: idClassi } };
    
    // Applico filtri demografici se presenti
    if (req.query.sesso) filtriStudenti.sesso = req.query.sesso;
    
    if (req.query.cittadinanza) {
      if (req.query.cittadinanza === 'italiana') {
        filtriStudenti.cittadinanza = 'ITA';
      } else if (req.query.cittadinanza === 'straniera') {
        filtriStudenti.cittadinanza = { $ne: 'ITA' };
      }
    }

    // ===========================
    // CALCOLO STATISTICHE
    // ===========================
    
    // Conto il numero totale di studenti filtrati
    const totaleStudenti = await collezioneStudenti.countDocuments(filtriStudenti);
    
    // Conto il numero totale di docenti (non filtrato)
    const totaleDocenti = await collezioneDocenti.countDocuments();
    
    // Il numero di classi è già calcolato
    const totaleClassi = classi.length;
    
    // ===========================
    // CALCOLO VOTI E MEDIA
    // ===========================
    
    const filtriVoti = { ...filtriTemporali };
    
    // Se ci sono classi filtrate, recupero gli studenti per filtrare i voti
    if (idClassi.length > 0) {
      const studenti = await collezioneStudenti.find(filtriStudenti).toArray();
      const idStudenti = studenti.map(s => s.id_studente);
      filtriVoti.id_studente = { $in: idStudenti };
    }
    
    // Conto il numero totale di voti
    const totaleVoti = await collezioneVoti.countDocuments(filtriVoti);

    // Calcolo la media dei voti usando l'aggregazione
    const aggregazioneMedia = await collezioneVoti.aggregate([
      { $match: filtriVoti },
      { $group: { _id: null, media: { $avg: "$voto" } } }
    ]).toArray();

    const mediaVoti = aggregazioneMedia[0]?.media?.toFixed(2) || "0.00";

    // ===========================
    // INVIO RISPOSTA
    // ===========================
    
    res.json({
      studenti: totaleStudenti,
      docenti: totaleDocenti,
      classi: totaleClassi,
      voti: totaleVoti,
      media_voti: mediaVoti
    });
    
  } catch (errore) {
    console.error("❌ Errore nel calcolo delle statistiche generali:", errore);
    res.status(500).json({ errore: "Errore interno del server." });
  }
}

// ===========================
// ENDPOINT DISTRIBUZIONE CITTADINANZA
// ===========================

/**
 * Calcolo la distribuzione degli studenti per cittadinanza (italiani vs stranieri).
 * Restituisco i numeri assoluti e le percentuali.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function calcolaDistribuzioneStudentiPerCittadinanza(req, res) {
  try {
    const { collezioneStudenti, collezioneClassi, collezioneAnagrafica } = ottieniCollezioni();
    const { filtri } = costruisciFiltriComuni(req.query);

    let idClassi = [];
    
    // ===========================
    // APPLICAZIONE FILTRI
    // ===========================
    
    if (Object.keys(filtri).length > 0) {
      // Gestisco i filtri geografici come nella funzione precedente
      let codiciScuola = null;
      
      if (filtri['anagrafica.areageografica'] || filtri['anagrafica.regione'] || 
          filtri['anagrafica.provincia'] || filtri['anagrafica.descrizionecomune']) {
        
        const filtriAnagrafica = {};
        if (filtri['anagrafica.areageografica']) filtriAnagrafica.areageografica = filtri['anagrafica.areageografica'];
        if (filtri['anagrafica.regione']) filtriAnagrafica.regione = filtri['anagrafica.regione'];
        if (filtri['anagrafica.provincia']) filtriAnagrafica.provincia = filtri['anagrafica.provincia'];
        if (filtri['anagrafica.descrizionecomune']) filtriAnagrafica.descrizionecomune = filtri['anagrafica.descrizionecomune'];
        
        const scuole = await collezioneAnagrafica.find(filtriAnagrafica).toArray();
        codiciScuola = scuole.map(s => s.codicescuola);
      }

      // Filtro le classi
      const filtriClassi = {};
      if (codiciScuola) filtriClassi.codicescuola = { $in: codiciScuola };
      if (filtri.codicescuola) filtriClassi.codicescuola = filtri.codicescuola;
      if (filtri.indirizzo_norm) filtriClassi.indirizzo_norm = filtri.indirizzo_norm;
      if (filtri.annocorso) filtriClassi.annocorso = filtri.annocorso;

      const classi = await collezioneClassi.find(filtriClassi).toArray();
      idClassi = classi.map(c => c.id_classe);
    }

    // ===========================
    // CONTEGGIO STUDENTI
    // ===========================
    
    const filtriStudenti = idClassi.length > 0 ? { id_classe: { $in: idClassi } } : {};
    if (req.query.sesso) filtriStudenti.sesso = req.query.sesso;

    // Conto il totale degli studenti
    const totale = await collezioneStudenti.countDocuments(filtriStudenti);
    
    // Conto gli studenti italiani
    const italiani = await collezioneStudenti.countDocuments({ 
      ...filtriStudenti, 
      cittadinanza: "ITA" 
    });
    
    // Calcolo gli stranieri per differenza
    const stranieri = totale - italiani;

    // ===========================
    // CALCOLO PERCENTUALI
    // ===========================
    
    res.json({
      italiani,
      stranieri,
      percentuali: {
        italiani: totale > 0 ? ((italiani / totale) * 100).toFixed(2) : "0",
        stranieri: totale > 0 ? ((stranieri / totale) * 100).toFixed(2) : "0"
      }
    });
    
  } catch (errore) {
    console.error("❌ Errore distribuzione cittadinanza:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// ENDPOINT VOTI PER MATERIA
// ===========================

/**
 * Calcolo il numero di voti registrati per ogni materia.
 * Restituisco la lista ordinata per numero di voti decrescente.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function calcolaNumeroVotiPerMateria(req, res) {
  try {
    const { collezioneVoti, collezioneStudenti, collezioneClassi, collezioneAnagrafica } = ottieniCollezioni();
    const { filtri, filtriTemporali } = costruisciFiltriComuni(req.query);

    // Inizializzo la pipeline di aggregazione
    const pipelineAggregazione = [];

    // ===========================
    // FILTRI TEMPORALI
    // ===========================
    
    // Applico i filtri temporali se presenti
    if (Object.keys(filtriTemporali).length > 0) {
      pipelineAggregazione.push({ $match: filtriTemporali });
    }

    // ===========================
    // FILTRI COMPLESSI
    // ===========================
    
    /**
     * Se sono presenti filtri geografici, demografici o scolastici,
     * devo prima identificare gli studenti che soddisfano i criteri
     */
    if (Object.keys(filtri).length > 0 || req.query.sesso || req.query.cittadinanza) {
      // Recupero i codici scuola se necessario
      let codiciScuola = null;
      
      if (filtri['anagrafica.areageografica'] || filtri['anagrafica.regione'] || 
          filtri['anagrafica.provincia'] || filtri['anagrafica.descrizionecomune']) {
        
        const filtriAnagrafica = {};
        if (filtri['anagrafica.areageografica']) filtriAnagrafica.areageografica = filtri['anagrafica.areageografica'];
        if (filtri['anagrafica.regione']) filtriAnagrafica.regione = filtri['anagrafica.regione'];
        if (filtri['anagrafica.provincia']) filtriAnagrafica.provincia = filtri['anagrafica.provincia'];
        if (filtri['anagrafica.descrizionecomune']) filtriAnagrafica.descrizionecomune = filtri['anagrafica.descrizionecomune'];
        
        const scuole = await collezioneAnagrafica.find(filtriAnagrafica).toArray();
        codiciScuola = scuole.map(s => s.codicescuola);
      }

      // Filtro le classi
      const filtriClassi = {};
      if (codiciScuola) filtriClassi.codicescuola = { $in: codiciScuola };
      if (filtri.codicescuola) filtriClassi.codicescuola = filtri.codicescuola;
      if (filtri.indirizzo_norm) filtriClassi.indirizzo_norm = filtri.indirizzo_norm;
      if (filtri.annocorso) filtriClassi.annocorso = filtri.annocorso;

      const classi = await collezioneClassi.find(filtriClassi).toArray();
      const idClassi = classi.map(c => c.id_classe);

      // Filtro gli studenti
      const filtriStudenti = { id_classe: { $in: idClassi } };
      if (req.query.sesso) filtriStudenti.sesso = req.query.sesso;
      
      if (req.query.cittadinanza) {
        if (req.query.cittadinanza === 'italiana') {
          filtriStudenti.cittadinanza = 'ITA';
        } else if (req.query.cittadinanza === 'straniera') {
          filtriStudenti.cittadinanza = { $ne: 'ITA' };
        }
      }

      const studenti = await collezioneStudenti.find(filtriStudenti).toArray();
      const idStudenti = studenti.map(s => s.id_studente);

      // Aggiungo il filtro per gli studenti alla pipeline
      pipelineAggregazione.push({ 
        $match: { id_studente: { $in: idStudenti } } 
      });
    }

    // ===========================
    // AGGREGAZIONE FINALE
    // ===========================
    
    // Raggruppo per materia e conto i voti
    pipelineAggregazione.push(
      { $group: { _id: "$materia", numero_voti: { $sum: 1 } } },
      { $project: { materia: "$_id", numero_voti: 1, _id: 0 } },
      { $sort: { numero_voti: -1 } }
    );

    const risultato = await collezioneVoti.aggregate(pipelineAggregazione).toArray();
    res.json(risultato);
    
  } catch (errore) {
    console.error("❌ Errore voti per materia:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// ENDPOINT MEDIA VOTI PER MATERIA
// ===========================

/**
 * Calcolo la media dei voti per ogni materia.
 * Restituisco la lista ordinata alfabeticamente per materia.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function calcolaMediaVotiPerMateria(req, res) {
  try {
    const { collezioneVoti, collezioneStudenti, collezioneClassi, collezioneAnagrafica } = ottieniCollezioni();
    const { filtri, filtriTemporali } = costruisciFiltriComuni(req.query);

    const pipelineAggregazione = [];

    // Applico i filtri temporali
    if (Object.keys(filtriTemporali).length > 0) {
      pipelineAggregazione.push({ $match: filtriTemporali });
    }

    // Applico gli altri filtri come nella funzione precedente
    if (Object.keys(filtri).length > 0 || req.query.sesso || req.query.cittadinanza) {
      // [Codice simile alla funzione precedente per i filtri]
      // ...ripeto la logica dei filtri...
      
      let codiciScuola = null;
      if (filtri['anagrafica.areageografica'] || filtri['anagrafica.regione'] || 
          filtri['anagrafica.provincia'] || filtri['anagrafica.descrizionecomune']) {
        
        const filtriAnagrafica = {};
        if (filtri['anagrafica.areageografica']) filtriAnagrafica.areageografica = filtri['anagrafica.areageografica'];
        if (filtri['anagrafica.regione']) filtriAnagrafica.regione = filtri['anagrafica.regione'];
        if (filtri['anagrafica.provincia']) filtriAnagrafica.provincia = filtri['anagrafica.provincia'];
        if (filtri['anagrafica.descrizionecomune']) filtriAnagrafica.descrizionecomune = filtri['anagrafica.descrizionecomune'];
        
        const scuole = await collezioneAnagrafica.find(filtriAnagrafica).toArray();
        codiciScuola = scuole.map(s => s.codicescuola);
      }

      const filtriClassi = {};
      if (codiciScuola) filtriClassi.codicescuola = { $in: codiciScuola };
      if (filtri.codicescuola) filtriClassi.codicescuola = filtri.codicescuola;
      if (filtri.indirizzo_norm) filtriClassi.indirizzo_norm = filtri.indirizzo_norm;
      if (filtri.annocorso) filtriClassi.annocorso = filtri.annocorso;

      const classi = await collezioneClassi.find(filtriClassi).toArray();
      const idClassi = classi.map(c => c.id_classe);

      const filtriStudenti = { id_classe: { $in: idClassi } };
      if (req.query.sesso) filtriStudenti.sesso = req.query.sesso;
      if (req.query.cittadinanza) {
        if (req.query.cittadinanza === 'italiana') {
          filtriStudenti.cittadinanza = 'ITA';
        } else if (req.query.cittadinanza === 'straniera') {
          filtriStudenti.cittadinanza = { $ne: 'ITA' };
        }
      }

      const studenti = await collezioneStudenti.find(filtriStudenti).toArray();
      const idStudenti = studenti.map(s => s.id_studente);

      pipelineAggregazione.push({ 
        $match: { id_studente: { $in: idStudenti } } 
      });
    }

    // ===========================
    // CALCOLO MEDIE
    // ===========================
    
    // Raggruppo per materia e calcolo la media
    pipelineAggregazione.push(
      { $group: { _id: "$materia", media: { $avg: "$voto" } } },
      { $project: { materia: "$_id", media: { $round: ["$media", 2] }, _id: 0 } },
      { $sort: { materia: 1 } }
    );

    const risultato = await collezioneVoti.aggregate(pipelineAggregazione).toArray();
    res.json(risultato);
    
  } catch (errore) {
    console.error("❌ Errore media voti per materia:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// ENDPOINT CLASSI PER ANNO
// ===========================

/**
 * Calcolo il numero di classi per ogni anno di corso.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function calcolaNumeroClassiPerAnnoCorso(req, res) {
  try {
    const { collezioneClassi, collezioneAnagrafica } = ottieniCollezioni();
    const { filtri } = costruisciFiltriComuni(req.query);

    const pipelineAggregazione = [];

    // ===========================
    // FILTRI GEOGRAFICI
    // ===========================
    
    if (filtri['anagrafica.areageografica'] || filtri['anagrafica.regione'] || 
        filtri['anagrafica.provincia'] || filtri['anagrafica.descrizionecomune']) {
      
      const filtriAnagrafica = {};
      if (filtri['anagrafica.areageografica']) filtriAnagrafica.areageografica = filtri['anagrafica.areageografica'];
      if (filtri['anagrafica.regione']) filtriAnagrafica.regione = filtri['anagrafica.regione'];
      if (filtri['anagrafica.provincia']) filtriAnagrafica.provincia = filtri['anagrafica.provincia'];
      if (filtri['anagrafica.descrizionecomune']) filtriAnagrafica.descrizionecomune = filtri['anagrafica.descrizionecomune'];
      
      const scuole = await collezioneAnagrafica.find(filtriAnagrafica).toArray();
      const codiciScuola = scuole.map(s => s.codicescuola);
      
      pipelineAggregazione.push({ 
        $match: { codicescuola: { $in: codiciScuola } } 
      });
    }

    // ===========================
    // ALTRI FILTRI
    // ===========================
    
    if (filtri.codicescuola) {
      pipelineAggregazione.push({ 
        $match: { codicescuola: filtri.codicescuola } 
      });
    }
    
    if (filtri.indirizzo_norm) {
      pipelineAggregazione.push({ 
        $match: { indirizzo_norm: filtri.indirizzo_norm } 
      });
    }
    
    if (filtri.annocorso) {
      pipelineAggregazione.push({ 
        $match: { annocorso: filtri.annocorso } 
      });
    }

    // ===========================
    // AGGREGAZIONE
    // ===========================
    
    pipelineAggregazione.push(
      { $group: { _id: "$annocorso", numero_classi: { $sum: 1 } } },
      { $project: { annocorso: "$_id", numero_classi: 1, _id: 0 } },
      { $sort: { annocorso: 1 } }
    );

    const risultato = await collezioneClassi.aggregate(pipelineAggregazione).toArray();
    res.json(risultato);
    
  } catch (errore) {
    console.error("❌ Errore numero classi per anno:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// ENDPOINT STUDENTI PER ANNO
// ===========================

/**
 * Calcolo il numero di studenti per ogni anno di corso.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function calcolaNumeroStudentiPerAnnoCorso(req, res) {
  try {
    const { collezioneClassi, collezioneAnagrafica } = ottieniCollezioni();
    const { filtri } = costruisciFiltriComuni(req.query);

    const pipelineAggregazione = [];

    // Applico i filtri geografici come nelle funzioni precedenti
    if (filtri['anagrafica.areageografica'] || filtri['anagrafica.regione'] || 
        filtri['anagrafica.provincia'] || filtri['anagrafica.descrizionecomune']) {
      
      const filtriAnagrafica = {};
      if (filtri['anagrafica.areageografica']) filtriAnagrafica.areageografica = filtri['anagrafica.areageografica'];
      if (filtri['anagrafica.regione']) filtriAnagrafica.regione = filtri['anagrafica.regione'];
      if (filtri['anagrafica.provincia']) filtriAnagrafica.provincia = filtri['anagrafica.provincia'];
      if (filtri['anagrafica.descrizionecomune']) filtriAnagrafica.descrizionecomune = filtri['anagrafica.descrizionecomune'];
      
      const scuole = await collezioneAnagrafica.find(filtriAnagrafica).toArray();
      const codiciScuola = scuole.map(s => s.codicescuola);
      
      pipelineAggregazione.push({ 
        $match: { codicescuola: { $in: codiciScuola } } 
      });
    }

    if (filtri.codicescuola) {
      pipelineAggregazione.push({ 
        $match: { codicescuola: filtri.codicescuola } 
      });
    }
    
    if (filtri.indirizzo_norm) {
      pipelineAggregazione.push({ 
        $match: { indirizzo_norm: filtri.indirizzo_norm } 
      });
    }
    
    if (filtri.annocorso) {
      pipelineAggregazione.push({ 
        $match: { annocorso: filtri.annocorso } 
      });
    }

    // ===========================
    // SOMMA STUDENTI PER ANNO
    // ===========================
    
    /**
     * Utilizzo il campo num_studenti presente nella collezione classi
     * per sommare il totale degli studenti per anno
     */
    pipelineAggregazione.push(
      { $group: { _id: "$annocorso", numero_studenti: { $sum: "$num_studenti" } } },
      { $project: { annocorso: "$_id", numero_studenti: 1, _id: 0 } },
      { $sort: { annocorso: 1 } }
    );

    const risultato = await collezioneClassi.aggregate(pipelineAggregazione).toArray();
    res.json(risultato);
    
  } catch (errore) {
    console.error("❌ Errore numero studenti per anno:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// ENDPOINT DISTRIBUZIONE VOTI
// ===========================

/**
 * Calcolo la distribuzione dei voti (quanti voti per ogni valutazione da 0 a 10).
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function calcolaDistribuzioneVoti(req, res) {
  try {
    const { collezioneVoti, collezioneStudenti, collezioneClassi, collezioneAnagrafica } = ottieniCollezioni();
    const { filtri, filtriTemporali } = costruisciFiltriComuni(req.query);

    const distribuzione = [];

    // ===========================
    // CALCOLO PER OGNI VOTO
    // ===========================
    
    /**
     * Itero per ogni possibile voto (da 0 a 10) e conto
     * quante occorrenze ci sono nel database
     */
    for (let voto = 0; voto <= 10; voto++) {
      const filtriVoto = { voto, ...filtriTemporali };

      // Applico eventuali filtri complessi
      if (Object.keys(filtri).length > 0 || req.query.sesso || req.query.cittadinanza) {
        // Recupero i codici scuola se necessario
        let codiciScuola = null;
        
        if (filtri['anagrafica.areageografica'] || filtri['anagrafica.regione'] || 
            filtri['anagrafica.provincia'] || filtri['anagrafica.descrizionecomune']) {
          
          const filtriAnagrafica = {};
          if (filtri['anagrafica.areageografica']) filtriAnagrafica.areageografica = filtri['anagrafica.areageografica'];
          if (filtri['anagrafica.regione']) filtriAnagrafica.regione = filtri['anagrafica.regione'];
          if (filtri['anagrafica.provincia']) filtriAnagrafica.provincia = filtri['anagrafica.provincia'];
          if (filtri['anagrafica.descrizionecomune']) filtriAnagrafica.descrizionecomune = filtri['anagrafica.descrizionecomune'];
          
          const scuole = await collezioneAnagrafica.find(filtriAnagrafica).toArray();
          codiciScuola = scuole.map(s => s.codicescuola);
        }

        const filtriClassi = {};
        if (codiciScuola) filtriClassi.codicescuola = { $in: codiciScuola };
        if (filtri.codicescuola) filtriClassi.codicescuola = filtri.codicescuola;
        if (filtri.indirizzo_norm) filtriClassi.indirizzo_norm = filtri.indirizzo_norm;
        if (filtri.annocorso) filtriClassi.annocorso = filtri.annocorso;

        const classi = await collezioneClassi.find(filtriClassi).toArray();
        const idClassi = classi.map(c => c.id_classe);

        const filtriStudenti = { id_classe: { $in: idClassi } };
        if (req.query.sesso) filtriStudenti.sesso = req.query.sesso;
        
        if (req.query.cittadinanza) {
          if (req.query.cittadinanza === 'italiana') {
            filtriStudenti.cittadinanza = 'ITA';
          } else if (req.query.cittadinanza === 'straniera') {
            filtriStudenti.cittadinanza = { $ne: 'ITA' };
          }
        }

        const studenti = await collezioneStudenti.find(filtriStudenti).toArray();
        const idStudenti = studenti.map(s => s.id_studente);

        filtriVoto.id_studente = { $in: idStudenti };
      }

      // Conto i voti per questo specifico valore
      const conteggio = await collezioneVoti.countDocuments(filtriVoto);
      distribuzione.push({ voto, count: conteggio });
    }

    res.json(distribuzione);
    
  } catch (errore) {
    console.error("❌ Errore distribuzione voti:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// ENDPOINT CONFRONTO AREE
// ===========================

/**
 * Confronto le performance tra le diverse aree geografiche italiane.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function confrontaPerAreaGeografica(req, res) {
  try {
    const { collezioneVoti, collezioneStudenti, collezioneClassi, collezioneAnagrafica } = ottieniCollezioni();
    
    // Definisco le aree geografiche italiane
    const areeGeografiche = ['NORD EST', 'NORD OVEST', 'CENTRO', 'SUD', 'ISOLE'];
    const risultati = [];

    // ===========================
    // ANALISI PER AREA
    // ===========================
    
    /**
     * Per ogni area geografica calcolo:
     * - Media dei voti
     * - Numero totale di voti
     * - Numero di studenti
     * - Numero di scuole
     */
    for (const area of areeGeografiche) {
      // Recupero le scuole dell'area
      const scuole = await collezioneAnagrafica.find({ areageografica: area }).toArray();
      const codiciScuola = scuole.map(s => s.codicescuola);

      // Recupero le classi delle scuole dell'area
      const classi = await collezioneClassi.find({ 
        codicescuola: { $in: codiciScuola } 
      }).toArray();
      const idClassi = classi.map(c => c.id_classe);

      // Recupero gli studenti delle classi
      const studenti = await collezioneStudenti.find({ 
        id_classe: { $in: idClassi } 
      }).toArray();
      const idStudenti = studenti.map(s => s.id_studente);

      // Calcolo la media dei voti per l'area
      const risultatoMedia = await collezioneVoti.aggregate([
        { $match: { id_studente: { $in: idStudenti } } },
        { $group: { _id: null, media: { $avg: "$voto" }, count: { $sum: 1 } } }
      ]).toArray();

      risultati.push({
        area,
        media_voti: risultatoMedia[0]?.media?.toFixed(2) || "0.00",
        numero_voti: risultatoMedia[0]?.count || 0,
        numero_studenti: studenti.length,
        numero_scuole: scuole.length
      });
    }

    res.json(risultati);
    
  } catch (errore) {
    console.error("❌ Errore confronto per area:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// ENDPOINT CONFRONTO REGIONI
// ===========================

/**
 * Confronto le performance tra le diverse regioni italiane.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function confrontaPerRegione(req, res) {
  try {
    const { collezioneVoti, collezioneStudenti, collezioneClassi, collezioneAnagrafica } = ottieniCollezioni();
    
    // Recupero tutte le regioni distinte
    const regioni = await collezioneAnagrafica.distinct('regione');
    const risultati = [];

    // ===========================
    // ANALISI PER REGIONE
    // ===========================
    
    for (const regione of regioni) {
      // Processo simile al confronto per area, ma per regione
      const scuole = await collezioneAnagrafica.find({ regione }).toArray();
      const codiciScuola = scuole.map(s => s.codicescuola);

      const classi = await collezioneClassi.find({ 
        codicescuola: { $in: codiciScuola } 
      }).toArray();
      const idClassi = classi.map(c => c.id_classe);

      const studenti = await collezioneStudenti.find({ 
        id_classe: { $in: idClassi } 
      }).toArray();
      const idStudenti = studenti.map(s => s.id_studente);

      const risultatoMedia = await collezioneVoti.aggregate([
        { $match: { id_studente: { $in: idStudenti } } },
        { $group: { _id: null, media: { $avg: "$voto" }, count: { $sum: 1 } } }
      ]).toArray();

      risultati.push({
        regione,
        media_voti: risultatoMedia[0]?.media?.toFixed(2) || "0.00",
        numero_voti: risultatoMedia[0]?.count || 0,
        numero_studenti: studenti.length,
        numero_scuole: scuole.length
      });
    }

    // Ordino i risultati per media voti decrescente
    risultati.sort((a, b) => parseFloat(b.media_voti) - parseFloat(a.media_voti));

    res.json(risultati);
    
  } catch (errore) {
    console.error("❌ Errore confronto per regione:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// ENDPOINT CONFRONTO INDIRIZZI
// ===========================

/**
 * Confronto le performance tra i diversi indirizzi di studio.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function confrontaPerIndirizzo(req, res) {
  try {
    const { collezioneVoti, collezioneStudenti, collezioneClassi } = ottieniCollezioni();
    
    // Recupero tutti gli indirizzi distinti
    const indirizzi = await collezioneClassi.distinct('indirizzo_norm');
    const risultati = [];

    // ===========================
    // ANALISI PER INDIRIZZO
    // ===========================
    
    for (const indirizzo of indirizzi) {
      const classi = await collezioneClassi.find({ 
        indirizzo_norm: indirizzo 
      }).toArray();
      const idClassi = classi.map(c => c.id_classe);

      const studenti = await collezioneStudenti.find({ 
        id_classe: { $in: idClassi } 
      }).toArray();
      const idStudenti = studenti.map(s => s.id_studente);

      const risultatoMedia = await collezioneVoti.aggregate([
        { $match: { id_studente: { $in: idStudenti } } },
        { $group: { _id: null, media: { $avg: "$voto" }, count: { $sum: 1 } } }
      ]).toArray();

      // Calcolo il totale degli studenti sommando num_studenti dalle classi
      const totaleStudenti = classi.reduce((sum, c) => sum + (c.num_studenti || 0), 0);

      risultati.push({
        indirizzo,
        media_voti: risultatoMedia[0]?.media?.toFixed(2) || "0.00",
        numero_voti: risultatoMedia[0]?.count || 0,
        numero_studenti: totaleStudenti,
        numero_classi: classi.length
      });
    }

    // Ordino i risultati per media voti decrescente
    risultati.sort((a, b) => parseFloat(b.media_voti) - parseFloat(a.media_voti));

    res.json(risultati);
    
  } catch (errore) {
    console.error("❌ Errore confronto per indirizzo:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// ENDPOINT OPZIONI FILTRI
// ===========================

/**
 * Restituisco tutte le opzioni disponibili per i filtri.
 * Questo endpoint viene utilizzato per popolare i menu a tendina nei filtri.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniOpzioniFiltri(req, res) {
  try {
    const { collezioneClassi, collezioneAnagrafica } = ottieniCollezioni();

    // ===========================
    // RECUPERO VALORI DISTINTI
    // ===========================
    
    // Recupero tutti i valori distinti per ogni campo filtrabiile
    const areeGeografiche = await collezioneAnagrafica.distinct('areageografica');
    const regioni = await collezioneAnagrafica.distinct('regione');
    const province = await collezioneAnagrafica.distinct('provincia');
    const comuni = await collezioneAnagrafica.distinct('descrizionecomune');
    const indirizzi = await collezioneClassi.distinct('indirizzo_norm');
    const anniCorso = await collezioneClassi.distinct('annocorso');

    // ===========================
    // COSTRUZIONE RISPOSTA
    // ===========================
    
    res.json({
      areeGeografiche: areeGeografiche.sort(),
      regioni: regioni.sort(),
      province: province.sort(),
      comuni: comuni.sort(),
      indirizzi: indirizzi.sort(),
      anniCorso: anniCorso.sort((a, b) => a - b),
      quadrimestri: [
        { value: 1, label: "Primo Quadrimestre" },
        { value: 2, label: "Secondo Quadrimestre" }
      ],
      sesso: [
        { value: 'M', label: "Maschio" },
        { value: 'F', label: "Femmina" }
      ],
      cittadinanza: [
        { value: 'italiana', label: "Italiana" },
        { value: 'straniera', label: "Straniera" }
      ]
    });
    
  } catch (errore) {
    console.error("❌ Errore nel recupero opzioni filtri:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// ENDPOINT TREND TEMPORALE
// ===========================

/**
 * Analizzo il trend temporale confrontando i due quadrimestri.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function analizzaTrendTemporale(req, res) {
  try {
    const { collezioneVoti, collezioneStudenti, collezioneClassi, collezioneAnagrafica } = ottieniCollezioni();
    const { filtri } = costruisciFiltriComuni(req.query);

    // ===========================
    // PREPARAZIONE FILTRI
    // ===========================
    
    let idStudenti = null;
    
    // Applico eventuali filtri per identificare gli studenti
    if (Object.keys(filtri).length > 0 || req.query.sesso || req.query.cittadinanza) {
      // [Logica simile alle funzioni precedenti per i filtri]
      let codiciScuola = null;
      
      if (filtri['anagrafica.areageografica'] || filtri['anagrafica.regione'] || 
          filtri['anagrafica.provincia'] || filtri['anagrafica.descrizionecomune']) {
        
        const filtriAnagrafica = {};
        if (filtri['anagrafica.areageografica']) filtriAnagrafica.areageografica = filtri['anagrafica.areageografica'];
        if (filtri['anagrafica.regione']) filtriAnagrafica.regione = filtri['anagrafica.regione'];
        if (filtri['anagrafica.provincia']) filtriAnagrafica.provincia = filtri['anagrafica.provincia'];
        if (filtri['anagrafica.descrizionecomune']) filtriAnagrafica.descrizionecomune = filtri['anagrafica.descrizionecomune'];
        
        const scuole = await collezioneAnagrafica.find(filtriAnagrafica).toArray();
        codiciScuola = scuole.map(s => s.codicescuola);
      }

      const filtriClassi = {};
      if (codiciScuola) filtriClassi.codicescuola = { $in: codiciScuola };
      if (filtri.codicescuola) filtriClassi.codicescuola = filtri.codicescuola;
      if (filtri.indirizzo_norm) filtriClassi.indirizzo_norm = filtri.indirizzo_norm;
      if (filtri.annocorso) filtriClassi.annocorso = filtri.annocorso;

      const classi = await collezioneClassi.find(filtriClassi).toArray();
      const idClassi = classi.map(c => c.id_classe);

      const filtriStudenti = { id_classe: { $in: idClassi } };
      if (req.query.sesso) filtriStudenti.sesso = req.query.sesso;
      if (req.query.cittadinanza) {
        if (req.query.cittadinanza === 'italiana') {
          filtriStudenti.cittadinanza = 'ITA';
        } else if (req.query.cittadinanza === 'straniera') {
          filtriStudenti.cittadinanza = { $ne: 'ITA' };
        }
      }

      const studenti = await collezioneStudenti.find(filtriStudenti).toArray();
      idStudenti = studenti.map(s => s.id_studente);
    }

    // ===========================
    // DEFINIZIONE PERIODI
    // ===========================
    
    // Definisco i filtri per i due quadrimestri
    const filtriPrimoQuadrimestre = {
      data: { $gte: new Date('2023-09-01'), $lt: new Date('2024-02-01') }
    };
    if (idStudenti) filtriPrimoQuadrimestre.id_studente = { $in: idStudenti };

    const filtriSecondoQuadrimestre = {
      data: { $gte: new Date('2024-02-01'), $lt: new Date('2024-07-01') }
    };
    if (idStudenti) filtriSecondoQuadrimestre.id_studente = { $in: idStudenti };

    // ===========================
    // CALCOLO MEDIE
    // ===========================
    
    // Eseguo le aggregazioni in parallelo
    const [primoQuad, secondoQuad] = await Promise.all([
      collezioneVoti.aggregate([
        { $match: filtriPrimoQuadrimestre },
        { $group: { _id: null, media: { $avg: "$voto" }, count: { $sum: 1 } } }
      ]).toArray(),
      collezioneVoti.aggregate([
        { $match: filtriSecondoQuadrimestre },
        { $group: { _id: null, media: { $avg: "$voto" }, count: { $sum: 1 } } }
      ]).toArray()
    ]);

    res.json({
      primoQuadrimestre: {
        media: primoQuad[0]?.media?.toFixed(2) || "0.00",
        numeroVoti: primoQuad[0]?.count || 0
      },
      secondoQuadrimestre: {
        media: secondoQuad[0]?.media?.toFixed(2) || "0.00",
        numeroVoti: secondoQuad[0]?.count || 0
      }
    });
    
  } catch (errore) {
    console.error("❌ Errore trend temporale:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// ENDPOINT CLASSI OUTLIER
// ===========================

/**
 * Identifico le classi con performance anomale (outlier).
 * Una classe è considerata outlier se la sua media si discosta
 * significativamente (> 1.5 punti) dalla media generale.
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function identificaClassiOutlier(req, res) {
  try {
    const { collezioneVoti, collezioneStudenti, collezioneClassi } = ottieniCollezioni();
    
    // ===========================
    // CALCOLO MEDIA GENERALE
    // ===========================
    
    // Calcolo prima la media generale di tutti i voti
    const mediaGenerale = await collezioneVoti.aggregate([
      { $group: { _id: null, media: { $avg: "$voto" } } }
    ]).toArray();
    
    const mediaGen = mediaGenerale[0]?.media || 6;
    
    // ===========================
    // ANALISI CLASSI
    // ===========================
    
    // Recupero tutte le classi
    const classi = await collezioneClassi.find({}).toArray();
    const risultati = [];

    // Per ogni classe calcolo la media e verifico se è un outlier
    for (const classe of classi) {
      // Recupero gli studenti della classe
      const studenti = await collezioneStudenti.find({ 
        id_classe: classe.id_classe 
      }).toArray();
      const idStudenti = studenti.map(s => s.id_studente);

      // Se non ci sono studenti, passo alla classe successiva
      if (idStudenti.length === 0) continue;

      // Calcolo la media dei voti della classe
      const mediaClasse = await collezioneVoti.aggregate([
        { $match: { id_studente: { $in: idStudenti } } },
        { $group: { _id: null, media: { $avg: "$voto" }, count: { $sum: 1 } } }
      ]).toArray();

      const media = mediaClasse[0]?.media || 0;
      const scostamento = media - mediaGen;

      // ===========================
      // IDENTIFICAZIONE OUTLIER
      // ===========================
      
      /**
       * Considero una classe outlier se lo scostamento dalla media
       * generale è superiore a 1.5 punti (in positivo o negativo)
       */
      if (Math.abs(scostamento) > 1.5) {
        risultati.push({
          classe: classe.nome_classe,
          indirizzo: classe.indirizzo,
          media_classe: media.toFixed(2),
          media_generale: mediaGen.toFixed(2),
          scostamento: scostamento.toFixed(2),
          tipo: scostamento > 0 ? 'sopra_media' : 'sotto_media',
          numero_studenti: classe.num_studenti,
          numero_voti: mediaClasse[0]?.count || 0
        });
      }
    }

    // Ordino i risultati per scostamento assoluto decrescente
    risultati.sort((a, b) => Math.abs(b.scostamento) - Math.abs(a.scostamento));

    res.json({
      media_generale: mediaGen.toFixed(2),
      outliers: risultati
    });
    
  } catch (errore) {
    console.error("❌ Errore analisi outlier:", errore);
    res.status(500).json({ errore: "Errore interno." });
  }
}

// ===========================
// EXPORT DEL MODULO
// ===========================

module.exports = {
  calcolaStatisticheGenerali,
  calcolaDistribuzioneStudentiPerCittadinanza,
  calcolaNumeroVotiPerMateria,
  calcolaMediaVotiPerMateria,
  calcolaNumeroClassiPerAnnoCorso,
  calcolaNumeroStudentiPerAnnoCorso,
  calcolaDistribuzioneVoti,
  confrontaPerAreaGeografica,
  confrontaPerRegione,
  confrontaPerIndirizzo,
  ottieniOpzioniFiltri,
  analizzaTrendTemporale,
  identificaClassiOutlier
};