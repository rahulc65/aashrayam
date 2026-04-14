import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="loader"><div className="spinner"></div> Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
