const express = require('express');
const router = express.Router();
const StatisticheController = require('../controllers/statistiche.controller');

// Tutte le statistiche generali in un'unica chiamata
router.get('/generali', StatisticheController.getStatisticheGenerali);

// Statistiche separate (in alternativa o aggiunta)
router.get('/studenti/italiani-vs-stranieri', StatisticheController.getDistribuzioneStudentiPerCittadinanza);
router.get('/voti/numero-per-materia', StatisticheController.getNumeroVotiPerMateria);
router.get('/voti/media-per-materia', StatisticheController.getMediaVotiPerMateria);
router.get('/classi/numero-per-annocorso', StatisticheController.getNumeroClassiPerAnnoCorso);
router.get('/studenti/numero-per-annocorso', StatisticheController.getNumeroStudentiPerAnnoCorso);
router.get('/voti/distribuzione', StatisticheController.getDistribuzioneVoti);

module.exports = router;
