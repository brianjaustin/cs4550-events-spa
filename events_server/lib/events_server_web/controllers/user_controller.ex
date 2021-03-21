defmodule EventsServerWeb.UserController do
  use EventsServerWeb, :controller

  alias EventsServer.Users
  alias EventsServer.Users.User

  action_fallback EventsServerWeb.FallbackController

  plug EventsServerWeb.Plugs.RequireToken when action in [
    :update
  ]

  plug :require_self when action in [
    :update
  ]

  def require_self(conn, _args) do
    id = conn.params["id"]
    current_user = conn.assigns[:current_user]

    if "#{current_user.id}" == id do
      conn
    else
      conn
      |> put_status(:unauthorized)
      |> put_view(EventsServerWeb.ErrorView)
      |> render("unauthorized.json")
      |> halt()
    end
  end

  def create(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- Users.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_path(conn, :show, user))
      |> render("show.json", user: user)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)

    if not blank?(Map.get(user_params, "password")) do
      with {:ok, %User{} = user} <- Users.update_password(user, user_params) do
        with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
          render(conn, "show.json", user: user)
        end
      end
    else
      with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
        render(conn, "show.json", user: user)
      end
    end
  end

  defp blank?(nil), do: true
  defp blank?(""), do: true
  defp blank?(_), do: false
end
