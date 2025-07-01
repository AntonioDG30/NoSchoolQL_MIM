const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./db/connection');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route placeholder
app.get('/', (req, res) => {
  res.send('🎓 NoSchoolQL API attiva.');
});

// Importa e monta i router (verranno creati nei prossimi step)
const statisticheRoutes = require('./routes/statistiche');
const registroRoutes = require('./routes/registro');

app.use('/api/statistiche', statisticheRoutes);
app.use('/api/registro', registroRoutes);

// Avvio del server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server avviato su http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Errore durante l\'avvio del server:', err);
});
