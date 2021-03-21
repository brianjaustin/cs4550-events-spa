import { Alert, Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState } from 'react';

import { register } from './api';

function Register({error, session}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(ev) {
    ev.preventDefault();
    register(name, email, password);
  }

  let status = null;

  if (error) {
    status = (
      <Alert variant="danger">Something went wrong. Check for errors below.</Alert>
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
        <h2>Register</h2>
        <Form.Group controlId="RegisterName">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name"
                        type="text"
                        onChange={ev => setName(ev.target.value)}
                        value={name}
                        isInvalid={error ? error.name : false} />
          <Form.Control.Feedback type="invalid">
            {error ? error.name : ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="RegisterEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control name="email"
                        type="email"
                        onChange={ev => setEmail(ev.target.value)}
                        value={email}
                        isInvalid={error ? error.email : false} />
          <Form.Control.Feedback type="invalid">
            {error ? error.email : ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="RegisterPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password"
                        type="password"
                        onChange={(ev) => setPassword(ev.target.value)}
                        value={password}
                        isInvalid={error ? error.password : false} />
          <Form.Control.Feedback type="invalid">
            {error ? error.password : ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
}

export default connect(({error, session}) => ({error, session}))(Register);
