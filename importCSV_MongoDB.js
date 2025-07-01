// importa_in_mongodb.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'NoSchoolQL';
const DATASET_DIR = path.join(__dirname, 'file/dataset_simulati');

const COLLECTIONS = {
  studenti: 'studenti.csv',
  classi: 'classi.csv',
  docenti: 'docenti.csv',
  assegnazioni_docenti: 'assegnazioni_docenti.csv',
  voti: 'voti.csv'
};

async function importCSVToMongo(client, collectionName, csvFilePath) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', async () => {
        try {
          const db = client.db(DB_NAME);
          const collection = db.collection(collectionName);
          await collection.deleteMany({});
          await collection.insertMany(data);
          console.log(`✅ ${collectionName} importata con ${data.length} documenti.`);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
}

async function creaIndici(client) {
  const db = client.db(DB_NAME);

  await db.collection('studenti').createIndex({ id_studente: 1 }, { unique: true });
  await db.collection('studenti').createIndex({ id_classe: 1 });

  await db.collection('classi').createIndex({ id_classe: 1 }, { unique: true });
  await db.collection('classi').createIndex({ codicescuola: 1 });
  await db.collection('classi').createIndex({ indirizzo: 1 });
  await db.collection('classi').createIndex({ annocorso: 1 });

  await db.collection('docenti').createIndex({ id_docente: 1 }, { unique: true });
  await db.collection('docenti').createIndex({ codicescuola: 1 });

  await db.collection('assegnazioni_docenti').createIndex({ id_docente: 1 });
  await db.collection('assegnazioni_docenti').createIndex({ id_classe: 1 });
  await db.collection('assegnazioni_docenti').createIndex({ materia: 1 });

  await db.collection('voti').createIndex({ id_voto: 1 }, { unique: true });
  await db.collection('voti').createIndex({ id_studente: 1 });
  await db.collection('voti').createIndex({ id_docente: 1 });
  await db.collection('voti').createIndex({ materia: 1 });

  console.log('✅ Indici creati con successo.');
}

async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('🔌 Connessione a MongoDB riuscita.');

    for (const [collectionName, csvFile] of Object.entries(COLLECTIONS)) {
      const filePath = path.join(DATASET_DIR, csvFile);
      await importCSVToMongo(client, collectionName, filePath);
    }

    await creaIndici(client);
  } catch (err) {
    console.error('❌ Errore:', err);
  } finally {
    await client.close();
    console.log('🔒 Connessione a MongoDB chiusa.');
  }
}

main();
