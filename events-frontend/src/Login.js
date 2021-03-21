import { Alert, Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState } from 'react';

import { login } from './api';

function Login({error, session}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(ev) {
    ev.preventDefault();
    login(email, password);
  }

  let status = null;

  if (error) {
    status = (
      <Alert variant="danger">{error}</Alert>
    );
  } else if (session) {
    status = (
      <Redirect to="/" />
    );
  }

  return (
    <div className="form-container">
      {status}
      <Form onSubmit={onSubmit}>
        <h2>Login</h2>
        <Form.Group controlId="LoginEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control name="email"
                        type="email"
                        onChange={ev => setEmail(ev.target.value)}
                        value={email} />
        </Form.Group>
        <Form.Group controlId="LoginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password"
                        type="password"
                        onChange={(ev) => setPassword(ev.target.value)}
                        value={password} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
}

export default connect(({error, session}) => ({error, session}))(Login);
