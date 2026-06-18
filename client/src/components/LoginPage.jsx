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
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      
      <Card className="shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Header className="bg-white pb-0 border-bottom-0">
          <Nav variant="tabs" defaultActiveKey="#login">
            <Nav.Item>
              <Nav.Link href="#login" active className="fw-bold">Log In</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link disabled>Register</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Card.Body className="p-4 pt-3">
          <Form onSubmit={handleSubmit}>
            
            <Form.Group className="mb-3" controlId="loginUsername">
              <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                USERNAME
              </Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="loginPassword">
              <Form.Label className="text-muted fw-bold" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                PASSWORD
              </Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </Form.Group>

            
            {errorMsg && (
              <Alert variant="danger" className="py-2 text-center">
                {errorMsg}
              </Alert>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              className="w-100 fw-bold" 
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </Button>

          </Form>
        </Card.Body>
      </Card>

    </Container>
  )
}

export default LoginPage