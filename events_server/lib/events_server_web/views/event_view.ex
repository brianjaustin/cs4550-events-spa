defmodule EventsServerWeb.EventView do
  use EventsServerWeb, :view
  alias EventsServerWeb.EventView
  alias EventsServerWeb.EventParticipantView
  alias EventsServerWeb.UserView

  def render("index.json", %{events: events}) do
    %{data: render_many(events, EventView, "event.json")}
  end

  def render("show.json", %{event: event}) do
    %{data: render_one(event, EventView, "event.json")}
  end

  def render("event.json", %{event: event}) do
    %{
      id: event.id,
      name: event.name,
      date: event.date,
      description: event.description,
      organizer: render_one(event.organizer, UserView, "user.json"),
      participants: render_many(event.participants,
        EventParticipantView, "event_participant_brief.json")
    }
  end

  def render("event_brief.json", %{event: event}) do
    %{
      id: event.id,
      name: event.name,
      date: event.date,
      description: event.description,
      organizer: render_one(event.organizer, UserView, "user.json")
    }
  end
end
