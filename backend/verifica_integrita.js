const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'NoSchoolQL';

async function verificaIntegrita() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const [
    studenti,
    scuole,
    percorsi,
    voti,
    docenti
  ] = await Promise.all([
    db.collection('studenti').find().toArray(),
    db.collection('scuole').find().toArray(),
    db.collection('percorsi').find().toArray(),
    db.collection('voti').find().toArray(),
    db.collection('docenti').find().toArray()
  ]);

  // Costruisci mappe rapide
  const scuoleMap = new Set(scuole.map(s => s.id_scuola));
  const percorsiMap = new Set(percorsi.map(p => p.id_percorso));
  const studentiMap = new Set(studenti.map(s => s.id_studente));
  const docentiMap = new Set(docenti.map(d => d.id_docente));

  // Verifica studenti
  const studentiConScuolaAssente = studenti.filter(s => !scuoleMap.has(s.id_scuola));
  const studentiConPercorsoAssente = studenti.filter(s => !percorsiMap.has(s.id_percorso));

  // Verifica voti
  const votiConStudenteAssente = voti.filter(v => !studentiMap.has(v.id_studente));
  const votiConDocenteAssente = voti.filter(v => !docentiMap.has(v.id_docente));

  console.log('🧪 Risultati verifica integrità:\n');

  console.log(`🔍 Studenti totali: ${studenti.length}`);
  console.log(`❌ Studenti con scuola assente: ${studentiConScuolaAssente.length}`);
  console.log(`❌ Studenti con percorso assente: ${studentiConPercorsoAssente.length}`);

  console.log(`\n📄 Voti totali: ${voti.length}`);
  console.log(`❌ Voti con studente assente: ${votiConStudenteAssente.length}`);
  console.log(`❌ Voti con docente assente: ${votiConDocenteAssente.length}`);

  client.close();
}

verificaIntegrita().catch(console.error);

