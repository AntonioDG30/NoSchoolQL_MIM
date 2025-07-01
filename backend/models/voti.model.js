const mongoose = require('mongoose');

const votoSchema = new mongoose.Schema({
  id_studente: String,
  id_classe: String,
  id_docente: String,
  materia: String,
  voto: Number,
  data: Date
}, { collection: 'voti' });

module.exports = mongoose.model('Voto', votoSchema);
