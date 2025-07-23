/**
 * ROUTE HOMEPAGE
 * 
 * Definisco le route per la homepage dell'applicazione.
 * Attualmente gestisco solo l'endpoint per le statistiche generali.
 * 
 * @author Antonio Di Giorgio
 */

const express = require('express');
const router = express.Router();
const ControllerHome = require('../controllers/home.controller');

// ===========================
// DEFINIZIONE ROUTE
// ===========================

/**
 * GET /api/home/stats
 * 
 * Endpoint pubblico per recuperare le statistiche generali del sistema.
 * Non richiede autenticazione.
 * 
 * Restituisce:
 * - Numero totale di scuole
 * - Numero totale di docenti
 * - Numero totale di classi
 */
router.get('/stats', ControllerHome.ottieniStatisticheHomepage);

// ===========================
// EXPORT DEL ROUTER
// ===========================

module.exports = router;