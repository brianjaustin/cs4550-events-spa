import { Alert, Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useEffect } from 'react';

import store from './store';
import { getUser, updateUser } from './api';

function UserForm({session, error, info, user_form}) {

  useEffect(() => {
    if (session?.user_id) {
      getUser(session.user_id);
    }
  }, [session?.user_id])

  function setUser(user) {
    store.dispatch({
      type: 'user_form/set',
      data: user
    });
  }

  function setName(ev) {
    const name = ev.target.value;
    let tmp = Object.assign({}, user_form);
    tmp["name"] = name;

    setUser(tmp);
  }

  function setEmail(ev) {
    const email = ev.target.value;
    let tmp = Object.assign({}, user_form);
    tmp["email"] = email;

    setUser(tmp);
  }

  function setPassword(ev) {
    const password = ev.target.value;
    let tmp = Object.assign({}, user_form);
    tmp["password"] = password;

    setUser(tmp);
  }

  function onSubmit(ev) {
    ev.preventDefault();
    store.dispatch({
      type: 'error/clear'
    });
    updateUser(session, user_form.name, user_form.email, user_form.password);
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
                        onChange={setName}
                        value={user_form?.name || ""}
                        isInvalid={error ? error.name : false} />
          <Form.Control.Feedback type="invalid">
            {error ? error.name : ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="UserFormEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control name="email"
                        type="email"
                        onChange={setEmail}
                        value={user_form?.email || ""}
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
                        onChange={setPassword}
                        value={user_form?.password || ""}
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
