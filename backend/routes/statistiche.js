const express = require('express');
const router = express.Router();
const StatisticheController = require('../controllers/statistiche.controller');

router.get('/generali', StatisticheController.getStatisticheGenerali);
router.get('/studenti/italiani-vs-stranieri', StatisticheController.getDistribuzioneStudentiPerCittadinanza);
router.get('/voti/numero-per-materia', StatisticheController.getNumeroVotiPerMateria);
router.get('/voti/media-per-materia', StatisticheController.getMediaVotiPerMateria);
router.get('/classi/numero-per-annocorso', StatisticheController.getNumeroClassiPerAnnoCorso);
router.get('/studenti/numero-per-annocorso', StatisticheController.getNumeroStudentiPerAnnoCorso);
router.get('/voti/distribuzione', StatisticheController.getDistribuzioneVoti);
router.get('/confronti/area-geografica', StatisticheController.getConfrontoPerAreaGeografica);
router.get('/confronti/regione', StatisticheController.getConfrontoPerRegione);
router.get('/confronti/indirizzo', StatisticheController.getConfrontoPerIndirizzo);
router.get('/filtri/opzioni', StatisticheController.getOpzioniFiltri);
router.get('/trend/temporale', StatisticheController.getTrendTemporale);
router.get('/analisi/outlier', StatisticheController.getClassiOutlier);

module.exports = router;