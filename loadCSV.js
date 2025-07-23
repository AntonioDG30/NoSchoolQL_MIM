const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'NoSchoolQL';
const DATASET_DIR = path.join(__dirname, 'file/dataset_definitivi');

const COLLECTIONS = {
  anagrafica: 'anagrafica.csv',
  studenti: 'studenti.csv',
  classi: 'classi.csv',
  docenti: 'docenti.csv',
  assegnazioni_docenti: 'assegnazioni_docenti.csv',
  voti: 'voti.csv'
};

const BATCH_SIZE = 5000;        
const LOG_EVERY = 100000;       
const PARSE_DATE_FIELDS = { voti: ['data'] };
const NUMERIC_FIELDS = {
  classi: ['annocorso','num_studenti','num_maschi','num_femmine','num_italiani','num_stranieri'],
  voti: ['voto']
};

function convertRow(row, collName) {
  (NUMERIC_FIELDS[collName] || []).forEach(f => {
    if (row[f] !== undefined && row[f] !== '') row[f] = Number(row[f]);
  });
  (PARSE_DATE_FIELDS[collName] || []).forEach(f => {
    if (row[f]) row[f] = new Date(row[f]);
  });
  return row;
}

async function importCollection(client, collName, fileName) {
  const filePath = path.join(DATASET_DIR, fileName);
  const db = client.db(DB_NAME);
  const collection = db.collection(collName);

  console.log(`➡️  Inizio import ${collName} da ${fileName}`);
  await collection.deleteMany({});

  return new Promise((resolve, reject) => {
    const buffer = [];
    let count = 0;
    let inserting = false;
    let streamEnded = false;

    const stream = fs.createReadStream(filePath)
      .pipe(csv({ separator: ',', skipLines: 0 }));

    async function flush() {
      if (buffer.length === 0) return;
      const docs = buffer.splice(0, buffer.length);
      inserting = true;
      try {
        await collection.insertMany(docs, { ordered: false });
        inserting = false;
        if (streamEnded && buffer.length === 0) {
          console.log(`✅ ${collName} importata (${count} doc).`);
          resolve();
        } else {
          if (stream.isPaused()) stream.resume();
        }
      } catch (err) {
        reject(err);
      }
    }

    stream.on('data', async row => {
      convertRow(row, collName);
      buffer.push(row);
      count++;
      if (count % LOG_EVERY === 0) {
        console.log(`... ${collName} ${count} righe`);
      }
      if (buffer.length >= BATCH_SIZE && !inserting) {
        stream.pause();
        flush();
      }
    });

    stream.on('end', async () => {
      streamEnded = true;
      if (!inserting) {
        flush();
      }
    });

    stream.on('error', reject);
  });
}

async function creaIndici(client) {
  const db = client.db(DB_NAME);

  await db.collection('anagrafica').createIndex({ codicescuola: 1 });

  await db.collection('studenti').createIndex({ id_studente: 1 }, { unique: true });
  await db.collection('studenti').createIndex({ id_classe: 1 });

  await db.collection('classi').createIndex({ id_classe: 1 }, { unique: true });
  await db.collection('classi').createIndex({ codicescuola: 1 });
  await db.collection('classi').createIndex({ indirizzo: 1 });
  await db.collection('classi').createIndex({ indirizzo_norm: 1 });
  await db.collection('classi').createIndex({ annocorso: 1 });

  await db.collection('docenti').createIndex({ id_docente: 1 }, { unique: true });
  await db.collection('docenti').createIndex({ materia: 1 });

  await db.collection('assegnazioni_docenti').createIndex({ id_docente: 1 });
  await db.collection('assegnazioni_docenti').createIndex({ id_classe: 1 });
  await db.collection('assegnazioni_docenti').createIndex({ materia: 1 });

  await db.collection('voti').createIndex({ id_voto: 1 }, { unique: true });
  await db.collection('voti').createIndex({ id_studente: 1 });
  await db.collection('voti').createIndex({ id_docente: 1 });
  await db.collection('voti').createIndex({ materia: 1 });
  await db.collection('voti').createIndex({ tipologia: 1 });
  await db.collection('voti').createIndex({ data: 1 });
  await db.collection('voti').createIndex({ materia: 1, tipologia: 1 });

  console.log('✅ Indici creati.');
}

async function main() {
  const client = new MongoClient(MONGO_URI, {
    maxPoolSize: 10
  });

  try {
    await client.connect();
    console.log('🔌 Connesso a MongoDB.');

    for (const [coll, file] of Object.entries(COLLECTIONS)) {
      await importCollection(client, coll, file);
      global.gc && global.gc();
    }

    await creaIndici(client);
  } catch (err) {
    console.error('❌ Errore:', err);
  } finally {
    await client.close();
    console.log('🔒 Connessione chiusa.');
  }
}

main();
