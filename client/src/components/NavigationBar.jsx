import { NavLink, useNavigate } from 'react-router';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function NavigationBar() {
  const { isLoggedIn, user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut()
    navigate('/')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="topbar shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="brand fw-bold">
          ⬡ Race the Rails
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center topnav">
            {isLoggedIn ? (
              <>
                <Nav.Link as={NavLink} to="/leaderboard">Leaderboard</Nav.Link>
                <Nav.Link as={NavLink} to="/play">Play</Nav.Link>
                
                <Navbar.Text className="nav-user mx-3 text-light">
                  {user?.username}
                </Navbar.Text>
                
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="nav-button ms-2" 
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Button 
                as={NavLink} 
                to="/login" 
                variant="primary" 
                className="nav-cta ms-2"
              >
                Log in
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar