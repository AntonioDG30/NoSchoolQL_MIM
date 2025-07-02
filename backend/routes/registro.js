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


module.exports = router;
