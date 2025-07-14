import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const id = localStorage.getItem('id');
  const tipo = localStorage.getItem('tipo');

  if (!id || !tipo) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
