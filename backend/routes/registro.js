const express = require('express');
const router = express.Router();
const RegistroController = require('../controllers/RegistroController');
const authMiddleware = require('../middleware/authMiddleware');

// ==== STUDENTE ====

router.get('/studente/info', authMiddleware, RegistroController.getInfoStudente);
router.get('/studente/voti', authMiddleware, RegistroController.getVotiStudente);
router.get('/studente/media-per-materia', authMiddleware, RegistroController.getMediaPerMateriaStudente);
router.get('/studente/distribuzione-voti', authMiddleware, RegistroController.getDistribuzioneVotiStudente);
router.get('/studente/voti-filtrati', authMiddleware, RegistroController.getVotiStudenteFiltratiPerData);
router.get('/studente/voti-materia/:materia', authMiddleware, RegistroController.getVotiStudentePerMateria);
router.get('/studente/media-generale', authMiddleware, RegistroController.getMediaGeneraleStudente);

// ==== DOCENTE ====

router.get('/docente/info', authMiddleware, RegistroController.getInfoDocente);
router.get('/docente/classi', authMiddleware, RegistroController.getClassiDocente);
router.get('/docente/materie', authMiddleware, RegistroController.getMaterieDocente);
router.get('/docente/classi-complete', authMiddleware, RegistroController.getClassiConStudenti);
router.get('/docente/studente/:id_studente/media', authMiddleware, RegistroController.mediaStudente);
router.get('/docente/studente/:id_studente/voti', authMiddleware, RegistroController.getVotiStudentePerDocente);
router.get('/docente/studente/:id_studente/voti-filtro', authMiddleware, RegistroController.getVotiStudentePerDocenteConFiltro);
router.get('/docente/classe/:id_classe/materia/:materia/media', authMiddleware, RegistroController.getMediaClassePerMateria);

router.post('/docente/voto', authMiddleware, RegistroController.inserisciVoto);
router.put('/docente/voto', authMiddleware, RegistroController.modificaVoto);
router.delete('/docente/voto', authMiddleware, RegistroController.eliminaVoto);
router.post('/docente/classe/voto', authMiddleware, RegistroController.inserisciVotoPerClasse);
router.post('/docente/classe/voti', authMiddleware, RegistroController.inserisciVotiTuttaClasse);

module.exports = router;
