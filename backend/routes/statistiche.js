const express = require('express');
const router = express.Router();
const StatisticheController = require('../controllers/statistiche.controller');

// Tutte le statistiche generali in un'unica chiamata (ora con filtri)
router.get('/generali', StatisticheController.getStatisticheGenerali);

// Statistiche esistenti (ora accettano filtri via query params)
router.get('/studenti/italiani-vs-stranieri', StatisticheController.getDistribuzioneStudentiPerCittadinanza);
router.get('/voti/numero-per-materia', StatisticheController.getNumeroVotiPerMateria);
router.get('/voti/media-per-materia', StatisticheController.getMediaVotiPerMateria);
router.get('/classi/numero-per-annocorso', StatisticheController.getNumeroClassiPerAnnoCorso);
router.get('/studenti/numero-per-annocorso', StatisticheController.getNumeroStudentiPerAnnoCorso);
router.get('/voti/distribuzione', StatisticheController.getDistribuzioneVoti);

// Nuove route per confronti geografici e analisi avanzate
router.get('/confronti/area-geografica', StatisticheController.getConfrontoPerAreaGeografica);
router.get('/confronti/regione', StatisticheController.getConfrontoPerRegione);
router.get('/confronti/indirizzo', StatisticheController.getConfrontoPerIndirizzo);

// Route per ottenere le opzioni disponibili per i filtri
router.get('/filtri/opzioni', StatisticheController.getOpzioniFiltri);

// Route per trend temporale (confronto quadrimestri)
router.get('/trend/temporale', StatisticheController.getTrendTemporale);

// Route per analisi outlier
router.get('/analisi/outlier', StatisticheController.getClassiOutlier);

module.exports = router;