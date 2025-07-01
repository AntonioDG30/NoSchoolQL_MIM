export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function parseToken() {
  const token = getToken();
  if (!token) return null;
  const [tipo, id] = token.split(':');
  return { tipo, id };
}
