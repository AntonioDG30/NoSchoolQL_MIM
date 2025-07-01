const express = require('express');
const router = express.Router();
const { getCollections } = require('../db/connection');

// Numero totale di studenti
router.get('/studenti/totale', async (req, res) => {
  try {
    const { studentiCollection } = getCollections();
    const count = await studentiCollection.countDocuments();
    res.json({ totale_studenti: count });
  } catch (error) {
    res.status(500).json({ errore: 'Errore nel calcolo degli studenti totali.' });
  }
});

// Numero totale di docenti
router.get('/docenti/totale', async (req, res) => {
  try {
    const { docentiCollection } = getCollections();
    const count = await docentiCollection.countDocuments();
    res.json({ totale_docenti: count });
  } catch (error) {
    res.status(500).json({ errore: 'Errore nel calcolo dei docenti totali.' });
  }
});

// Numero totale di classi
router.get('/classi/totale', async (req, res) => {
  try {
    const { classiCollection } = getCollections();
    const count = await classiCollection.countDocuments();
    res.json({ totale_classi: count });
  } catch (error) {
    res.status(500).json({ errore: 'Errore nel calcolo delle classi totali.' });
  }
});

// Numero totale di voti
router.get('/voti/totale', async (req, res) => {
  try {
    const { votiCollection } = getCollections();
    const count = await votiCollection.countDocuments();
    res.json({ totale_voti: count });
  } catch (error) {
    res.status(500).json({ errore: 'Errore nel calcolo dei voti totali.' });
  }
});

// Media globale dei voti
router.get('/voti/media', async (req, res) => {
  try {
    const { votiCollection } = getCollections();
    const result = await votiCollection.aggregate([
      { $group: { _id: null, media: { $avg: '$voto' } } }
    ]).toArray();

    const media = result[0]?.media || 0;
    res.json({ media_voti: parseFloat(media.toFixed(2)) });
  } catch (error) {
    res.status(500).json({ errore: 'Errore nel calcolo della media voti.' });
  }
});

module.exports = router;
