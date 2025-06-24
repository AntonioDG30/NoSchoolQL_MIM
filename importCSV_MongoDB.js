// importCSV_MongoDB.js
const fs = require('fs');                            // Modulo per leggere i file da disco
const path = require('path');                        // Modulo per lavorare con i percorsi in modo cross-platform
const csv = require('csv-parser');                   // Libreria per leggere CSV riga per riga
const { MongoClient } = require('mongodb');          // Importo MongoClient per connettermi a MongoDB

// -------------------------
// CONFIGURAZIONE
// -------------------------
const uri = 'mongodb://localhost:27017';             // URI per la connessione a MongoDB locale
const dbName = 'NoSchoolQL';                         // Nome del database da usare
const datasetDir = path.join(__dirname, 'file', 'dataset_definitivi');  // Percorso dei CSV da importare

// Mappa dei file da importare: nome file → nome collezione MongoDB
const filesMap = {
  'anagrafica_scuole_pulita.csv': 'scuole',
  'studenti.csv': 'studenti',
  'classi.csv': 'classi',
  'percorsi.csv': 'percorsi',
  'docenti.csv': 'docenti',
  'assegnazioni_docenti.csv': 'assegnazioni_docenti',
  'voti.csv': 'voti'
};

// -------------------------
// FUNZIONE IMPORT CSV NORMALE
// -------------------------
async function importaCSVStandard(filePath, collection, db) {
  return new Promise((resolve, reject) => {
    const records = [];                                         // Array dove accumulo tutte le righe del CSV
    fs.createReadStream(filePath)                               // Apro lo stream di lettura del file
      .pipe(csv())                                              // Passo il contenuto al parser CSV
      .on('data', (row) => records.push(row))                  // Aggiungo ogni riga letta all’array
      .on('end', async () => {                                 // Quando ho finito di leggere
        try {
          await db.collection(collection).insertMany(records); // Inserisco tutte le righe nella collezione
          console.log(`✅ ${path.basename(filePath)} importato nella collezione '${collection}'`);
          resolve();                                            // Risolvo la Promise
        } catch (err) {
          console.error(`❌ Errore durante import di ${filePath}:`, err);  // In caso di errore lo mostro
          reject(err);
        }
      })
      .on('error', reject);                                     // Gestisco errori dello stream
  });
}

// -------------------------
// FUNZIONE IMPORT CSV CON BATCH (solo per voti.csv)
// -------------------------
async function importaCSVaBlocchi(filePath, collection, db, batchSize = 100000) {
  return new Promise((resolve, reject) => {
    const batch = [];                      // Buffer temporaneo per i record da inserire a blocchi
    let count = 0;                         // Contatore totale dei record inseriti

    const stream = fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        batch.push(row);                   // Aggiungo la riga al batch
        if (batch.length >= batchSize) {   // Se raggiungo la dimensione del batch
          stream.pause();                  // Pauso lo stream per evitare overflow
          try {
            await db.collection(collection).insertMany(batch.splice(0));  // Inserisco il batch in MongoDB
            count += batchSize;
            console.log(`📦 Inseriti ${count} record in '${collection}' finora...`);
            stream.resume();              // Riprendo la lettura
          } catch (err) {
            console.error(`❌ Errore durante batch insert:`, err);  // In caso di errore blocco tutto
            reject(err);
          }
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {           // Inserisco eventuali record rimasti
          await db.collection(collection).insertMany(batch);
          count += batch.length;
        }
        console.log(`✅ ${path.basename(filePath)} importato nella collezione '${collection}' (${count} record)`);
        resolve();
      })
      .on('error', reject);              // Gestione errori di parsing o lettura file
  });
}

// -------------------------
// FUNZIONE PRINCIPALE
// -------------------------
async function main() {
  const client = new MongoClient(uri);      // Creo il client MongoDB

  try {
    await client.connect();                 // Mi connetto al server MongoDB
    console.log('🌐 Connessione a MongoDB avvenuta con successo');
    const db = client.db(dbName);          // Seleziono il database

    // 1. PULIZIA DI TUTTE LE COLLEZIONI PRIMA DELL’IMPORT
    for (const collezione of Object.values(filesMap)) {
      await db.collection(collezione).deleteMany({});   // Svuoto ogni collezione prima di ricaricare i dati
      console.log(`🧹 Collezione '${collezione}' svuotata`);
    }

    // 2. IMPORTAZIONE DATI DA OGNI FILE CSV
    for (const [fileName, collectionName] of Object.entries(filesMap)) {
      const filePath = path.join(datasetDir, fileName);

      if (fileName === 'voti.csv') {
        await importaCSVaBlocchi(filePath, collectionName, db);  // Uso la versione a blocchi solo per voti.csv
      } else {
        await importaCSVStandard(filePath, collectionName, db);  // Altrimenti uso la versione normale
      }
    }

    console.log('✅ Tutti i file sono stati importati correttamente!');
  } catch (err) {
    console.error('❌ Errore generale nello script:', err);  // Errore globale se qualcosa fallisce
  } finally {
    await client.close();  // Chiudo la connessione in ogni caso
  }
}

main();  // Avvio lo script
// Per eseguire questo script, assicurati di avere MongoDB in esecuzione e i file CSV nella cartella corretta.
// Assicurati di avere le dipendenze installate: npm install csv-parser mongodb prima di eseguire lo script.
// Esegui con: node importCSV_MongoDB.js    