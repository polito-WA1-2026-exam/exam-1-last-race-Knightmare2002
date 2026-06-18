import { Navigate } from 'react-router';
import { Container, Spinner } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isLoggedIn, authReady } = useContext(AuthContext);

  if (!authReady) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-3 text-muted">Loading session...</p>
      </Container>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;