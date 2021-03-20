defmodule EventsServerWeb.EventParticipantView do
  use EventsServerWeb, :view
  alias EventsServerWeb.EventParticipantView

  def render("index.json", %{event_participants: event_participants}) do
    %{data: render_many(event_participants, EventParticipantView, "event_participant.json")}
  end

  def render("show.json", %{event_participant: event_participant}) do
    %{data: render_one(event_participant, EventParticipantView, "event_participant.json")}
  end

  def render("event_participant.json", %{event_participant: event_participant}) do
    %{id: event_participant.id,
      email: event_participant.email,
      status: event_participant.status,
      comments: event_participant.comments}
  end
end
