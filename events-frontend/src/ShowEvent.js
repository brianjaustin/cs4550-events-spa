import { Alert, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom'

import { getEvent, deleteEvent, deleteParticipant } from './api';

function StatusSummary({participants}) {
  let counts = {yes: 0, no: 0, maybe: 0, unknown: 0}

  if (participants) {
    for(const p of participants) {
      counts[p.status || "unknown"] += 1;
    }
  }

  return (
    <p>
      {counts.yes} yes, {counts.no} no, {counts.maybe} maybe, {counts.unknown} no response.
    </p>
  );
}

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

  function isOrganizer() {
    return session?.user_id === event_view.organizer?.id;
  }

  function showParticipant({id, email, status, comments}) {
    let editLink = <NavLink to={`/participants/${id}`}>Edit</NavLink>

    let controlLinks = null;
    if (email === session?.user_email) {
      controlLinks = editLink;
    } else if (isOrganizer()) {
      controlLinks = (
        <>
          {editLink}
          &nbsp;
          <a href="/" onClick={ev => {
            ev.preventDefault();
            deleteParticipant(session, id, event_view.id);
          }}>
            Delete
          </a>
        </>
      );
    }

    return (
      <tr key={id}>
        <td>{email}</td>
        <td>{status}</td>
        <td>{comments}</td>
        <td>{controlLinks}</td>
      </tr>
    );
  }

  function eventControlLinks(event) {
    if (isOrganizer()) {
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
        {eventControlLinks(event_view)}
        <p>
          Share <a href={window.location.href}>
            {window.location.href}
          </a> with participants so they can respond.
        </p>
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
            <StatusSummary participants={event_view.participants} />
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
        <Alert variant="info">
          Loading event details...
        </Alert>
      </div>
    );
  }
}

export default connect(({info, error, session, event_view}) =>
  ({info, error, session, event_view}))(ShowEvent);
