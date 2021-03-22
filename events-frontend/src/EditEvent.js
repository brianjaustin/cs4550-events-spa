import { Alert, Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState } from 'react';
import Flatpickr from "react-flatpickr";

//import { createEvent } from './api';

function EditEvent({error, info, session}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");

  function onSubmit(ev) {
    ev.preventDefault();
    // TODO
  }

  let status = null;

  if (error) {
    status = (
      <Alert variant="danger">
        Something went wrong. Check for errors below
      </Alert>
    );
  } else if (info) {
    status = (
      <Alert variant="info">
        {info}
      </Alert>
    );
  }
  if (!session) {
    status = (
      <Redirect to="/" />
    );
  }

  return (
    <div className="form-container">
      {status}
      <Form onSubmit={onSubmit}>
        <h2>Edit Event</h2>
        <Form.Group controlId="EditEventName">
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
        <Form.Group controlId="EditEventDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control name="description"
                        type="text"
                        as="textarea"
                        onChange={ev => setDescription(ev.target.value)}
                        value={description}
                        isInvalid={error ? error.description : false} />
          <Form.Control.Feedback type="invalid">
            {error ? error.description : ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="EditEventDate">
          <Form.Label>Date</Form.Label>
          <Flatpickr name="date"
                     type="text"
                     data-enable-time
                     className="form-control"
                     onChange={setDate}
                     value={date} />
          <Form.Control.Feedback type="invalid">
            {error ? error.date : ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="EditEventParticipants">
          <Form.Label>Participants</Form.Label>
          <Form.Control name="particpants"
                        type="text"
                        placeholder="one@example.com, two@example.com"
                        onChange={ev => setParticipants(ev.target.value)}
                        value={participants}
                        isInvalid={error ? error.participants : false} />
          <Form.Control.Feedback type="invalid">
            {error ? error.participants : ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </div>
  );
}

export default connect(({error, info, session}) =>
  ({error, info, session}))(EditEvent);
