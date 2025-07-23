/**
 * ROUTE REGISTRO ELETTRONICO
 * 
 * Definisco tutte le route per il registro elettronico.
 * Le route sono protette dal middleware di autenticazione e sono divise per tipo utente:
 * - Route per studenti (solo lettura)
 * - Route per docenti (lettura e scrittura)
 * 
 * @author Antonio Di Giorgio
 */

const express = require('express');
const router = express.Router();
const ControllerRegistro = require('../controllers/RegistroController');
const middlewareAutenticazione = require('../middleware/authMiddleware');

// ===========================
// ROUTE STUDENTI (SOLO LETTURA)
// ===========================

/**
 * Tutte le route per studenti richiedono autenticazione
 * e permettono solo operazioni di lettura sui propri dati
 */

/**
 * GET /api/registro/studente/info
 * 
 * Recupero le informazioni personali dello studente autenticato.
 */
router.get('/studente/info', middlewareAutenticazione, ControllerRegistro.ottieniInfoStudente);

/**
 * GET /api/registro/studente/voti
 * 
 * Recupero tutti i voti dello studente autenticato.
 */
router.get('/studente/voti', middlewareAutenticazione, ControllerRegistro.ottieniVotiStudente);

/**
 * GET /api/registro/studente/media-per-materia
 * 
 * Calcolo la media dei voti per ogni materia dello studente.
 */
router.get('/studente/media-per-materia', middlewareAutenticazione, ControllerRegistro.calcolaMediaPerMateriaStudente);

/**
 * GET /api/registro/studente/distribuzione-voti
 * 
 * Ottengo la distribuzione dei voti dello studente.
 */
router.get('/studente/distribuzione-voti', middlewareAutenticazione, ControllerRegistro.ottieniDistribuzioneVotiStudente);

/**
 * GET /api/registro/studente/voti-filtrati
 * 
 * Recupero i voti dello studente filtrati per intervallo di date.
 * Richiede parametri query: startDate, endDate
 */
router.get('/studente/voti-filtrati', middlewareAutenticazione, ControllerRegistro.ottieniVotiStudenteFiltriPerData);

/**
 * GET /api/registro/studente/voti-materia/:materia
 * 
 * Recupero i voti dello studente per una specifica materia.
 */
router.get('/studente/voti-materia/:materia', middlewareAutenticazione, ControllerRegistro.ottieniVotiStudentePerMateria);

/**
 * GET /api/registro/studente/media-generale
 * 
 * Calcolo la media generale dello studente su tutti i voti.
 */
router.get('/studente/media-generale', middlewareAutenticazione, ControllerRegistro.calcolaMediaGeneraleStudente);

// ===========================
// ROUTE DOCENTI (LETTURA E SCRITTURA)
// ===========================

/**
 * Le route per docenti permettono la gestione completa dei voti
 * per gli studenti delle classi assegnate
 */

/**
 * GET /api/registro/docente/info
 * 
 * Recupero le informazioni del docente autenticato.
 */
router.get('/docente/info', middlewareAutenticazione, ControllerRegistro.ottieniInfoDocente);

/**
 * GET /api/registro/docente/classi
 * 
 * Recupero tutte le classi assegnate al docente con studenti e voti.
 */
router.get('/docente/classi', middlewareAutenticazione, ControllerRegistro.ottieniClassiDocente);

/**
 * GET /api/registro/docente/materie
 * 
 * Recupero le materie insegnate dal docente.
 */
router.get('/docente/materie', middlewareAutenticazione, ControllerRegistro.ottieniMaterieDocente);

/**
 * GET /api/registro/docente/classi-complete
 * 
 * Versione ottimizzata per recuperare classi con studenti.
 */
router.get('/docente/classi-complete', middlewareAutenticazione, ControllerRegistro.ottieniClassiConStudenti);

/**
 * GET /api/registro/docente/studente/:id_studente/media
 * 
 * Calcolo la media di uno studente per i voti inseriti dal docente.
 */
router.get('/docente/studente/:id_studente/media', middlewareAutenticazione, ControllerRegistro.calcolaMediaStudente);

/**
 * GET /api/registro/docente/studente/:id_studente/voti
 * 
 * Recupero i voti di uno studente inseriti dal docente.
 */
router.get('/docente/studente/:id_studente/voti', middlewareAutenticazione, ControllerRegistro.ottieniVotiStudentePerDocente);

/**
 * GET /api/registro/docente/studente/:id_studente/voti-filtro
 * 
 * Recupero i voti di uno studente con filtro per date.
 * Richiede parametri query: startDate, endDate
 */
router.get('/docente/studente/:id_studente/voti-filtro', middlewareAutenticazione, ControllerRegistro.ottieniVotiStudentePerDocenteConFiltro);

/**
 * GET /api/registro/docente/classe/:id_classe/materia/:materia/media
 * 
 * Calcolo la media di una classe per una specifica materia.
 */
router.get('/docente/classe/:id_classe/materia/:materia/media', middlewareAutenticazione, ControllerRegistro.calcolaMediaClassePerMateria);

// ===========================
// OPERAZIONI DI SCRITTURA
// ===========================

/**
 * POST /api/registro/docente/voto
 * 
 * Inserimento di un nuovo voto per uno studente.
 * Body richiesto: { id_studente, materia, voto, data, tipo }
 */
router.post('/docente/voto', middlewareAutenticazione, ControllerRegistro.inserisciVoto);

/**
 * PUT /api/registro/docente/voto
 * 
 * Modifica di un voto esistente.
 * Body richiesto: { id_voto, voto, tipologia? }
 */
router.put('/docente/voto', middlewareAutenticazione, ControllerRegistro.modificaVoto);

/**
 * DELETE /api/registro/docente/voto
 * 
 * Eliminazione di un voto esistente.
 * Body richiesto: { id_voto }
 */
router.delete('/docente/voto', middlewareAutenticazione, ControllerRegistro.eliminaVoto);

/**
 * POST /api/registro/docente/classe/voti
 * 
 * Inserimento voti per tutti gli studenti di una classe.
 * Body richiesto: { id_classe, materia, tipo, voti: [{id_studente, voto}] }
 */
router.post('/docente/classe/voti', middlewareAutenticazione, ControllerRegistro.inserisciVotiInserisciVotiClasse);

// ===========================
// EXPORT DEL ROUTER
// ===========================

module.exports = router;