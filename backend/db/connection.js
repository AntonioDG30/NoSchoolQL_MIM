/**
 * MODULO DI CONNESSIONE AL DATABASE MONGODB
 * 
 * Gestisco la connessione centralizzata a MongoDB per l'intera applicazione.
 * Questo modulo garantisce che venga creata una sola connessione al database
 * e fornisce accesso alle collezioni necessarie per il sistema scolastico.
 * 
 * @author Antonio Di Giorgio
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

// ===========================
// CONFIGURAZIONE CONNESSIONE
// ===========================

// Recupero l'URI di connessione dalle variabili d'ambiente
const uriConnessione = process.env.MONGODB_URI;

// Verifico che l'URI sia presente, altrimenti termino l'applicazione
if (!uriConnessione) {
  console.error('❌ URI MongoDB mancante nel file .env');
  process.exit(1);
}

// Creo il client MongoDB con le opzioni di connessione
const clientMongoDB = new MongoClient(uriConnessione, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ===========================
// VARIABILI DI STATO
// ===========================

// Mantengo il riferimento al database
let database;

// Oggetto che conterrà tutti i riferimenti alle collezioni
let collezioniDatabase = {};

// ===========================
// FUNZIONE DI CONNESSIONE
// ===========================

/**
 * Stabilisco la connessione al database MongoDB.
 * Questa funzione viene chiamata una sola volta all'avvio del server.
 * 
 * Se la connessione è già attiva, non faccio nulla per evitare
 * connessioni multiple.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function connettiAlDatabase() {
  // Se il database è già connesso, esco dalla funzione
  if (!database) {
    try {
      // Tento la connessione al server MongoDB
      await clientMongoDB.connect();
      
      // Seleziono il database da utilizzare (default: 'NoSchoolQL')
      database = clientMongoDB.db(process.env.DB_NAME || 'NoSchoolQL');
      
      console.log('✅ Connessione a MongoDB riuscita');

      // ===========================
      // INIZIALIZZAZIONE COLLEZIONI
      // ===========================
      
      /**
       * Creo i riferimenti a tutte le collezioni del database.
       * Questo approccio centralizzato mi permette di:
       * - Avere un unico punto di accesso alle collezioni
       * - Gestire facilmente eventuali cambi di nome
       * - Applicare configurazioni comuni a tutte le collezioni
       */
      collezioniDatabase = {
        // Collezione per i dati anagrafici delle scuole
        collezioneAnagrafica: database.collection('anagrafica'),
        
        // Collezione per i dati degli studenti
        collezioneStudenti: database.collection('studenti'),
        
        // Collezione per i dati dei docenti
        collezioneDocenti: database.collection('docenti'),
        
        // Collezione per le informazioni sulle classi
        collezioneClassi: database.collection('classi'),
        
        // Collezione per i voti degli studenti
        collezioneVoti: database.collection('voti'),
        
        // Collezione per le assegnazioni dei docenti alle classi
        collezioneAssegnazioni: database.collection('assegnazioni_docenti')
      };

    } catch (errore) {
      // In caso di errore, loggo e termino l'applicazione
      console.error('❌ Errore durante la connessione:', errore);
      process.exit(1);
    }
  }
}

// ===========================
// FUNZIONE DI ACCESSO
// ===========================

/**
 * Restituisco l'oggetto con tutti i riferimenti alle collezioni.
 * Questa funzione viene utilizzata dai controller per accedere ai dati.
 * 
 * NOTA: È importante che la connessione sia già stata stabilita
 * prima di chiamare questa funzione.
 * 
 * @returns {Object} Oggetto contenente i riferimenti alle collezioni
 */
function ottieniCollezioni() {
  return collezioniDatabase;
}

// ===========================
// EXPORT DEL MODULO
// ===========================

module.exports = {
  connettiAlDatabase,
  ottieniCollezioni
};