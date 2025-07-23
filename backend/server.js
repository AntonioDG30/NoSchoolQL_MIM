/**
 * SERVER EXPRESS - PUNTO DI INGRESSO DELL'APPLICAZIONE
 * 
 * Configuro e avvio il server Express per l'API di NoSchoolQL.
 * Questo file gestisce:
 * - Configurazione middleware
 * - Connessione al database
 * - Registrazione delle route
 * - Avvio del server
 * 
 * @author Antonio Di Giorgio
 */

// ===========================
// IMPORT DIPENDENZE
// ===========================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connettiAlDatabase } = require('./db/connection');

// ===========================
// CONFIGURAZIONE AMBIENTE
// ===========================

// Carico le variabili d'ambiente dal file .env
dotenv.config();

// ===========================
// INIZIALIZZAZIONE EXPRESS
// ===========================

// Creo l'istanza dell'applicazione Express
const app = express();

// Definisco la porta del server (default: 3000)
const PORTA = process.env.PORT || 3000;

// ===========================
// CONFIGURAZIONE MIDDLEWARE
// ===========================

/**
 * Configuro CORS per permettere richieste cross-origin.
 * In produzione, specificare origini specifiche per maggiore sicurezza.
 */
app.use(cors());

/**
 * Configuro Express per parsare automaticamente il JSON
 * nel body delle richieste.
 */
app.use(express.json());

// ===========================
// ROUTE DI BASE
// ===========================

/**
 * GET /
 * 
 * Route di base per verificare che il server sia attivo.
 */
app.get('/', (req, res) => {
  res.send('🎓 NoSchoolQL API attiva.');
});

// ===========================
// IMPORT ROUTE
// ===========================

// Importo i moduli delle route
const routeStatistiche = require('./routes/statistiche');
const routeRegistro = require('./routes/registro');
const routeHome = require('./routes/home'); 

// ===========================
// REGISTRAZIONE ROUTE
// ===========================

/**
 * Registro le route con i rispettivi prefissi.
 * Questo organizza l'API in moduli logici separati.
 */

// Route per le statistiche avanzate
app.use('/api/statistiche', routeStatistiche);

// Route per il registro elettronico
app.use('/api/registro', routeRegistro);

// Route per la homepage
app.use('/api/home', routeHome); 

// ===========================
// AVVIO SERVER
// ===========================

/**
 * Avvio il server solo dopo aver stabilito la connessione al database.
 * Questo garantisce che tutte le risorse siano pronte prima di accettare richieste.
 */
connettiAlDatabase()
  .then(() => {
    // Avvio il server sulla porta configurata
    app.listen(PORTA, () => {
      console.log(`🚀 Server avviato su http://localhost:${PORTA}`);
    });
  })
  .catch((errore) => {
    // In caso di errore, loggo e termino l'applicazione
    console.error('❌ Errore durante l\'avvio del server:', errore);
    process.exit(1);
  });