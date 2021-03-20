defmodule EventsServerWeb.EventControllerTest do
  use EventsServerWeb.ConnCase

  alias EventsServer.Events
  alias EventsServer.Events.Event
  alias EventsServer.Repo
  alias EventsServer.Users

  @create_attrs %{
    date: "2010-04-17T14:00:00Z",
    description: "some description",
    name: "some name"
  }
  @update_attrs %{
    date: "2011-05-18T15:01:01Z",
    description: "some updated description",
    name: "some updated name"
  }
  @invalid_attrs %{date: nil, description: nil, name: nil}

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
    {:ok, event} = @create_attrs
    |> Map.put(:organizer_id, user.id)
    |> Events.create_event()
    event
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all events", %{conn: conn} do
      conn = get(conn, Routes.event_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create event" do
    setup [:create_user, :set_session]

    test "renders event when data is valid", %{conn: conn} do
      conn = post(conn, Routes.event_path(conn, :create), event: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.event_path(conn, :show, id))

      assert %{
               "id" => ^id,
               "date" => "2010-04-17T14:00:00Z",
               "description" => "some description",
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.event_path(conn, :create), event: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update event" do
    setup [:create_event, :set_session]

    test "renders event when data is valid", %{conn: conn, event: %Event{id: id} = event} do
      conn = put(conn, Routes.event_path(conn, :update, event), event: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.event_path(conn, :show, id))

      assert %{
               "id" => ^id,
               "date" => "2011-05-18T15:01:01Z",
               "description" => "some updated description",
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, event: event} do
      conn = put(conn, Routes.event_path(conn, :update, event), event: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete event" do
    setup [:create_event, :set_session]

    test "deletes chosen event", %{conn: conn, event: event} do
      conn = delete(conn, Routes.event_path(conn, :delete, event))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.event_path(conn, :show, event))
      end
    end
  end

  defp create_event(_) do
    event = fixture(:event)
    |> Repo.preload(:organizer)
    %{event: event, user: event.organizer}
  end

  defp create_user(_) do
    user = fixture(:user)
    %{user: user}
  end

  defp set_session(%{conn: conn, user: user}) do
    conn = put_private(conn, :phoenix_endpoint, EventsServerWeb.Endpoint)
    token = Phoenix.Token.sign(conn, "user_id", user.id)
    conn = put_req_header(conn, "x-auth", token)
    %{conn: conn}
  end
end
