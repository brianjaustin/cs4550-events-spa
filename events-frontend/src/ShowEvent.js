import { Alert, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { getEvent } from './api';

function showParticipant({email, status, comments}) {
  return (
    <tr>
      <td>{email}</td>
      <td>{status}</td>
      <td>{comments}</td>
      <td>Edit/Delete (TODO)</td>
    </tr>
  );
}

function ShowEvent({event_form}) {

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

  if (event_form.name) {
    return (
      <div>
        <h2>Event Details</h2>
        Edit (TODO)
        Delete (TODO)
        <ul>
          <li>
            <strong>Name: </strong>
            {event_form.name}
          </li>
          <li>
            <strong>Organizer: </strong>
            {event_form.organizer.name} &lt;{event_form.organizer.email}&gt;
          </li>
          <li>
            <strong>Description: </strong>
            {event_form.description}
          </li>
          <li>
            <strong>Date: </strong>
            {formatDate(event_form.date)}
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
                {event_form.participants.map(showParticipant)}
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

export default connect(({event_form}) => ({event_form}))(ShowEvent);
