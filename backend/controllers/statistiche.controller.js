// controllers/statistiche.controller.js

const { getCollections } = require('../db/connection');

// Calcola statistiche generali
async function getStatisticheGenerali(req, res) {
  try {
    const {
      studentiCollection,
      docentiCollection,
      classiCollection,
      votiCollection,
      anagraficaCollection,
    } = getCollections();

    const totaleStudenti = await studentiCollection.countDocuments();
    const totaleDocenti = await docentiCollection.countDocuments();
    const totaleClassi = await classiCollection.countDocuments();
    const totaleVoti = await votiCollection.countDocuments();

    const mediaAgg = await votiCollection.aggregate([
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
    console.error("❌ Errore nel calcolo delle statistiche:", err);
    res.status(500).json({ error: "Errore interno del server." });
  }
}

module.exports = {
  getStatisticheGenerali
};
