import { Alert, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom'

import store from './store';
import { getParticipant, updateParticipant } from './api';

function ParticipantForm({error, onSubmit, state, setState}) {

  function setStatus(ev) {
    const status = ev.target.value;
    let tmp = Object.assign({}, state);
    tmp["status"] = status;
    setState(tmp);
  }

  function setComments(ev) {
    const comments = ev.target.value;
    let tmp = Object.assign({}, state);
    tmp["comments"] = comments;
    setState(tmp);
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group controlId="ParticipantEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" value={state?.email || ""} readOnly />
      </Form.Group>
      <Form.Group controlId="ParticipantStatus">
        <Form.Label>Response</Form.Label>
        <Form.Control name="status"
                      as="select"
                      onChange={setStatus}
                      value={state?.status || "unknown"}
                      isInvalid={error?.status}
        >
          <option value="unknown" disabled>Please choose an option.</option>
          <option value="yes">Yes</option>
          <option value="maybe">Maybe</option>
          <option value="no">No</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="ParticipantComments">
        <Form.Label>Comments</Form.Label>
        <Form.Control name="comments"
                      type="text"
                      as="textarea"
                      onChange={setComments}
                      value={state?.comments || ""}
                      isInvalid={error?.comments} />
        <Form.Control.Feedback type="invalid">
          {error?.comments || ""}
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit">
          Save
        </Button>
    </Form>
  );
}

function EditParticipant({error, info, session, participant_form}) {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getParticipant(id);
    }
  }, [id]);

  function canEdit() {
    if (participant_form?.email) {
      return (
        session?.user_email === participant_form.email
        || session?.user_email === participant_form.event?.organizer?.email
      );
    } else {
      return true;
    }
  }

  function setParticipant(p) {
    store.dispatch({
      type: 'participant_form/set',
      data: p
    });
  }

  function onSubmit(ev) {
    ev.preventDefault();
    updateParticipant(session, id, participant_form.status, participant_form.comments);
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
  if (!canEdit()) {
    status = (
      <Redirect to="/" />
    );
  }

  return(
    <div className="form-container">
      {status}
      <h2>Edit Participant</h2>
      <ParticipantForm error={error}
                       onSubmit={onSubmit}
                       state={participant_form}
                       setState={setParticipant} />
    </div>
  );
}

export default connect(({error, info, session, participant_form}) =>
  ({error, info, session, participant_form}))(EditParticipant);
