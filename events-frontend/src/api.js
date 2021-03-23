import moment from 'moment';

import store from './store';

async function api_get(path) {
  const url = process.env.REACT_APP_BACKEND_URL;
  let resp = await fetch(`${url}/v1/${path}`, {});
  let json = await resp.json();

  return json.data;
}

async function api_post(path, data, token) {
  const url = process.env.REACT_APP_BACKEND_URL;

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token
    },
    body: JSON.stringify(data)
  };

  let resp = await fetch(`${url}/v1/${path}`, options);
  return await resp.json();
}

async function api_patch(path, data, token) {
  const url = process.env.REACT_APP_BACKEND_URL;

  let options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token
    },
    body: JSON.stringify(data)
  }

  let resp = await fetch(`${url}/v1/${path}`, options);
  return await resp.json();
}

async function api_delete(path, token) {
  const url = process.env.REACT_APP_BACKEND_URL;

  let options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token
    }
  };

  let resp = await fetch(`${url}/v1/${path}`, options);
  return await resp.status;
}

function setError(data = 'Unknown error encountered.') {
  store.dispatch({type: 'error/set', data});
}

function setInfo(data) {
  store.dispatch({type: 'info/set', data});
}

export function login(email, password) {
  api_post('sessions', {email, password}).then((data) => {
    if (data?.token) {
      store.dispatch({
        type: 'session/set',
        data: data
      });
    } else if (data?.errors) {
      setError('Login failed.');
    } else {
      setError();
    }
  })
}

export function register(name, email, password) {
  api_post('users', {user: {name, email, password}}).then((data) => {
    if (data?.data) {
      login(email, password);
    } else if (data?.errors) {
      setError(data.errors);
    } else {
      setError();
    }
  });
}

export function getUser(id) {
  api_get(`users/${id}`).then((data) => {
    if (data) {
      store.dispatch({
        type: 'user_form/set',
        data: data
      });
    } else {
      setError('Error fetching user.');
    }
  });
}

export function updateUser(session, name, email, password) {
  api_patch(`users/${session.user_id}`, {user: {name, email, password}}, session.token)
    .then((data) => {
      if (data?.data) {
        setInfo('User updated successfully.')
      } else if (data?.errors) {
        setError(data.errors);
      }
    });
}

export function getEvents() {
  api_get('events').then((data) => {
    if (data) {
      store.dispatch({
        type: 'event_list/set',
        data: data
      });
    } else {
      setError('Error fetching events.');
    }
  });
}

export function getEvent(id) {
  api_get(`events/${id}`).then((data) => {
    if (data) {
      store.dispatch({
        type: 'event_view/set',
        data: data
      });
    } else {
      setError('Error fetching event.');
    }
  });
}

export function getEditableEvent(id) {
  api_get(`events/${id}`).then((data) => {
    if (data?.participants) {
      data["participants"] = data.participants
        .map(p => p.email)
        .join(",");
    }

    if (data?.date) {
      data["date"] = moment(data.date);
    }

    store.dispatch({
      type: 'event_form/set',
      data: data
    });
  });
}

function validateParticipants(participants) {
  // Python Regex from http://emailregex.com/
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return participants.every(p => emailPattern.test(p));
}

export function createEvent(session, name, description, date, pstring) {
  let isoDate = date.toISOString();
  const participants = pstring.split(',').map(p => p.trim());

  if (!pstring || validateParticipants(participants)) {
    store.dispatch({
      type: 'error/clear'
    });

    api_post('events', {
      event: {name, description, date: isoDate, participants}
    }, session.token).then((data) => {
      if (data?.data) {
        setInfo(data.data.id);
      } else if (data?.errors) {
        setError(data.errors);
      } else {
        setError();
      }
    });
  } else {
    setError({
      participants: ["must be a comma-separated list of emails"]
    });
  }
}

export function updateEvent(session, id, name, description, date, pstring) {
  let isoDate = date.toISOString();
  const participants = pstring.split(',').map(p => p.trim());

  if (!pstring || validateParticipants(participants)) {
    store.dispatch({
      type: 'error/clear'
    });

    api_patch(`events/${id}`, {event:
      {name, description, date: isoDate, participants}
    }, session.token).then((data) => {
      if (data?.data) {
        setInfo('Event updated successfully');
      } else if (data?.errors) {
        setError(data.errors);
      } else {
        setError();
      }
    });
  }
}

export function deleteEvent(session, id) {
  api_delete(`events/${id}`, session.token).then(status => {
    if (status !== 204) {
      setError('Oops, something went wrong!');
    } else {
      setInfo('Event deleted successfully.');
    }
  });
}

export function getParticipant(id) {
  api_get(`participants/${id}`).then((data) => {
    if (data) {
      store.dispatch({
        type: 'participant_form/set',
        data: data
      });
    } else {
      setError('Error fetching participant.');
    }
  });
}

export function updateParticipant(session, id, status, comments) {
  api_patch(`participants/${id}`, {event_participant: {status, comments}}, session.token)
    .then(data => {
      if (data?.data) {
        setInfo('Participant updated successfully.');
      } else if (data?.errors) {
        setError(data.errors);
      } else {
        setError();
      }
    });
}

export function deleteParticipant(session, id, event_id) {
  api_delete(`participants/${id}`, session.token).then(status => {
    if (status !== 204) {
      setError('Oops, something went wrong!');
    } else {
      setInfo('Participant deleted successfully.');
      getEvent(event_id);
    }
  });
}
