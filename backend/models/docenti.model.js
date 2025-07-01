const mongoose = require('mongoose');

const docenteSchema = new mongoose.Schema({
  id_docente: String,
  nome: String,
  cognome: String,
  titolo: String
}, { collection: 'docenti' });

module.exports = mongoose.model('Docente', docenteSchema);
