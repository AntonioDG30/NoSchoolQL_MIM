const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
  id_classe: String,
  anno: Number,
  sezione: String,
  indirizzo: String,
  id_scuola: String
}, { collection: 'classi' });

module.exports = mongoose.model('Classe', classeSchema);
