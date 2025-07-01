const mongoose = require('mongoose');

const percorsoSchema = new mongoose.Schema({
  id_percorso: String,
  nome: String,
  descrizione: String,
  materie_richieste: [String]
}, { collection: 'percorsi' });

module.exports = mongoose.model('Percorso', percorsoSchema);
