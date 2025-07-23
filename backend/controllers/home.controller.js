/**
 * CONTROLLER HOMEPAGE
 * 
 * Gestisco le richieste relative alla homepage dell'applicazione.
 * Questo controller fornisce le statistiche generali del sistema scolastico.
 * 
 * @author Antonio Di Giorgio
 */

const { ottieniCollezioni } = require('../db/connection');

// ===========================
// ENDPOINT STATISTICHE HOME
// ===========================

/**
 * Recupero le statistiche generali da mostrare nella homepage.
 * 
 * Calcolo il numero totale di:
 * - Scuole registrate nel sistema
 * - Docenti attivi
 * - Classi presenti
 * 
 * @async
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 */
async function ottieniStatisticheHomepage(req, res) {
  try {
    // Log per debugging
    console.log("🟡 Tentativo accesso alle collection");
    
    // ===========================
    // RECUPERO COLLEZIONI
    // ===========================
    
    // Ottengo i riferimenti alle collezioni necessarie
    const {
      collezioneAnagrafica,
      collezioneDocenti,
      collezioneClassi
    } = ottieniCollezioni();

    console.log("🟢 Collection ottenute con successo");

    // ===========================
    // CALCOLO STATISTICHE
    // ===========================
    
    /**
     * Eseguo le query in parallelo per ottimizzare le performance.
     * Utilizzo Promise.all per attendere il completamento di tutte le operazioni.
     */
    const [numeroScuole, numeroDocenti, numeroClassi] = await Promise.all([
      // Conto il numero totale di scuole nell'anagrafica
      collezioneAnagrafica.countDocuments(),
      
      // Conto il numero totale di docenti
      collezioneDocenti.countDocuments(),
      
      // Conto il numero totale di classi
      collezioneClassi.countDocuments()
    ]);

    // Log delle statistiche calcolate
    console.log("🔵 Statistiche pronte:", { 
      numeroScuole, 
      numeroDocenti, 
      numeroClassi 
    });

    // ===========================
    // INVIO RISPOSTA
    // ===========================
    
    // Restituisco le statistiche in formato JSON
    res.json({
      scuole: numeroScuole,
      docenti: numeroDocenti,
      classi: numeroClassi
    });
    
  } catch (errore) {
    // ===========================
    // GESTIONE ERRORI
    // ===========================
    
    console.error("❌ Errore dettagliato:", errore);
    
    // Invio una risposta di errore al client
    res.status(500).json({ 
      errore: errore.message 
    });
  }
}

// ===========================
// EXPORT DEL MODULO
// ===========================

module.exports = { 
  ottieniStatisticheHomepage 
};