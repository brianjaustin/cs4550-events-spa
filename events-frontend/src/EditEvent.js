import { Alert } from 'react-bootstrap';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { getEditableEvent, updateEvent } from './api';
import store from './store';
import EventForm from './EventForm';

function EditEvent({error, info, session, event_form}) {
  const { id } = useParams();

  useEffect(() => {
    getEditableEvent(id);
  }, [id]);

  function checkOrganizer() {
    if (event_form.organizer) {
      return event_form.organizer.id === session.user_id;
    } else {
      return true;
    }
  }

  function setState(st) {
    store.dispatch({
      type: 'event_form/set',
      data: st
    });
  }

  function onSubmit(ev) {
    ev.preventDefault();
    store.dispatch({
      type: 'error/clear'
    });
    updateEvent(session, id, event_form.name, event_form.description,
      event_form.date, event_form.participants);
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
        {info}
      </Alert>
    );
  }
  if (!session || !checkOrganizer()) {
    status = (
      <Redirect to="/" />
    );
  }

  return (
    <div className="form-container">
      {status}
      <h2>Edit Event</h2>
      <EventForm error={error} onSubmit={onSubmit} setState={setState} state={event_form} />
      <NavLink to={`/events/${event_form.id}`}>Back</NavLink>
    </div>
  );
}

export default connect(({error, info, session, event_form}) =>
  ({error, info, session, event_form}))(EditEvent);
