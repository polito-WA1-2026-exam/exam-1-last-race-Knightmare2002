import { useLocation } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

function NavigationBar() {
  const { isLoggedIn, user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }, [isDarkMode])

  const handleLogout = async () => {
    await logOut()
    navigate('/')
  }

  
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  }

  if (location.pathname === '/play'){
    return null
  }

  return (
    <Navbar expand="md" className="topbar shadow-sm py-3">
      
      <Container fluid className="px-4 px-lg-5">
        
        <Navbar.Brand as={NavLink} to="/" className="brand fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-train-freight-front fs-1 text-primary"></i>
          Race the Rails
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          
          <Nav className="mx-auto my-2 my-md-0 d-flex justify-content-center">
            <Button 
              variant={isDarkMode ? "outline-light" : "outline-dark"}  
              className="rounded-pill px-3"
              onClick={toggleTheme}
              title="Toggle Dark Mode"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </Button>
          </Nav>

          <Nav className="ms-auto align-items-center topnav fs-4">
            {isLoggedIn ? (
              <>
                <Nav.Link as={NavLink} to="/leaderboard">Leaderboard</Nav.Link>
                <Nav.Link as={NavLink} to="/play">Play</Nav.Link>
                <Navbar.Text className="nav-user mx-3 fw-bold">
                  {user?.username}
                </Navbar.Text>
                <Button 
                  variant={isDarkMode ? "outline-light" : "outline-dark"} 
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
                className="nav-cta ms-2 rounded-pill px-4"
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