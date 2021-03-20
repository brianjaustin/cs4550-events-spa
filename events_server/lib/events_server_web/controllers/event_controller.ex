defmodule EventsServerWeb.EventController do
  use EventsServerWeb, :controller

  alias EventsServer.Events
  alias EventsServer.Events.Event
  alias EventsServer.Repo

  action_fallback EventsServerWeb.FallbackController

  plug EventsServerWeb.Plugs.RequireToken when action in [
    :create, :update, :delete
  ]

  plug :require_organizer when action in [
    :update, :delete
  ]

  def require_organizer(conn, _params) do
    event = conn.params["id"]
    |> Events.get_event!()
    |> Repo.preload(:organizer)

    current_user = conn.assigns[:current_user]

    if current_user.id == event.organizer.id do
      conn
    else
      conn
      |> put_status(:unauthorized)
      |> put_view(EventsServerWeb.ErrorView)
      |> render("unauthorized.json")
      |> halt()
    end
  end

  def index(conn, _params) do
    events = Events.list_events()
    render(conn, "index.json", events: events)
  end

  def create(conn, %{"event" => event_params}) do
    event_params = event_params
    |> Map.put("organizer_id", conn.assigns[:current_user].id)
    with {:ok, %Event{} = event} <- Events.create_event(event_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.event_path(conn, :show, event))
      |> render("show.json", event: event)
    end
  end

  def show(conn, %{"id" => id}) do
    event = Events.get_event!(id)
    render(conn, "show.json", event: event)
  end

  def update(conn, %{"id" => id, "event" => event_params}) do
    event = Events.get_event!(id)

    with {:ok, %Event{} = event} <- Events.update_event(event, event_params) do
      render(conn, "show.json", event: event)
    end
  end

  def delete(conn, %{"id" => id}) do
    event = Events.get_event!(id)

    with {:ok, %Event{}} <- Events.delete_event(event) do
      send_resp(conn, :no_content, "")
    end
  end
end
