const mongoose = require('mongoose');

const scuolaSchema = new mongoose.Schema({
  codice_scuola: String,
  nome_scuola: String,
  provincia: String,
  regione: String,
  comune: String,
  tipo_istituto: String
}, { collection: 'scuole' });

module.exports = mongoose.model('Scuola', scuolaSchema);
