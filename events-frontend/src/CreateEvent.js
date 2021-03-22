import { Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState } from 'react';

import { createEvent } from './api';
import EventForm from './EventForm';

function CreateEvent({error, info, session}) {
  const [state, setState] = useState({
    name: "", description: "", date: "", participants: ""
  });

  function onSubmit(ev) {
    ev.preventDefault();
    createEvent(session, state.name, state.description,
      state.date, state.participants);
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
      <h2>Create Event</h2>
      <EventForm error={error} onSubmit={onSubmit} setState={setState} state={state} />
    </div>
  );
}

export default connect(({error, info, session}) =>
  ({error, info, session}))(CreateEvent);
