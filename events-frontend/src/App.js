import { Container } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';

import './App.scss';
import AppNav from './Nav';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <Container>
      <AppNav />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
