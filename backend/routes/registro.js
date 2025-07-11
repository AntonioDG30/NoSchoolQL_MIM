const express = require('express');
const router = express.Router();
const RegistroController = require('../controllers/RegistroController');
const authMiddleware = require('../middleware/authMiddleware');

// Studente: recupera i propri voti
router.get('/studente/voti', authMiddleware, RegistroController.getVotiStudente);

// Docente: recupera tutte le classi, studenti e voti che gestisce
router.get('/docente/classi', authMiddleware, RegistroController.getClassiDocente);

// Docente: inserisce un nuovo voto
router.post('/docente/voto', authMiddleware, RegistroController.inserisciVoto);

// Docente: modifica un voto esistente
router.put('/docente/voto', authMiddleware, RegistroController.modificaVoto);

// Docente: elimina un voto
router.delete('/docente/voto', authMiddleware, RegistroController.eliminaVoto);

router.get('/docente/classi-complete', authMiddleware, RegistroController.getClassiConStudenti);

// Calcolo media di uno studente
router.get('/docente/studente/:id_studente/media', authMiddleware, RegistroController.mediaStudente);

// Inserisci stesso voto per tutti gli studenti della classe
router.post('/docente/classe/voto', authMiddleware, RegistroController.inserisciVotoPerClasse);


router.get('/docente/materie', authMiddleware, RegistroController.getMaterieDocente);

router.post('/docente/classe/voti', authMiddleware, RegistroController.inserisciVotiTuttaClasse);

router.get('/docente/studente/:id_studente/voti', authMiddleware, RegistroController.getVotiStudentePerDocente);


module.exports = router;
