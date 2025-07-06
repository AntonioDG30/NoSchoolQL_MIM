const { getCollections } = require('../db/connection');

// Statistiche generali
async function getStatisticheGenerali(req, res) {
  try {
    const {
      studentiCollection,
      docentiCollection,
      classiCollection,
      votiCollection
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
    console.error("❌ Errore nel calcolo delle statistiche generali:", err);
    res.status(500).json({ error: "Errore interno del server." });
  }
}

// Percentuale studenti italiani vs stranieri
async function getDistribuzioneStudentiPerCittadinanza(req, res) {
  try {
    const { studentiCollection } = getCollections();
    const totale = await studentiCollection.countDocuments();
    const italiani = await studentiCollection.countDocuments({ cittadinanza: "Italiana" });
    const stranieri = totale - italiani;

    res.json({
      italiani,
      stranieri,
      percentuali: {
        italiani: ((italiani / totale) * 100).toFixed(2),
        stranieri: ((stranieri / totale) * 100).toFixed(2)
      }
    });
  } catch (err) {
    console.error("❌ Errore distribuzione cittadinanza:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

// Numero voti per materia
async function getNumeroVotiPerMateria(req, res) {
  try {
    const { votiCollection } = getCollections();
    const result = await votiCollection.aggregate([
      { $group: { _id: "$materia", numero_voti: { $sum: 1 } } },
      { $project: { materia: "$_id", numero_voti: 1, _id: 0 } },
      { $sort: { numero_voti: -1 } }
    ]).toArray();
    res.json(result);
  } catch (err) {
    console.error("❌ Errore voti per materia:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

// Media voti per materia
async function getMediaVotiPerMateria(req, res) {
  try {
    const { votiCollection } = getCollections();
    const result = await votiCollection.aggregate([
      { $group: { _id: "$materia", media: { $avg: "$voto" } } },
      { $project: { materia: "$_id", media: { $round: ["$media", 2] }, _id: 0 } },
      { $sort: { materia: 1 } }
    ]).toArray();
    res.json(result);
  } catch (err) {
    console.error("❌ Errore media voti per materia:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

// Numero classi per anno di corso
async function getNumeroClassiPerAnnoCorso(req, res) {
  try {
    const { classiCollection } = getCollections();
    const result = await classiCollection.aggregate([
      { $group: { _id: "$anno_corso", numero_classi: { $sum: 1 } } },
      { $project: { annocorso: "$_id", numero_classi: 1, _id: 0 } },
      { $sort: { annocorso: 1 } }
    ]).toArray();
    res.json(result);
  } catch (err) {
    console.error("❌ Errore numero classi per anno:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

// Numero studenti per anno di corso
async function getNumeroStudentiPerAnnoCorso(req, res) {
  try {
    const { studentiCollection } = getCollections();
    const result = await studentiCollection.aggregate([
      { $group: { _id: "$anno_corso", numero_studenti: { $sum: 1 } } },
      { $project: { annocorso: "$_id", numero_studenti: 1, _id: 0 } },
      { $sort: { annocorso: 1 } }
    ]).toArray();
    res.json(result);
  } catch (err) {
    console.error("❌ Errore numero studenti per anno:", err);
    res.status(500).json({ error: "Errore interno." });
  }
}

// Distribuzione voti (istogramma 0-10)
async function getDistribuzioneVoti(req, res) {
  try {
    const { votiCollection } = getCollections();
    const bins = Array.from({ length: 11 }, (_, i) => i);
    const distribuzione = [];

    for (let voto = 0; voto <= 10; voto++) {
      const count = await votiCollection.countDocuments({ voto });
      distribuzione.push({ voto, count });
    }

    res.json(distribuzione);

  } catch (err) {
    console.error("❌ Errore distribuzione voti:", err);
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
  getDistribuzioneVoti
};
