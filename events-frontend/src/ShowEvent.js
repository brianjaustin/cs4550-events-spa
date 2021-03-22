import { Alert, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom'

import { getEvent, deleteEvent } from './api';

function ShowEvent({info, error, session, event_view}) {

  const { id } = useParams();

  useEffect(() => {
    getEvent(id);
  }, [id])

  function formatDate(dStr) {
    if (dStr) {
      const d = new Date(dStr);
      const f = new Intl.DateTimeFormat('en', { dateStyle: 'full', timeStyle: 'short' });
      return f.format(d);
    } else {
      return "Undefined";
    }
  }

  function showParticipant({email, status, comments}) {
    return (
      <tr key={email}>
        <td>{email}</td>
        <td>{status}</td>
        <td>{comments}</td>
        <td>Edit/Delete (TODO)</td>
      </tr>
    );
  }

  function eventControlLinks(session, event) {
    if (session.user_id === event.organizer?.id) {
      return (
        <>
          <NavLink to={`/events/${event.id}/edit`}>Edit</NavLink>
          &nbsp;
          <a href="/" onClick={deleteClick}>Delete</a>
        </>
      );
    }

    return null;
  }

  function deleteClick(ev) {
    ev.preventDefault();

    if (event_view.id) {
      deleteEvent(session, event_view.id);
    }
  }

  if (event_view.name) {
    let status = null;
    if (info) {
      status = (
        <Alert variant="info">
          {info}
        </Alert>
      );
    } else if (error) {
      status = (
        <Alert variant="danger">
          {error}
        </Alert>
      );
    }

    return (
      <div className="form-container">
        {status}
        <h2>Event Details</h2>
        {eventControlLinks(session, event_view)}
        <ul>
          <li>
            <strong>Name: </strong>
            {event_view.name}
          </li>
          <li>
            <strong>Organizer: </strong>
            {event_view.organizer.name} &lt;{event_view.organizer.email}&gt;
          </li>
          <li>
            <strong>Description: </strong>
            {event_view.description}
          </li>
          <li>
            <strong>Date: </strong>
            {formatDate(event_view.date)}
          </li>
          <li>
            <strong>Participants:</strong>
            <Table striped>
              <thead>
                <tr>
                  <td>Email</td>
                  <td>Response</td>
                  <td>Comments</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {event_view.participants.map(showParticipant)}
              </tbody>
            </Table>
          </li>
        </ul>
      </div>
    )
  } else {
    return (
      <div className="form-container">
        <Alert variant="danger">
          Event not found.
        </Alert>
      </div>
    );
  }
}

export default connect(({info, error, session, event_view}) =>
  ({info, error, session, event_view}))(ShowEvent);
