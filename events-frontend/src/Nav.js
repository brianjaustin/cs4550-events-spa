import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import store from './store';

function AppNav({session}) {
  function logout() {
    store.dispatch({type: 'session/clear'});
  }

  let leftMenu = (
    <Nav className="ml-auto">
      <NavLink to="/login" className="nav-link">Login</NavLink>
      <NavLink to="/register" className="nav-link">Register</NavLink>
    </Nav>
  );

  if (session) {
    leftMenu = (
      <Nav className="ml-auto">
        <NavLink to="/" className="nav-link">TODO: Profile</NavLink>
        <Nav.Link onClick={logout} className="nav-link">Logout</Nav.Link>
      </Nav>
    );
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#">Events</Navbar.Brand>
      <Nav className="mr-auto">

      </Nav>
      {leftMenu}
    </Navbar>
  );
}

export default connect(({session}) => ({session}))(AppNav);
