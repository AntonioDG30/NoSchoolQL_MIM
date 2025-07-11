const { getCollections } = require('../db/connection');

module.exports = {
  // Studente: visualizza tutti i suoi voti
  async getVotiStudente(req, res) {
    const userId = req.userId;
    const userType = req.userType;

    if (userType !== 'studente') return res.status(403).json({ message: 'Accesso negato' });

    try {
      const { studentiCollection, votiCollection } = getCollections();

      const studente = await studentiCollection.findOne({ id_studente: userId });
      if (!studente) return res.status(404).json({ message: 'Studente non trovato' });

      const voti = await votiCollection.find({ id_studente: userId }).toArray();
      return res.json({ studente, voti });
    } catch (err) {
      return res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  },

  // Docente: visualizza tutte le sue classi, studenti e voti
  async getClassiDocente(req, res) {
    const userId = req.userId;
    const userType = req.userType;

    if (userType !== 'docente') return res.status(403).json({ message: 'Accesso negato' });

    try {
      const {
        docentiCollection,
        assegnazioniCollection,
        classiCollection,
        studentiCollection,
        votiCollection
      } = getCollections();

      const docente = await docentiCollection.findOne({ id_docente: userId });
      if (!docente) return res.status(404).json({ message: 'Docente non trovato' });

      const assegnazioni = await assegnazioniCollection.find({ id_docente: userId }).toArray();
      const classiIds = assegnazioni.map(a => a.id_classe);

      const classi = await classiCollection.find({ id_classe: { $in: classiIds } }).toArray();

      const result = [];

      for (const classe of classi) {
        const studenti = await studentiCollection.find({ id_classe: classe.id_classe }).toArray();
        for (const studente of studenti) {
          const voti = await votiCollection.find({
            id_studente: studente.id_studente,
            id_docente: userId
          }).toArray();

          result.push({
            id_classe: classe.id_classe,
            nome_classe: classe.nome_classe, // <- Aggiunto campo corretto
            studente,
            voti
          });

        }
      }

      return res.json({ docente, classi: result });
    } catch (err) {
      return res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  },

  // Docente: inserisce un nuovo voto
  async inserisciVoto(req, res) {
    const userId = req.userId;
    const userType = req.userType;
    const { id_studente, materia, voto, data } = req.body;

    if (userType !== 'docente') {
      return res.status(403).json({ message: 'Accesso negato' });
    }

    if (!id_studente || !materia || typeof voto !== 'number' || !data) {
      return res.status(400).json({ message: 'Dati incompleti o errati' });
    }

    try {
      const { votiCollection } = getCollections();

      const id_voto = `VOT${Date.now()}`;
      const nuovoVoto = {
        id_voto,
        id_studente,
        id_docente: userId,
        materia,
        voto: Number(voto),
        data: new Date(data)
      };

      await votiCollection.insertOne(nuovoVoto);
      return res.status(201).json({ message: 'Voto inserito', voto: nuovoVoto });
    } catch (err) {
      return res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  },


  // Docente: modifica un voto esistente
  async modificaVoto(req, res) {
    const userId = req.userId;
    const userType = req.userType;
    const { id_voto, voto } = req.body;

    if (userType !== 'docente') return res.status(403).json({ message: 'Accesso negato' });

    if (!id_voto || typeof voto !== 'number') {
      return res.status(400).json({ message: 'Dati mancanti o invalidi' });
    }

    try {
      const { votiCollection } = getCollections();

      const result = await votiCollection.updateOne(
        { id_voto, id_docente: userId },
        { $set: { voto } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Voto non trovato o non autorizzato' });
      }

      return res.json({ message: 'Voto modificato' });
    } catch (err) {
      return res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  },

  // Docente: elimina un voto
  async eliminaVoto(req, res) {
    const userId = req.userId;
    const userType = req.userType;
    const { id_voto } = req.body;

    if (userType !== 'docente') return res.status(403).json({ message: 'Accesso negato' });

    if (!id_voto) {
      return res.status(400).json({ message: 'ID voto mancante' });
    }

    try {
      const { votiCollection } = getCollections();

      const result = await votiCollection.deleteOne({ id_voto, id_docente: userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Voto non trovato o non autorizzato' });
      }

      return res.json({ message: 'Voto eliminato' });
    } catch (err) {
      return res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  },

  // Docente: ottieni tutti gli studenti e i voti delle sue classi
  async getClassiConStudenti(req, res) {
    const userId = req.userId;
    const userType = req.userType;

    if (userType !== 'docente') return res.status(403).json({ message: 'Accesso negato' });

    try {
      const {
        docentiCollection,
        assegnazioniCollection,
        classiCollection,
        studentiCollection,
        votiCollection
      } = getCollections();

      const assegnazioni = await assegnazioniCollection.find({ id_docente: userId }).toArray();
      const classiIds = assegnazioni.map(a => a.id_classe);
      const classi = await classiCollection.find({ id_classe: { $in: classiIds } }).toArray();

      const classiResult = [];

      for (const classe of classi) {
        const studenti = await studentiCollection.find({ id_classe: classe.id_classe }).toArray();
        const studentiConVoti = [];

        for (const studente of studenti) {
          const voti = await votiCollection.find({
            id_studente: studente.id_studente,
            id_docente: userId
          }).toArray();

          studentiConVoti.push({
            studente,
            voti
          });
        }

        classiResult.push({
          id_classe: classe.id_classe,
          studenti: studentiConVoti
        });
      }

      return res.json({ classi: classiResult });
    } catch (err) {
      return res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  },

  async mediaStudente(req, res) {
    const userId = req.userId;
    const userType = req.userType;
    const { id_studente } = req.params;

    if (userType !== 'docente') return res.status(403).json({ message: 'Accesso negato' });

    try {
      const { votiCollection } = getCollections();

      const mediaAgg = await votiCollection.aggregate([
        {
          $match: {
            id_studente,
            id_docente: userId
          }
        },
        {
          $group: {
            _id: null,
            media: { $avg: "$voto" }
          }
        }
      ]).toArray();

      const media = mediaAgg[0]?.media?.toFixed(2) || "0.00";

      res.json({ id_studente, media });
    } catch (err) {
      res.status(500).json({ message: 'Errore nel calcolo della media', error: err.message });
    }
  },

  async inserisciVotoPerClasse(req, res) {
    const userId = req.userId;
    const userType = req.userType;
    const { id_classe, materia, voto } = req.body;

    if (userType !== 'docente') return res.status(403).json({ message: 'Accesso negato' });

    if (!id_classe || !materia || typeof voto !== 'number') {
      return res.status(400).json({ message: 'Dati incompleti o errati' });
    }

    try {
      const { studentiCollection, votiCollection } = getCollections();

      const studenti = await studentiCollection.find({ id_classe }).toArray();

      const operazioni = studenti.map(studente => ({
        id_voto: `VOT${Date.now()}${Math.floor(Math.random() * 1000)}`,
        id_studente: studente.id_studente,
        id_docente: userId,
        materia,
        voto: Number(voto)
      }));

      await votiCollection.insertMany(operazioni);

      res.json({ message: 'Voti inseriti per tutta la classe', inseriti: operazioni.length });
    } catch (err) {
      res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  },

  async getMaterieDocente(req, res) {
    const userId = req.userId;
    const userType = req.userType;

    if (userType !== 'docente') return res.status(403).json({ message: 'Accesso negato' });

    try {
      const { assegnazioniCollection } = getCollections();
      const assegnazioni = await assegnazioniCollection.find({ id_docente: userId }).toArray();
      const materie = [...new Set(assegnazioni.map(a => a.materia))];

      return res.json({ materie });
    } catch (err) {
      return res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  },

  async inserisciVotiTuttaClasse(req, res) {
    const userId = req.userId;
    const userType = req.userType;
    const { id_classe, materia, voti } = req.body;

    if (userType !== 'docente') return res.status(403).json({ message: 'Accesso negato' });
    if (!id_classe || !materia || !Array.isArray(voti)) {
      return res.status(400).json({ message: 'Dati incompleti o errati' });
    }

    try {
      const { votiCollection } = getCollections();
      const votiDaInserire = voti.map(v => ({
        id_voto: `VOT${Date.now()}${Math.floor(Math.random() * 1000)}`,
        id_docente: userId,
        id_studente: v.id_studente,
        materia: v.materia || materia, // fallback
        voto: Number(v.voto),
        data: new Date()
      }));

      if (votiDaInserire.length === 0) {
        return res.status(400).json({ message: 'Nessun voto valido da inserire' });
      }

      await votiCollection.insertMany(votiDaInserire);
      return res.status(201).json({ message: 'Voti inseriti correttamente' });
    } catch (err) {
      return res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  },

  async getVotiStudentePerDocente(req, res) {
    const userId = req.userId;
    const userType = req.userType;
    const { id_studente } = req.params;

    if (userType !== 'docente') return res.status(403).json({ message: 'Accesso negato' });

    try {
      const { studentiCollection, votiCollection } = getCollections();

      const studente = await studentiCollection.findOne({ id_studente });
      if (!studente) return res.status(404).json({ message: 'Studente non trovato' });

      const voti = await votiCollection.find({
        id_studente,
        id_docente: userId
      }).toArray();

      return res.json({ studente, voti });
    } catch (err) {
      return res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  }




};
