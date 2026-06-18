import { Outlet } from 'react-router';
import { Container } from 'react-bootstrap';
import NavigationBar from './NavigationBar';

function AppLayout() {
  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <NavigationBar />
      
      <Container as="main" className="page-shell flex-grow-1 py-4">
        <Outlet />
      </Container>
    </div>
  )
}

export default AppLayout