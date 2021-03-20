defmodule EventsServerWeb.EventParticipantController do
  use EventsServerWeb, :controller

  alias EventsServer.Events
  alias EventsServer.Events.EventParticipant
  alias EventsServer.Repo

  action_fallback EventsServerWeb.FallbackController

  plug EventsServerWeb.Plugs.RequireToken when action in [
    :update, :delete
  ]

  plug :fetch_participant when action in [
    :show, :update, :delete
  ]
  plug :check_user when action in [
    :update, :delete
  ]

  def fetch_participant(conn, _params) do
    id = conn.params["id"]
    participant = Events.get_event_participant!(id)
    assign(conn, :participant, participant)
  end

  def check_user(conn, _params) do
    participant = conn.assigns[:participant]
    |> Repo.preload(event: :organizer)

    current_user = conn.assigns[:current_user]

    cond do
      participant.event.organizer.id == current_user.id ->
        conn
      participant.email == current_user.email ->
        conn
      true ->
        conn
        |> put_status(:unauthorized)
        |> put_view(EventsServerWeb.ErrorView)
        |> render("unauthorized.json")
        |> halt()
    end
  end

  def show(conn, %{"id" => _id}) do
    event_participant = conn.assigns[:participant]
    render(conn, "show.json", event_participant: event_participant)
  end

  def update(conn, %{"id" => _id, "event_participant" => event_participant_params}) do
    event_participant = conn.assigns[:participant]

    with {:ok, %EventParticipant{} = event_participant} <- Events.update_event_participant(event_participant, event_participant_params) do
      render(conn, "show.json", event_participant: event_participant)
    end
  end

  def delete(conn, %{"id" => _id}) do
    event_participant = conn.assigns[:participant]

    with {:ok, %EventParticipant{}} <- Events.delete_event_participant(event_participant) do
      send_resp(conn, :no_content, "")
    end
  end
end
