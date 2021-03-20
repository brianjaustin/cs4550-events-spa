defmodule EventsServerWeb.UserControllerTest do
  use EventsServerWeb.ConnCase

  alias EventsServer.Users
  alias EventsServer.Users.User

  @create_attrs %{
    email: "some@email.com",
    name: "some name",
    password: "some password_hash"
  }
  @update_attrs %{
    email: "some_updated@email.net",
    name: "some updated name"
  }
  @invalid_attrs %{email: nil, name: nil}

  def fixture(:user) do
    {:ok, user} = Users.create_user(@create_attrs)
    user
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "create user" do
    test "renders user when data is valid", %{conn: conn} do
      conn = post(conn, Routes.user_path(conn, :create), user: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.user_path(conn, :show, id))

      assert %{
               "id" => ^id,
               "email" => "some@email.com",
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.user_path(conn, :create), user: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update user" do
    setup [:create_user, :set_session]

    test "renders user when data is valid", %{conn: conn, user: %User{id: id} = user} do
      conn = put(conn, Routes.user_path(conn, :update, user), user: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.user_path(conn, :show, id))

      assert %{
               "id" => ^id,
               "email" => "some_updated@email.net",
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]

      assert Users.get_user!(id).password_hash == user.password_hash
    end

    test "updates password when specified", %{conn: conn, user: %User{id: id} = user} do
      attrs = @update_attrs
      |> Map.put(:password, "my_super_strong_pass")
      conn = put(conn, Routes.user_path(conn, :update, user), user: attrs)
      assert %{"id" => ^id} = json_response(conn , 200)["data"]

      conn = get(conn, Routes.user_path(conn, :show, id))

      assert %{
               "id" => ^id,
               "email" => "some_updated@email.net",
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]

      refute Users.get_user!(id).password_hash == user.password_hash
    end

    test "renders errors when data is invalid", %{conn: conn, user: user} do
      conn = put(conn, Routes.user_path(conn, :update, user), user: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
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
