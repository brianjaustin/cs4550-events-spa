import { Button, Form } from 'react-bootstrap';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'

function EventForm({error, onSubmit, setState, state}) {

  function setName(ev) {
    const name = ev.target.value;
    let tmp = Object.assign({}, state);
    tmp["name"] = name;

    setState(tmp);
  }

  function setDescription(ev) {
    const description = ev.target.value;
    let tmp = Object.assign({}, state);
    tmp["description"] = description;

    setState(tmp);
  }

  function setDate(date) {
    let tmp = Object.assign({}, state);
    tmp["date"] = date;

    setState(tmp);
  }

  function setParticipants(ev) {
    const participants = ev.target.value;
    let tmp = Object.assign({}, state);
    tmp["participants"] = participants;

    setState(tmp);
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group controlId="EventName">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name"
                        type="text"
                        onChange={setName}
                        value={state?.name}
                        isInvalid={error?.name} />
          <Form.Control.Feedback type="invalid">
            {error?.name || ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="EventDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control name="description"
                        type="text"
                        as="textarea"
                        onChange={setDescription}
                        value={state?.description}
                        isInvalid={error?.description} />
          <Form.Control.Feedback type="invalid">
            {error?.description || ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="EventDate">
          <Form.Label>Date</Form.Label>
          <Datetime name="date"
                    type="text"
                    data-enable-time
                    onChange={setDate}
                    value={state?.date} />
          <div className="invalid">
            {error?.date || ""}
          </div>
        </Form.Group>
        <Form.Group controlId="EventParticipants">
          <Form.Label>Participants</Form.Label>
          <Form.Control name="particpants"
                        type="text"
                        placeholder="one@example.com, two@example.com"
                        onChange={setParticipants}
                        value={state?.participants}
                        isInvalid={error?.participants} />
          <Form.Control.Feedback type="invalid">
            {error?.participants || ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          Save
        </Button>
    </Form>
  );
}

export default EventForm;
