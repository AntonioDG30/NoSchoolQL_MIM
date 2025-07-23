const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./db/connection');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🎓 NoSchoolQL API attiva.');
});

const statisticheRoutes = require('./routes/statistiche');
const registroRoutes = require('./routes/registro');
const homeRoutes = require('./routes/home'); 


app.use('/api/statistiche', statisticheRoutes);
app.use('/api/registro', registroRoutes);
app.use('/api/home', homeRoutes); 

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server avviato su http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Errore durante l\'avvio del server:', err);
});
