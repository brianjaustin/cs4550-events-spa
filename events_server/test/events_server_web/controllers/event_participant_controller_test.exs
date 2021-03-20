defmodule EventsServerWeb.EventParticipantControllerTest do
  use EventsServerWeb.ConnCase

  alias EventsServer.Repo
  alias EventsServer.Users
  alias EventsServer.Events
  alias EventsServer.Events.EventParticipant

  @create_attrs %{
    comments: "some comments",
    email: "participant@email.com",
    status: "yes"
  }
  @update_attrs %{
    comments: "some updated comments",
    email: "uparticipant@email.com",
    status: "no"
  }
  @invalid_attrs %{comments: nil, email: nil, status: nil}

  def fixture(:user) do
    {:ok, user} = Users.create_user(%{
      email: "some@email.com",
      name: "some name",
      password: "some password_hash"
    })
    user
  end

  def fixture(:event) do
    user = fixture(:user)

    {:ok, event} = Events.create_event(%{
      date: "2010-04-17T14:00:00Z",
      description: "some description",
      name: "some name",
      organizer_id: user.id
    })
    event
  end

  def fixture(:event_participant) do
    event = fixture(:event)

    {:ok, event_participant} = @create_attrs
    |> Enum.into(%{event_id: event.id})
    |> Events.create_event_participant()
    event_participant
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "update event_participant" do
    setup [:create_event_participant, :set_session]

    test "renders event_participant when data is valid", %{conn: conn, event_participant: %EventParticipant{id: id} = event_participant} do
      conn = put(conn, Routes.event_participant_path(conn, :update, event_participant), event_participant: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.event_participant_path(conn, :show, id))

      assert %{
               "id" => ^id,
               "comments" => "some updated comments",
               "email" => "uparticipant@email.com",
               "status" => "no"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, event_participant: event_participant} do
      conn = put(conn, Routes.event_participant_path(conn, :update, event_participant), event_participant: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete event_participant" do
    setup [:create_event_participant, :set_session]

    test "deletes chosen event_participant", %{conn: conn, event_participant: event_participant} do
      conn = delete(conn, Routes.event_participant_path(conn, :delete, event_participant))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.event_participant_path(conn, :show, event_participant))
      end
    end
  end

  defp create_event_participant(_) do
    event_participant = fixture(:event_participant)
    |> Repo.preload(event: :organizer)
    %{event_participant: event_participant, user: event_participant.event.organizer}
  end

  defp set_session(%{conn: conn, user: user}) do
    conn = put_private(conn, :phoenix_endpoint, EventsServerWeb.Endpoint)
    token = Phoenix.Token.sign(conn, "user_id", user.id)
    conn = put_req_header(conn, "x-auth", token)
    %{conn: conn}
  end
end
