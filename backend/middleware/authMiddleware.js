/**
 * MIDDLEWARE DI AUTENTICAZIONE
 * 
 * Gestisco l'autenticazione degli utenti (studenti e docenti) per le API protette.
 * Il sistema utilizza un token semplificato nel formato "TIPO:ID" passato
 * nell'header Authorization delle richieste HTTP.
 * 
 * @author Antonio Di Giorgio
 */

/**
 * Middleware Express per verificare l'autenticazione dell'utente.
 * 
 * Il token di autenticazione deve essere nel formato:
 * - "STUDENTE:STU000001" per gli studenti
 * - "DOCENTE:DOC00001" per i docenti
 * 
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 * @param {Function} next - Funzione per passare al middleware successivo
 */
module.exports = function verificaAutenticazione(req, res, next) {
  // ===========================
  // ESTRAZIONE TOKEN
  // ===========================
  
  // Recupero il token dall'header Authorization
  const tokenAutenticazione = req.headers.authorization;

  // Verifico che il token sia presente e contenga il separatore ':'
  if (!tokenAutenticazione || !tokenAutenticazione.includes(':')) {
    return res.status(401).json({ 
      messaggio: 'Token non valido o assente' 
    });
  }

  // ===========================
  // PARSING DEL TOKEN
  // ===========================
  
  // Divido il token nelle sue componenti (tipo e ID)
  const [tipoUtente, idUtente] = tokenAutenticazione.split(':');

  // Verifico che entrambe le componenti siano presenti
  if (!tipoUtente || !idUtente) {
    return res.status(401).json({ 
      messaggio: 'Token malformato' 
    });
  }

  // ===========================
  // VALIDAZIONE TIPO UTENTE
  // ===========================
  
  // Normalizzo il tipo utente in minuscolo per la validazione
  const tipoUtenteNormalizzato = tipoUtente.trim().toLowerCase();

  // Verifico che il tipo utente sia valido (solo 'studente' o 'docente')
  if (tipoUtenteNormalizzato !== 'studente' && tipoUtenteNormalizzato !== 'docente') {
    return res.status(403).json({ 
      messaggio: 'Tipo utente non autorizzato' 
    });
  }

  // ===========================
  // SALVATAGGIO DATI UTENTE
  // ===========================
  
  /**
   * Aggiungo i dati utente all'oggetto request per renderli
   * disponibili ai controller successivi.
   * 
   * NOTA: Rimuovo gli spazi bianchi dall'ID per evitare problemi
   */
  req.tipoUtente = tipoUtenteNormalizzato;
  req.idUtente = idUtente.trim();

  // Passo al middleware/controller successivo
  next();
};