const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ URI MongoDB mancante nel file .env');
  process.exit(1);
}

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;
let collections = {};

async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(process.env.DB_NAME || 'NoSchoolQL');
      console.log('✅ Connessione a MongoDB riuscita');

      collections = {
        anagraficaCollection: db.collection('anagrafica'),
        studentiCollection: db.collection('studenti'),
        docentiCollection: db.collection('docenti'),
        classiCollection: db.collection('classi'),
        votiCollection: db.collection('voti'),
        assegnazioniCollection: db.collection('assegnazioni_docenti')
      };

    } catch (error) {
      console.error('❌ Errore durante la connessione:', error);
      process.exit(1);
    }
  }
}

function getCollections() {
  return collections;
}

module.exports = {
  connectToDatabase,
  getCollections
};
