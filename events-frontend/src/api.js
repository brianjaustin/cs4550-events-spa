import store from './store';

async function api_get(path) {
  let url = process.env.REACT_APP_BACKEND_URL;
  let resp = await fetch(`${url}/v1/${path}`, {});
  let json = await resp.json();

  return json.data;
}

async function api_post(path, data) {
  let url = process.env.REACT_APP_BACKEND_URL;

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  let resp = await fetch(`${url}/v1/${path}`, options);
  return await resp.json();
}

async function api_patch(path, data, token) {
  let url = process.env.REACT_APP_BACKEND_URL;

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

export function login(email, password) {
  api_post('sessions', {email, password}).then((data) => {
    if (data.token) {
      store.dispatch({
        type: 'session/set',
        data: data
      });
    } else if (data.errors) {
      store.dispatch({
        type: 'error/set',
        data: 'Login failed'
      });
    }
  })
}

export function register(name, email, password) {
  api_post('users', {user: {name, email, password}}).then((data) => {
    if (data.data.id) {
      login(email, password);
    } else if (data.errors) {
      store.dispatch({
        type: 'error/set',
        data: data.errors,
      });
    }
  });
}

export function getUser(id) {
  api_get(`users/${id}`).then((data) => {
    store.dispatch({
      type: 'user_form/set',
      data: data
    });
  });
}

export function updateUser(session, name, email, password) {
  api_patch(`users/${session.user_id}`, {user: {name, email, password}}, session.token)
    .then((data) => {
      if (data?.data?.id) {
        store.dispatch({
          type: 'info/set',
          data: "User updated successfully."
        });
      } else if (data?.errors) {
        store.dispatch({
          type: 'error/set',
          data: data.errors,
        });
      }
    });
}
