defmodule EventsServerWeb.SessionControllerTest do
  use EventsServerWeb.ConnCase

  alias EventsServer.Users

  def fixture(:user) do
    {:ok, user} = 
      %{email: "some@email.com", name: "some name", password: "some password_hash"}
      |> Users.create_user()
    user
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "create session" do
    setup [:create_user]

    test "renders token when data is valid", %{conn: conn, user: user} do
      conn = post(conn, Routes.session_path(conn, :create),
        email: user.email, password: "some password_hash")
  
      assert %{"token" => token} = json_response(conn, 200)
      assert token
    end

    test "renders unauthorized when password is invalid", %{conn: conn, user: user} do
      conn = post(conn, Routes.session_path(conn, :create),
        email: user.email, password: "some bad password")
      assert json_response(conn, 401)
    end

    test "renders unauthorized when email is invalid", %{conn: conn} do
      conn = post(conn, Routes.session_path(conn, :create),
        email: "bad", password: "some password_hash")
      assert json_response(conn, 401)
    end
  end

  defp create_user(_) do
    user = fixture(:user)
    %{user: user}
  end
end
