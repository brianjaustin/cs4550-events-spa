/**
 * This code is based upon the demonstration in lecture, photo blog SPA.
 * See https://github.com/NatTuck/scratch-2021-01/blob/master/4550/0319/photo-blog-spa/web-ui/src/store.js.
 */

import { createStore, combineReducers } from 'redux';

function save_session(sess) {
  let session = Object.assign({}, sess, {time: Date.now()})
  localStorage.setItem("session", JSON.stringify(session));
}

function clear_session() {
  localStorage.removeItem("session");
}

function load_session() {
  let session = localStorage.getItem("session");
  if (!session) {
    return null;
  }

  session = JSON.parse(session);
  let age = Date.now() - session.time;
  let hours = 60 * 60 * 100;
  if (age < 24 * hours) {
    return session;
  } else {
    clear_session();
    return null;
  }
}

function session(state = load_session(), action) {
  switch (action.type) {
    case 'session/set':
      save_session(action.data);
      return action.data;
    case 'session/clear':
      clear_session();
      return null;
    default:
      return state;
  }
}

function error(state = null, action) {
  switch(action.type) {
    case 'error/set':
      return action.data;
    case 'session/set':
    case 'error/clear':
      return null;
    default:
      return state;
  }
}

function info(state = null, action) {
  switch(action.type) {
    case 'info/set':
      return action.data;
    case 'info/clear':
      return null;
    default:
      return state;
  }
}

function user_form(state = {}, action) {
  switch(action.type) {
    case 'user_form/set':
      return action.data;
    default:
      return state;
  }
}

function root_reducer(state, action) {
  let redu = combineReducers(
    {session, error, info, user_form}
  );
  return redu(state, action);
}

let store = createStore(root_reducer);
export default store;
