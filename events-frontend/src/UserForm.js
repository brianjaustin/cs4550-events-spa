import { Alert, Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState } from 'react';

import { updateUser } from './api';

function UserForm({session, error, info, user_form}) {
  const [name, setName] = useState(user_form.name);
  const [email, setEmail] = useState(user_form.email);
  const [password, setPassword] = useState("");

  function onSubmit(ev) {
    ev.preventDefault();
    updateUser(session, name, email, password);
  }

  let status = null;

  if (error) {
    status = (
      <Alert variant="danger">
        Something went wrong. Check for errors below.
      </Alert>
    );
  } else if (info) {
    status = (
      <Alert variant="info">
        Details saved successfully.
      </Alert>
    );
  } else if (!session) {
    status = (
      <Redirect to="/" />
    );
  }

  return (
    <div className="form-container">
      {status}
      <Form onSubmit={onSubmit}>
        <h2>Edit User</h2>
        <Form.Group controlId="UserFormName">
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
        <Form.Group controlId="UserFormEmail">
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
        <Form.Group controlId="UserFormPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password"
                        type="password"
                        placeholder="Leave blank to keep the same"
                        onChange={(ev) => setPassword(ev.target.value)}
                        value={password}
                        isInvalid={error ? error.password : false} />
          <Form.Control.Feedback type="invalid">
            {error ? error.password : ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </div>
  );
}

export default connect(({session, error, info, user_form}) =>
  ({session, error, info, user_form}))(UserForm);
