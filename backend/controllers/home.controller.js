const { getCollections } = require('../db/connection');

async function getHomepageStats(req, res) {
  try {
    console.log("🟡 Tentativo accesso alle collection");
    const {
      anagraficaCollection,
      docentiCollection,
      classiCollection
    } = getCollections();

    console.log("🟢 Collection ottenute con successo");

    const [numeroScuole, numeroDocenti, numeroClassi] = await Promise.all([
      anagraficaCollection.countDocuments(),
      docentiCollection.countDocuments(),
      classiCollection.countDocuments()
    ]);

    console.log("🔵 Statistiche pronte:", { numeroScuole, numeroDocenti, numeroClassi });

    res.json({
      scuole: numeroScuole,
      docenti: numeroDocenti,
      classi: numeroClassi
    });
  } catch (error) {
    console.error("❌ Errore dettagliato:", error);
    res.status(500).json({ error: error.message });
  }
}


module.exports = { getHomepageStats };

