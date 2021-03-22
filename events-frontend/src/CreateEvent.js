import { Alert, Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState } from 'react';
import Flatpickr from "react-flatpickr";

import { createEvent } from './api';

function CreateEvent({error, info, session}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");

  function onSubmit(ev) {
    ev.preventDefault();
    createEvent(session, name, description, date[0], participants);
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
      <Redirect to={`/events/${info}`} />
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
        <h2>Create Event</h2>
        <Form.Group controlId="CreateEventName">
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
        <Form.Group controlId="CreateEventDescription">
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
        <Form.Group controlId="CreateEventDate">
          <Form.Label>Date</Form.Label>
          <Flatpickr name="date"
                     type="text"
                     data-enable-time
                     className="form-control"
                     onChange={setDate}
                     value={date} />
          <div className="invalid">
            {error ? error.date : ""}
          </div>
        </Form.Group>
        <Form.Group controlId="CreateEventParticipants">
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
  ({error, info, session}))(CreateEvent);
