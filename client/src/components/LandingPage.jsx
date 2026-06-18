import { Link } from 'react-router';
import { Container, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function LandingPage() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Container className="py-5 text-center">
      
      {/* --- HERO SECTION --- */}
      <p className="text-uppercase text-muted fw-bold mb-2" style={{ letterSpacing: '2px' }}>
        Underground Network Game
      </p>
      <h1 className="display-3 fw-bold mb-3">
        Race the <span className="text-primary">Rails</span>
      </h1>
      <p className="lead text-secondary mx-auto mb-5" style={{ maxWidth: '600px' }}>
        Navigate a fictional underground network, plan your route against
        the clock, and survive random events — all before time runs out.
      </p>

      {isLoggedIn ? (
        <Button as={Link} to="/home" variant="primary" size="lg" className="px-5 rounded-pill shadow-sm">
          Go to Dashboard
        </Button>
      ) : (
        <Button as={Link} to="/login" variant="primary" size="lg" className="px-5 rounded-pill shadow-sm">
          Log in to Play
        </Button>
      )}

      {/* --- INSTRUCTIONS SECTION --- */}
      <section className="mt-5 pt-4 text-start">
        <h2 className="h6 text-muted text-uppercase fw-bold mb-4 text-center">
          How to Play
        </h2>

        
        <Row className="g-4 mb-5">
          <Col md={6} lg={3}>
            <Card className="h-100 border-primary border-top-0 border-end-0 border-bottom-0 border-4 shadow-sm bg-light">
              <Card.Body>
                <div className="text-primary fw-bold fs-4 mb-2">01</div>
                <Card.Title>Setup</Card.Title>
                <Card.Text className="text-muted">
                  Study the full network map before the clock starts.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 border-warning border-top-0 border-end-0 border-bottom-0 border-4 shadow-sm bg-light">
              <Card.Body>
                <div className="text-warning fw-bold fs-4 mb-2">02</div>
                <Card.Title>Plan</Card.Title>
                <Card.Text className="text-muted">
                  You have 90 seconds to build a route using the available segments.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 border-success border-top-0 border-end-0 border-bottom-0 border-4 shadow-sm bg-light">
              <Card.Body>
                <div className="text-success fw-bold fs-4 mb-2">03</div>
                <Card.Title>Execute</Card.Title>
                <Card.Text className="text-muted">
                  Each segment triggers a random event that earns or loses coins.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 border-danger border-top-0 border-end-0 border-bottom-0 border-4 shadow-sm bg-light">
              <Card.Body>
                <div className="text-danger fw-bold fs-4 mb-2">04</div>
                <Card.Title>Result</Card.Title>
                <Card.Text className="text-muted">
                  The final number of coins is your score. Invalid routes score zero.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Alert variant="info" className="shadow-sm">
          <strong>NOTE:</strong> You start every game with <strong>20 coins</strong>. A valid route executes segment by segment.
          An invalid or incomplete route gives a score of 0.
        </Alert>
      </section>
      
    </Container>
  )
}

export default LandingPage