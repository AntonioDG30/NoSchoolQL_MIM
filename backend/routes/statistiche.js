/**
 * ROUTE STATISTICHE
 * 
 * Definisco tutte le route per gli endpoint delle statistiche avanzate.
 * Questi endpoint sono pubblici e forniscono analisi dettagliate sui dati scolastici.
 * 
 * Le route sono organizzate per categoria:
 * - Statistiche generali
 * - Analisi studenti
 * - Analisi voti
 * - Analisi classi
 * - Confronti geografici
 * - Analisi temporali
 * 
 * @author Antonio Di Giorgio
 */

const express = require('express');
const router = express.Router();
const ControllerStatistiche = require('../controllers/statistiche.controller');


// ===========================
// STATISTICHE GENERALI
// ===========================

/**
 * GET /api/statistiche/generali
 * 
 * Recupero le statistiche generali del sistema con possibilità di filtri.
 * Supporta filtri geografici, temporali e demografici tramite query string.
 */
router.get('/generali', ControllerStatistiche.calcolaStatisticheGenerali);

// ===========================
// ANALISI STUDENTI
// ===========================

/**
 * GET /api/statistiche/studenti/italiani-vs-stranieri
 * 
 * Analisi della distribuzione degli studenti per cittadinanza.
 * Restituisce numeri assoluti e percentuali.
 */
router.get('/studenti/italiani-vs-stranieri', ControllerStatistiche.calcolaDistribuzioneStudentiPerCittadinanza);

/**
 * GET /api/statistiche/studenti/numero-per-annocorso
 * 
 * Distribuzione degli studenti per anno di corso (1-5).
 */
router.get('/studenti/numero-per-annocorso', ControllerStatistiche.calcolaNumeroStudentiPerAnnoCorso);

// ===========================
// ANALISI VOTI
// ===========================

/**
 * GET /api/statistiche/voti/numero-per-materia
 * 
 * Numero totale di voti registrati per ogni materia.
 * Utile per capire quali materie hanno più valutazioni.
 */
router.get('/voti/numero-per-materia', ControllerStatistiche.calcolaNumeroVotiPerMateria);

/**
 * GET /api/statistiche/voti/media-per-materia
 * 
 * Media dei voti per ogni materia.
 * Permette di identificare le materie più difficili/facili.
 */
router.get('/voti/media-per-materia', ControllerStatistiche.calcolaMediaVotiPerMateria);

/**
 * GET /api/statistiche/voti/distribuzione
 * 
 * Distribuzione dei voti (quanti voti per ogni valutazione da 0 a 10).
 * Utile per analizzare la curva di valutazione.
 */
router.get('/voti/distribuzione', ControllerStatistiche.calcolaDistribuzioneVoti);

// ===========================
// ANALISI CLASSI
// ===========================

/**
 * GET /api/statistiche/classi/numero-per-annocorso
 * 
 * Numero di classi per ogni anno di corso.
 */
router.get('/classi/numero-per-annocorso', ControllerStatistiche.calcolaNumeroClassiPerAnnoCorso);

// ===========================
// CONFRONTI GEOGRAFICI
// ===========================

/**
 * GET /api/statistiche/confronti/area-geografica
 * 
 * Confronto delle performance tra le diverse aree geografiche italiane.
 * (Nord Est, Nord Ovest, Centro, Sud, Isole)
 */
router.get('/confronti/area-geografica', ControllerStatistiche.confrontaPerAreaGeografica);

/**
 * GET /api/statistiche/confronti/regione
 * 
 * Confronto delle performance tra le diverse regioni italiane.
 * Ordinato per media voti decrescente.
 */
router.get('/confronti/regione', ControllerStatistiche.confrontaPerRegione);

/**
 * GET /api/statistiche/confronti/indirizzo
 * 
 * Confronto delle performance tra i diversi indirizzi di studio.
 * (Licei, Tecnici, Professionali, ecc.)
 */
router.get('/confronti/indirizzo', ControllerStatistiche.confrontaPerIndirizzo);

// ===========================
// UTILITY E FILTRI
// ===========================

/**
 * GET /api/statistiche/filtri/opzioni
 * 
 * Recupero tutte le opzioni disponibili per i filtri.
 * Utilizzato per popolare i menu a tendina nell'interfaccia.
 */
router.get('/filtri/opzioni', ControllerStatistiche.ottieniOpzioniFiltri);

// ===========================
// ANALISI TEMPORALI
// ===========================

/**
 * GET /api/statistiche/trend/temporale
 * 
 * Analisi del trend temporale confrontando i due quadrimestri.
 * Utile per vedere l'andamento nel corso dell'anno.
 */
router.get('/trend/temporale', ControllerStatistiche.analizzaTrendTemporale);

/**
 * GET /api/statistiche/analisi/outlier
 * 
 * Identificazione delle classi con performance anomale (outlier).
 * Trova classi che si discostano significativamente dalla media.
 */
router.get('/analisi/outlier', ControllerStatistiche.identificaClassiOutlier);


router.get('/top-studenti', ControllerStatistiche.getTopStudenti);


// ===========================
// EXPORT DEL ROUTER
// ===========================

module.exports = router;