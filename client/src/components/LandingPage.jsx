import { useContext } from 'react';
import { Link } from 'react-router';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

function LandingPage() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Container fluid className="landing-page px-0">
      <Container className="hero-section py-5 text-center">
        <Row className="justify-content-center">
          <Col lg={8}>
            <p className="hero-eyebrow">
              Underground Network Game
            </p>

            <h1 className="hero-title">
              Race the <span>Rails</span>
            </h1>

            <p className="hero-subtitle">
              Navigate a fictional underground network, plan your route against
              the clock, and survive random events before time runs out.
            </p>

            <Button
              as={Link}
              to={isLoggedIn ? '/home' : '/login'}
              className="hero-button"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Log in to Play'}
            </Button>
          </Col>
        </Row>
      </Container>

      <Container className="instructions-section pb-4">
        <p className="instructions-label">
          How to play
        </p>

        <Row className="g-4">
          <Col md={6} lg={3}>
            <Card className="step-card step-blue h-100">
              <Card.Body>
                <div className="step-number">01</div>
                <Card.Title as="h3">Setup</Card.Title>
                <Card.Text>
                  Study the full network map — learn every station and line before the clock starts.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="step-card step-yellow h-100">
              <Card.Body>
                <div className="step-number">02</div>
                <Card.Title as="h3">Plan</Card.Title>
                <Card.Text>
                  You have 90 seconds to build a route from your start to your destination using the segments list.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="step-card step-green h-100">
              <Card.Body>
                <div className="step-number">03</div>
                <Card.Title as="h3">Execute</Card.Title>
                <Card.Text>
                  Your route is validated and each segment triggers a random event that earns or loses coins.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="step-card step-red h-100">
              <Card.Body>
                <div className="step-number">04</div>
                <Card.Title as="h3">Result</Card.Title>
                <Card.Text>
                  Your final coin count is your score. Invalid or incomplete routes score zero.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="note-card mt-4">
          <Card.Body>
            <span className="note-label">NOTE:</span> You start each game with 20 coins.
            A valid route executes segment by segment. An invalid or incomplete route
            costs you all coins — score: 0.
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
}

export default LandingPage;