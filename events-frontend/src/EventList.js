import { Alert, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { getEvents } from './api';

function EventList({session, error, event_list}) {

  useEffect(() => {
    getEvents();
  }, []);

  let message = 'Welcome! Find events below, or login to create a new one.'
  if(session) {
    message = 'Welcome back! Click above to create a new event, or select one below.'
  }

  let status = null;
  if(error) {
    error = (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  function showEvent({id, name, organizer}) {
    return (
      <tr key={id}>
        <td><NavLink to={`/events/${id}`}>{name}</NavLink></td>
        <td>{organizer.name} &lt;{organizer.email}&gt;</td>
      </tr>
    );
  }

  return (
    <div className="form-container">
      <h2>Events</h2>
      {status}
      {message}
      <Table striped>
        <thead>
          <tr>
            <td>Name</td>
            <td>Organizer</td>
          </tr>
        </thead>
        <tbody>
          {event_list.map(showEvent)}
        </tbody>
      </Table>
    </div>
  );
}

export default connect(({session, error, event_list}) =>
  ({session, error, event_list}))(EventList);
