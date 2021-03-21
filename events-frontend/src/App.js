import { Container } from 'react-bootstrap';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useEffect } from 'react';

import './App.scss';
import store from './store';
import AppNav from './Nav';
import Login from './Login';
import Register from './Register';

function App() {
  // This hack is brought to you by
  // https://help.mouseflow.com/en/articles/4310818-tracking-url-changes-with-react.
  const history = useHistory();
  useEffect(() => {
    return history.listen(() => store.dispatch({
      type: 'error/clear'
    }));
  }, [history]);

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
