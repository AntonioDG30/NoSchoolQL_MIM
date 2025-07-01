const mongoose = require('mongoose');

const assegnazioneDocenteSchema = new mongoose.Schema({
  id_docente: String,
  id_classe: String,
  materia: String
}, { collection: 'assegnazioni_docenti' });

module.exports = mongoose.model('AssegnazioneDocente', assegnazioneDocenteSchema);
