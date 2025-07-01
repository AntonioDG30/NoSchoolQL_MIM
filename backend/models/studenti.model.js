const mongoose = require('mongoose');

const studenteSchema = new mongoose.Schema({
  id_studente: String,
  nome: String,
  cognome: String,
  genere: String,
  cittadinanza: String,
  id_classe: String,
  indirizzo: String,
  regione: String
}, { collection: 'studenti' });

module.exports = mongoose.model('Studente', studenteSchema);
