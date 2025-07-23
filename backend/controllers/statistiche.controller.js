const { getCollections } = require('../db/connection');

function buildCommonFilters(query) {
  const filters = {};
  
  if (query.areageografica) filters['anagrafica.areageografica'] = query.areageografica;
  if (query.regione) filters['anagrafica.regione'] = query.regione;
  if (query.provincia) filters['anagrafica.provincia'] = query.provincia;
  if (query.comune) filters['anagrafica.descrizionecomune'] = query.comune;
  if (query.codicescuola) filters.codicescuola = query.codicescuola;
  
  if (query.indirizzo) filters.indirizzo_norm = query.indirizzo;
  if (query.annocorso) filters.annocorso = parseInt(query.annocorso);
  
  const dateFilters = {};
  if (query.quadrimestre) {
    const quad = parseInt(query.quadrimestre);
    if (quad === 1) {
      dateFilters.data = { 
        $gte: new Date('2023-09-01'), 
        $lt: new Date('2024-02-01') 
      };
    } else if (quad === 2) {
      dateFilters.data = { 
        $gte: new Date('2024-02-01'), 
        $lt: new Date('2024-07-01') 
      };
    }
  }
  
  return { filters, dateFilters };
}

async function getStatisticheGenerali(req, res) {
  try {
    const {
      studentiCollection,
      docentiCollection,
      classiCollection,
      votiCollection,
      anagraficaCollection
    } = getCollections();

    const { filters, dateFilters } = buildCommonFilters(req.query);

    let schoolCodes = null;
    if (filters['anagrafica.areageografica'] || filters['anagrafica.regione'] || 
        filters['anagrafica.provincia'] || filters['anagrafica.descrizionecomune']) {
      const anagraficaFilters = {};
      if (filters['anagrafica.areageografica']) anagraficaFilters.areageografica = filters['anagrafica.areageografica'];
      if (filters['anagrafica.regione']) anagraficaFilters.regione = filters['anagrafica.regione'];
      if (filters['anagrafica.provincia']) anagraficaFilters.provincia = filters['anagrafica.provincia'];
      if (filters['anagrafica.descrizionecomune']) anagraficaFilters.descrizionecomune = filters['anagrafica.descrizionecomune'];
      
      const schools = await anagraficaCollection.find(anagraficaFilters).toArray();
      schoolCodes = schools.map(s => s.codicescuola);
    }

    const classiFilters = {};
    if (schoolCodes) classiFilters.codicescuola = { $in: schoolCodes };
    if (filters.codicescuola) classiFilters.codicescuola = filters.codicescuola;
    if (filters.indirizzo_norm) classiFilters.indirizzo_norm = filters.indirizzo_norm;
    if (filters.annocorso) classiFilters.annocorso = filters.annocorso;

    const classi = await classiCollection.find(classiFilters).toArray();
    const classiIds = classi.map(c => c.id_classe);

    const studentiFilters = { id_classe: { $in: classiIds } };
    if (req.query.sesso) studentiFilters.sesso = req.query.sesso;
    if (req.query.cittadinanza) {
      if (req.query.cittadinanza === 'italiana') {
        studentiFilters.cittadinanza = 'ITA';
      } else if (req.query.cittadinanza === 'straniera') {
        studentiFilters.cittadinanza = { $ne: 'ITA' };
      }
    }

    const totaleStudenti = await studentiCollection.countDocuments(studentiFilters);
    const totaleDocenti = await docentiCollection.countDocuments();
    const totaleClassi = classi.length;
    
    const votiFilters = { ...dateFilters };
    if (classiIds.length > 0) {
      const studenti = await studentiCollection.find(studentiFilters).toArray();
      const studentiIds = studenti.map(s => s.id_studente);
      votiFilters.id_studente = { $in: studentiIds };
    }
    
    const totaleVoti = await votiCollection.countDocuments(votiFilters);

    const mediaAgg = await votiCollection.aggregate([
      { $match: votiFilters },
      { $group: { _id: null, media: { $avg: "$voto" } } }
    ]).toArray();

    const mediaVoti = mediaAgg[0]?.media?.toFixed(2) || "0.00";

    res.json({
      studenti: totaleStudenti,
      docenti: totaleDocenti,
      classi: totaleClassi,
      voti: totaleVoti,
      media_voti: mediaVoti
    });
  } catch (err) {
    console.error("❌ Errore nel calcolo delle statistiche generali:", err);
    res.status(500).json({ error: "Errore interno del server." });
  }
}

async function getDistribuzioneStudentiPerCittadinanza(req, res) {
  try {
    const { studentiCollection, classiCollection, anagraficaCollection } = getCollections();
    const { filters } = buildCommonFilters(req.query);

    let classiIds = [];
    if (Object.keys(filters).length > 0) {
      let schoolCodes = null;
      if (filters['anagrafica.areageografica'] || filters['anagrafica.regione'] || 
          filters['anagrafica.provincia'] || filters['anagrafica.descrizionecomune']) {
        const anagraficaFilters = {};
        if (filters['anagrafica.areageografica']) anagraficaFilters.areageografica = filters['anagrafica.areageografica'];
        if (filters['anagrafica.regione']) anagraficaFilters.regione = filters['anagrafica.regione'];
        if (filters['anagrafica.provincia']) anagraficaFilters.provincia = filters['anagrafica.provincia'];
        if (filters['anagrafica.descrizionecomune']) anagraficaFilters.descrizionecomune = filters['anagrafica.descrizionecomune'];
        
        const schools = await anagraficaCollection.find(anagraficaFilters).toArray();
        schoolCodes = schools.map(s => s.codicescuola);
      }

      const classiFilters = {};
      if (schoolCodes) classiFilters.codicescuola = { $in: schoolCodes };
      if (filters.codicescuola) classiFilters.codicescuola = filters.codicescuola;
      if (filters.indirizzo_norm) classiFilters.indirizzo_norm = filters.indirizzo_norm;
      if (filters.annocorso) classiFilters.annocorso = filters.annocorso;

      const classi = await classiCollection.find(classiFilters).toArray();
      classiIds = classi.map(c => c.id_classe);
    }

    const studentiFilters = classiIds.length > 0 ? { id_classe: { $in: classiIds } } : {};
    if (req.query.sesso) studentiFilters.sesso = req.query.sesso;

    const totale = await studentiCollection.countDocuments(studentiFilters);
    const italiani = await studentiCollection.countDocuments({ ...studentiFilters, cittadinanza: "ITA" });
    const stranieri = totale - italiani;

    res.json({
      italiani,
      stranieri,
      percentuali: {
        italiani: totale > 0 ? ((italiani / totale) * 100).toFixed(2) : "0",
        stranieri: totale > 0 ? ((stranieri / totale) * 100).toFixed(2) : "0"
      }
    });
  } catch (err) {
    console.error("❌ Errore distribuzione cittadinanza:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

async function getNumeroVotiPerMateria(req, res) {
  try {
    const { votiCollection, studentiCollection, classiCollection, anagraficaCollection } = getCollections();
    const { filters, dateFilters } = buildCommonFilters(req.query);

    const pipeline = [];

    if (Object.keys(dateFilters).length > 0) {
      pipeline.push({ $match: dateFilters });
    }

    if (Object.keys(filters).length > 0 || req.query.sesso || req.query.cittadinanza) {
      let schoolCodes = null;
      if (filters['anagrafica.areageografica'] || filters['anagrafica.regione'] || 
          filters['anagrafica.provincia'] || filters['anagrafica.descrizionecomune']) {
        const anagraficaFilters = {};
        if (filters['anagrafica.areageografica']) anagraficaFilters.areageografica = filters['anagrafica.areageografica'];
        if (filters['anagrafica.regione']) anagraficaFilters.regione = filters['anagrafica.regione'];
        if (filters['anagrafica.provincia']) anagraficaFilters.provincia = filters['anagrafica.provincia'];
        if (filters['anagrafica.descrizionecomune']) anagraficaFilters.descrizionecomune = filters['anagrafica.descrizionecomune'];
        
        const schools = await anagraficaCollection.find(anagraficaFilters).toArray();
        schoolCodes = schools.map(s => s.codicescuola);
      }

      const classiFilters = {};
      if (schoolCodes) classiFilters.codicescuola = { $in: schoolCodes };
      if (filters.codicescuola) classiFilters.codicescuola = filters.codicescuola;
      if (filters.indirizzo_norm) classiFilters.indirizzo_norm = filters.indirizzo_norm;
      if (filters.annocorso) classiFilters.annocorso = filters.annocorso;

      const classi = await classiCollection.find(classiFilters).toArray();
      const classiIds = classi.map(c => c.id_classe);

      const studentiFilters = { id_classe: { $in: classiIds } };
      if (req.query.sesso) studentiFilters.sesso = req.query.sesso;
      if (req.query.cittadinanza) {
        if (req.query.cittadinanza === 'italiana') {
          studentiFilters.cittadinanza = 'ITA';
        } else if (req.query.cittadinanza === 'straniera') {
          studentiFilters.cittadinanza = { $ne: 'ITA' };
        }
      }

      const studenti = await studentiCollection.find(studentiFilters).toArray();
      const studentiIds = studenti.map(s => s.id_studente);

      pipeline.push({ $match: { id_studente: { $in: studentiIds } } });
    }

    pipeline.push(
      { $group: { _id: "$materia", numero_voti: { $sum: 1 } } },
      { $project: { materia: "$_id", numero_voti: 1, _id: 0 } },
      { $sort: { numero_voti: -1 } }
    );

    const result = await votiCollection.aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    console.error("❌ Errore voti per materia:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

async function getMediaVotiPerMateria(req, res) {
  try {
    const { votiCollection, studentiCollection, classiCollection, anagraficaCollection } = getCollections();
    const { filters, dateFilters } = buildCommonFilters(req.query);

    const pipeline = [];

    if (Object.keys(dateFilters).length > 0) {
      pipeline.push({ $match: dateFilters });
    }

    if (Object.keys(filters).length > 0 || req.query.sesso || req.query.cittadinanza) {
      let schoolCodes = null;
      if (filters['anagrafica.areageografica'] || filters['anagrafica.regione'] || 
          filters['anagrafica.provincia'] || filters['anagrafica.descrizionecomune']) {
        const anagraficaFilters = {};
        if (filters['anagrafica.areageografica']) anagraficaFilters.areageografica = filters['anagrafica.areageografica'];
        if (filters['anagrafica.regione']) anagraficaFilters.regione = filters['anagrafica.regione'];
        if (filters['anagrafica.provincia']) anagraficaFilters.provincia = filters['anagrafica.provincia'];
        if (filters['anagrafica.descrizionecomune']) anagraficaFilters.descrizionecomune = filters['anagrafica.descrizionecomune'];
        
        const schools = await anagraficaCollection.find(anagraficaFilters).toArray();
        schoolCodes = schools.map(s => s.codicescuola);
      }

      const classiFilters = {};
      if (schoolCodes) classiFilters.codicescuola = { $in: schoolCodes };
      if (filters.codicescuola) classiFilters.codicescuola = filters.codicescuola;
      if (filters.indirizzo_norm) classiFilters.indirizzo_norm = filters.indirizzo_norm;
      if (filters.annocorso) classiFilters.annocorso = filters.annocorso;

      const classi = await classiCollection.find(classiFilters).toArray();
      const classiIds = classi.map(c => c.id_classe);

      const studentiFilters = { id_classe: { $in: classiIds } };
      if (req.query.sesso) studentiFilters.sesso = req.query.sesso;
      if (req.query.cittadinanza) {
        if (req.query.cittadinanza === 'italiana') {
          studentiFilters.cittadinanza = 'ITA';
        } else if (req.query.cittadinanza === 'straniera') {
          studentiFilters.cittadinanza = { $ne: 'ITA' };
        }
      }

      const studenti = await studentiCollection.find(studentiFilters).toArray();
      const studentiIds = studenti.map(s => s.id_studente);

      pipeline.push({ $match: { id_studente: { $in: studentiIds } } });
    }

    pipeline.push(
      { $group: { _id: "$materia", media: { $avg: "$voto" } } },
      { $project: { materia: "$_id", media: { $round: ["$media", 2] }, _id: 0 } },
      { $sort: { materia: 1 } }
    );

    const result = await votiCollection.aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    console.error("❌ Errore media voti per materia:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

async function getNumeroClassiPerAnnoCorso(req, res) {
  try {
    const { classiCollection, anagraficaCollection } = getCollections();
    const { filters } = buildCommonFilters(req.query);

    const pipeline = [];

    if (filters['anagrafica.areageografica'] || filters['anagrafica.regione'] || 
        filters['anagrafica.provincia'] || filters['anagrafica.descrizionecomune']) {
      const anagraficaFilters = {};
      if (filters['anagrafica.areageografica']) anagraficaFilters.areageografica = filters['anagrafica.areageografica'];
      if (filters['anagrafica.regione']) anagraficaFilters.regione = filters['anagrafica.regione'];
      if (filters['anagrafica.provincia']) anagraficaFilters.provincia = filters['anagrafica.provincia'];
      if (filters['anagrafica.descrizionecomune']) anagraficaFilters.descrizionecomune = filters['anagrafica.descrizionecomune'];
      
      const schools = await anagraficaCollection.find(anagraficaFilters).toArray();
      const schoolCodes = schools.map(s => s.codicescuola);
      
      pipeline.push({ $match: { codicescuola: { $in: schoolCodes } } });
    }

    if (filters.codicescuola) pipeline.push({ $match: { codicescuola: filters.codicescuola } });
    if (filters.indirizzo_norm) pipeline.push({ $match: { indirizzo_norm: filters.indirizzo_norm } });
    if (filters.annocorso) pipeline.push({ $match: { annocorso: filters.annocorso } });

    pipeline.push(
      { $group: { _id: "$annocorso", numero_classi: { $sum: 1 } } },
      { $project: { annocorso: "$_id", numero_classi: 1, _id: 0 } },
      { $sort: { annocorso: 1 } }
    );

    const result = await classiCollection.aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    console.error("❌ Errore numero classi per anno:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

async function getNumeroStudentiPerAnnoCorso(req, res) {
  try {
    const { classiCollection, anagraficaCollection } = getCollections();
    const { filters } = buildCommonFilters(req.query);

    const pipeline = [];

    if (filters['anagrafica.areageografica'] || filters['anagrafica.regione'] || 
        filters['anagrafica.provincia'] || filters['anagrafica.descrizionecomune']) {
      const anagraficaFilters = {};
      if (filters['anagrafica.areageografica']) anagraficaFilters.areageografica = filters['anagrafica.areageografica'];
      if (filters['anagrafica.regione']) anagraficaFilters.regione = filters['anagrafica.regione'];
      if (filters['anagrafica.provincia']) anagraficaFilters.provincia = filters['anagrafica.provincia'];
      if (filters['anagrafica.descrizionecomune']) anagraficaFilters.descrizionecomune = filters['anagrafica.descrizionecomune'];
      
      const schools = await anagraficaCollection.find(anagraficaFilters).toArray();
      const schoolCodes = schools.map(s => s.codicescuola);
      
      pipeline.push({ $match: { codicescuola: { $in: schoolCodes } } });
    }

    if (filters.codicescuola) pipeline.push({ $match: { codicescuola: filters.codicescuola } });
    if (filters.indirizzo_norm) pipeline.push({ $match: { indirizzo_norm: filters.indirizzo_norm } });
    if (filters.annocorso) pipeline.push({ $match: { annocorso: filters.annocorso } });

    pipeline.push(
      { $group: { _id: "$annocorso", numero_studenti: { $sum: "$num_studenti" } } },
      { $project: { annocorso: "$_id", numero_studenti: 1, _id: 0 } },
      { $sort: { annocorso: 1 } }
    );

    const result = await classiCollection.aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    console.error("❌ Errore numero studenti per anno:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

async function getDistribuzioneVoti(req, res) {
  try {
    const { votiCollection, studentiCollection, classiCollection, anagraficaCollection } = getCollections();
    const { filters, dateFilters } = buildCommonFilters(req.query);

    const distribuzione = [];

    for (let voto = 0; voto <= 10; voto++) {
      const votoFilters = { voto, ...dateFilters };

      if (Object.keys(filters).length > 0 || req.query.sesso || req.query.cittadinanza) {
        let schoolCodes = null;
        if (filters['anagrafica.areageografica'] || filters['anagrafica.regione'] || 
            filters['anagrafica.provincia'] || filters['anagrafica.descrizionecomune']) {
          const anagraficaFilters = {};
          if (filters['anagrafica.areageografica']) anagraficaFilters.areageografica = filters['anagrafica.areageografica'];
          if (filters['anagrafica.regione']) anagraficaFilters.regione = filters['anagrafica.regione'];
          if (filters['anagrafica.provincia']) anagraficaFilters.provincia = filters['anagrafica.provincia'];
          if (filters['anagrafica.descrizionecomune']) anagraficaFilters.descrizionecomune = filters['anagrafica.descrizionecomune'];
          
          const schools = await anagraficaCollection.find(anagraficaFilters).toArray();
          schoolCodes = schools.map(s => s.codicescuola);
        }

        const classiFilters = {};
        if (schoolCodes) classiFilters.codicescuola = { $in: schoolCodes };
        if (filters.codicescuola) classiFilters.codicescuola = filters.codicescuola;
        if (filters.indirizzo_norm) classiFilters.indirizzo_norm = filters.indirizzo_norm;
        if (filters.annocorso) classiFilters.annocorso = filters.annocorso;

        const classi = await classiCollection.find(classiFilters).toArray();
        const classiIds = classi.map(c => c.id_classe);

        const studentiFilters = { id_classe: { $in: classiIds } };
        if (req.query.sesso) studentiFilters.sesso = req.query.sesso;
        if (req.query.cittadinanza) {
          if (req.query.cittadinanza === 'italiana') {
            studentiFilters.cittadinanza = 'ITA';
          } else if (req.query.cittadinanza === 'straniera') {
            studentiFilters.cittadinanza = { $ne: 'ITA' };
          }
        }

        const studenti = await studentiCollection.find(studentiFilters).toArray();
        const studentiIds = studenti.map(s => s.id_studente);

        votoFilters.id_studente = { $in: studentiIds };
      }

      const count = await votiCollection.countDocuments(votoFilters);
      distribuzione.push({ voto, count });
    }

    res.json(distribuzione);
  } catch (err) {
    console.error("❌ Errore distribuzione voti:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

async function getConfrontoPerAreaGeografica(req, res) {
  try {
    const { votiCollection, studentiCollection, classiCollection, anagraficaCollection } = getCollections();
    
    const aree = ['NORD EST', 'NORD OVEST', 'CENTRO', 'SUD', 'ISOLE'];
    const risultati = [];

    for (const area of aree) {
      const scuole = await anagraficaCollection.find({ areageografica: area }).toArray();
      const codiciScuola = scuole.map(s => s.codicescuola);

      const classi = await classiCollection.find({ codicescuola: { $in: codiciScuola } }).toArray();
      const classiIds = classi.map(c => c.id_classe);

      const studenti = await studentiCollection.find({ id_classe: { $in: classiIds } }).toArray();
      const studentiIds = studenti.map(s => s.id_studente);

      const mediaResult = await votiCollection.aggregate([
        { $match: { id_studente: { $in: studentiIds } } },
        { $group: { _id: null, media: { $avg: "$voto" }, count: { $sum: 1 } } }
      ]).toArray();

      risultati.push({
        area,
        media_voti: mediaResult[0]?.media?.toFixed(2) || "0.00",
        numero_voti: mediaResult[0]?.count || 0,
        numero_studenti: studenti.length,
        numero_scuole: scuole.length
      });
    }

    res.json(risultati);
  } catch (err) {
    console.error("❌ Errore confronto per area:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

async function getConfrontoPerRegione(req, res) {
  try {
    const { votiCollection, studentiCollection, classiCollection, anagraficaCollection } = getCollections();
    
    const regioni = await anagraficaCollection.distinct('regione');
    const risultati = [];

    for (const regione of regioni) {
      const scuole = await anagraficaCollection.find({ regione }).toArray();
      const codiciScuola = scuole.map(s => s.codicescuola);

      const classi = await classiCollection.find({ codicescuola: { $in: codiciScuola } }).toArray();
      const classiIds = classi.map(c => c.id_classe);

      const studenti = await studentiCollection.find({ id_classe: { $in: classiIds } }).toArray();
      const studentiIds = studenti.map(s => s.id_studente);

      const mediaResult = await votiCollection.aggregate([
        { $match: { id_studente: { $in: studentiIds } } },
        { $group: { _id: null, media: { $avg: "$voto" }, count: { $sum: 1 } } }
      ]).toArray();

      risultati.push({
        regione,
        media_voti: mediaResult[0]?.media?.toFixed(2) || "0.00",
        numero_voti: mediaResult[0]?.count || 0,
        numero_studenti: studenti.length,
        numero_scuole: scuole.length
      });
    }

    risultati.sort((a, b) => parseFloat(b.media_voti) - parseFloat(a.media_voti));

    res.json(risultati);
  } catch (err) {
    console.error("❌ Errore confronto per regione:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

async function getConfrontoPerIndirizzo(req, res) {
  try {
    const { votiCollection, studentiCollection, classiCollection } = getCollections();
    
    const indirizzi = await classiCollection.distinct('indirizzo_norm');
    const risultati = [];

    for (const indirizzo of indirizzi) {
      const classi = await classiCollection.find({ indirizzo_norm: indirizzo }).toArray();
      const classiIds = classi.map(c => c.id_classe);

      const studenti = await studentiCollection.find({ id_classe: { $in: classiIds } }).toArray();
      const studentiIds = studenti.map(s => s.id_studente);

      const mediaResult = await votiCollection.aggregate([
        { $match: { id_studente: { $in: studentiIds } } },
        { $group: { _id: null, media: { $avg: "$voto" }, count: { $sum: 1 } } }
      ]).toArray();

      const totaleStudenti = classi.reduce((sum, c) => sum + (c.num_studenti || 0), 0);

      risultati.push({
        indirizzo,
        media_voti: mediaResult[0]?.media?.toFixed(2) || "0.00",
        numero_voti: mediaResult[0]?.count || 0,
        numero_studenti: totaleStudenti,
        numero_classi: classi.length
      });
    }

    risultati.sort((a, b) => parseFloat(b.media_voti) - parseFloat(a.media_voti));

    res.json(risultati);
  } catch (err) {
    console.error("❌ Errore confronto per indirizzo:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

async function getOpzioniFiltri(req, res) {
  try {
    const { classiCollection, anagraficaCollection } = getCollections();

    const areeGeografiche = await anagraficaCollection.distinct('areageografica');
    
    const regioni = await anagraficaCollection.distinct('regione');
    
    const province = await anagraficaCollection.distinct('provincia');
    
    const comuni = await anagraficaCollection.distinct('descrizionecomune');
    
    const indirizzi = await classiCollection.distinct('indirizzo_norm');
    
    const anniCorso = await classiCollection.distinct('annocorso');

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
  } catch (err) {
    console.error("❌ Errore nel recupero opzioni filtri:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

async function getTrendTemporale(req, res) {
  try {
    const { votiCollection, studentiCollection, classiCollection, anagraficaCollection } = getCollections();
    const { filters } = buildCommonFilters(req.query);

    let studentiIds = null;
    if (Object.keys(filters).length > 0 || req.query.sesso || req.query.cittadinanza) {
      let schoolCodes = null;
      if (filters['anagrafica.areageografica'] || filters['anagrafica.regione'] || 
          filters['anagrafica.provincia'] || filters['anagrafica.descrizionecomune']) {
        const anagraficaFilters = {};
        if (filters['anagrafica.areageografica']) anagraficaFilters.areageografica = filters['anagrafica.areageografica'];
        if (filters['anagrafica.regione']) anagraficaFilters.regione = filters['anagrafica.regione'];
        if (filters['anagrafica.provincia']) anagraficaFilters.provincia = filters['anagrafica.provincia'];
        if (filters['anagrafica.descrizionecomune']) anagraficaFilters.descrizionecomune = filters['anagrafica.descrizionecomune'];
        
        const schools = await anagraficaCollection.find(anagraficaFilters).toArray();
        schoolCodes = schools.map(s => s.codicescuola);
      }

      const classiFilters = {};
      if (schoolCodes) classiFilters.codicescuola = { $in: schoolCodes };
      if (filters.codicescuola) classiFilters.codicescuola = filters.codicescuola;
      if (filters.indirizzo_norm) classiFilters.indirizzo_norm = filters.indirizzo_norm;
      if (filters.annocorso) classiFilters.annocorso = filters.annocorso;

      const classi = await classiCollection.find(classiFilters).toArray();
      const classiIds = classi.map(c => c.id_classe);

      const studentiFilters = { id_classe: { $in: classiIds } };
      if (req.query.sesso) studentiFilters.sesso = req.query.sesso;
      if (req.query.cittadinanza) {
        if (req.query.cittadinanza === 'italiana') {
          studentiFilters.cittadinanza = 'ITA';
        } else if (req.query.cittadinanza === 'straniera') {
          studentiFilters.cittadinanza = { $ne: 'ITA' };
        }
      }

      const studenti = await studentiCollection.find(studentiFilters).toArray();
      studentiIds = studenti.map(s => s.id_studente);
    }

    const primoQuadFilters = {
      data: { $gte: new Date('2023-09-01'), $lt: new Date('2024-02-01') }
    };
    if (studentiIds) primoQuadFilters.id_studente = { $in: studentiIds };

    const secondoQuadFilters = {
      data: { $gte: new Date('2024-02-01'), $lt: new Date('2024-07-01') }
    };
    if (studentiIds) secondoQuadFilters.id_studente = { $in: studentiIds };

    const [primoQuad, secondoQuad] = await Promise.all([
      votiCollection.aggregate([
        { $match: primoQuadFilters },
        { $group: { _id: null, media: { $avg: "$voto" }, count: { $sum: 1 } } }
      ]).toArray(),
      votiCollection.aggregate([
        { $match: secondoQuadFilters },
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
  } catch (err) {
    console.error("❌ Errore trend temporale:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

async function getClassiOutlier(req, res) {
  try {
    const { votiCollection, studentiCollection, classiCollection } = getCollections();
    
    const mediaGenerale = await votiCollection.aggregate([
      { $group: { _id: null, media: { $avg: "$voto" } } }
    ]).toArray();
    
    const mediaGen = mediaGenerale[0]?.media || 6;
    
    const classi = await classiCollection.find({}).toArray();
    const risultati = [];

    for (const classe of classi) {
      const studenti = await studentiCollection.find({ id_classe: classe.id_classe }).toArray();
      const studentiIds = studenti.map(s => s.id_studente);

      if (studentiIds.length === 0) continue;

      const mediaClasse = await votiCollection.aggregate([
        { $match: { id_studente: { $in: studentiIds } } },
        { $group: { _id: null, media: { $avg: "$voto" }, count: { $sum: 1 } } }
      ]).toArray();

      const media = mediaClasse[0]?.media || 0;
      const scostamento = media - mediaGen;

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

    risultati.sort((a, b) => Math.abs(b.scostamento) - Math.abs(a.scostamento));

    res.json({
      media_generale: mediaGen.toFixed(2),
      outliers: risultati
    });
  } catch (err) {
    console.error("❌ Errore analisi outlier:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

module.exports = {
  getStatisticheGenerali,
  getDistribuzioneStudentiPerCittadinanza,
  getNumeroVotiPerMateria,
  getMediaVotiPerMateria,
  getNumeroClassiPerAnnoCorso,
  getNumeroStudentiPerAnnoCorso,
  getDistribuzioneVoti,
  getConfrontoPerAreaGeografica,
  getConfrontoPerRegione,
  getConfrontoPerIndirizzo,
  getOpzioniFiltri,
  getTrendTemporale,
  getClassiOutlier
};