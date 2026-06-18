import { Link } from 'react-router';
import { Container, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function HomePage() {
  const { user } = useContext(AuthContext);

  return (
    <Container className="py-5 text-center">
      
      
      <p className="text-uppercase text-muted fw-bold mb-2" style={{ letterSpacing: '2px' }}>
        Welcome Back
      </p>
      
      
      <h1 className="display-4 fw-bold mb-3">
        Ready to ride, <span className="text-primary">{user?.name || user?.username}</span>?
      </h1>
      
      
      <p className="lead text-secondary mx-auto mb-5" style={{ maxWidth: '600px' }}>
        Start a new game, study the network, and try to climb the leaderboard.
      </p>

      
      <div className="d-flex justify-content-center gap-3">
        <Button 
          as={Link} 
          to="/play" 
          variant="primary" 
          size="lg" 
          className="px-5 rounded-pill shadow-sm"
        >
          Play
        </Button>
        
        <Button 
          as={Link} 
          to="/leaderboard" 
          variant="outline-primary" 
          size="lg" 
          className="px-5 rounded-pill shadow-sm"
        >
          Leaderboard
        </Button>
      </div>
      
    </Container>
  )
}

export default HomePage