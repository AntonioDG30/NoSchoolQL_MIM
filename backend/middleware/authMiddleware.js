module.exports = function (req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.includes(':')) {
    return res.status(401).json({ message: 'Token non valido o assente' });
  }

  const [type, id] = auth.split(':');

  if (!type || !id) {
    return res.status(401).json({ message: 'Token malformato' });
  }

  const typeLower = type.trim().toLowerCase();

  if (typeLower !== 'studente' && typeLower !== 'docente') {
    return res.status(403).json({ message: 'Tipo utente non autorizzato' });
  }

  req.userType = typeLower;
  req.userId = id.trim();

  next();
};
