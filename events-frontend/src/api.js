import store from './store';

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

export function login(email, password) {
  api_post('sessions', {email, password}).then((data) => {
    if (data.token) {
      store.dispatch({
        type: 'session/set',
        data: data.token
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
  api_post('/users', {user: {name, email, password}}).then((data) => {
    if (data.data.id) {
      login(email, password);
    } else if (data.errors) {
      store.dispatch({
        type: 'error/set',
        data: data.errors,
      })
    }
  });
}
