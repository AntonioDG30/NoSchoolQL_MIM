import { Navigate } from 'react-router-dom';
import { parseToken } from '../utils/auth';

export default function ProtectedRoute({ children, tipo }) {
  const token = parseToken();
  if (!token) return <Navigate to="/login" />;
  if (tipo && token.tipo.toUpperCase() !== tipo.toUpperCase()) {
    return <Navigate to="/" />;
  }
  return children;
}
