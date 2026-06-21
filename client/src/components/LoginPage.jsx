import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Container, Card, Form, Button, Nav, Alert, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const { isLoggedIn, logIn, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMsg('')

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Username and password are required.')
      return;
    }

    try {
      await logIn(username, password);
      navigate('/home')
    } catch (err) {
      setErrorMsg(err.message || 'Login failed')
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      
      <Card className="shadow-lg border-0 bg-light" style={{ width: '100%', maxWidth: '420px', borderRadius: '1.25rem' }}>
        <Card.Body className="p-5">
          
          {/* Header con Icona e Titolo */}
          <div className="text-center mb-5">
            <i className="bi bi-train-freight-front text-primary" style={{ fontSize: '3.5rem' }}></i>
            <h2 className="fw-bold mt-2 mb-1">Welcome Back</h2>
            <p className="text-muted small">Enter your credentials to access the game.</p>
          </div>

          <Form onSubmit={handleSubmit}>
            
            <Form.Group className="mb-4" controlId="loginUsername">
              <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                USERNAME
              </Form.Label>
              <Form.Control
                type="text"
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="player"
                className="bg-white"
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="loginPassword">
              <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                PASSWORD
              </Form.Label>
              <Form.Control
                type="password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white"
              />
            </Form.Group>

            {errorMsg && (
              <Alert variant="danger" className="py-2 text-center rounded">
                {errorMsg}
              </Alert>
            )}

            <Button 
              type="submit" 
              variant="warning" 
              className="w-100 fw-bold text-dark rounded-pill mt-3 shadow-sm" 
              size="lg"
              disabled={loading}
              style={{ letterSpacing: '1px' }}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  LOGGING IN...
                </>
              ) : (
                'LOG IN'
              )}
            </Button>

          </Form>
        </Card.Body>
      </Card>

    </Container>
  )
}

export default LoginPage