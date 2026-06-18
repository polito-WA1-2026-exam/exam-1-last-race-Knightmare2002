import { Link } from 'react-router';
import { Container, Button } from 'react-bootstrap';

function NotFoundPage() {
  return (
    <Container 
      className="d-flex flex-column justify-content-center align-items-center text-center py-5" 
      style={{ minHeight: '60vh' }}
    >
      
      <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
      
      <h2 className="display-6 fw-bold mb-4">Page not found</h2>
      
      <p className="lead text-muted mb-5">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>

      <Button 
        as={Link} 
        to="/" 
        variant="primary" 
        size="lg" 
        className="px-5 rounded-pill shadow-sm"
      >
        Go Home
      </Button>
      
    </Container>
  )
}

export default NotFoundPage