defmodule EventsServerWeb.SessionController do
  use EventsServerWeb, :controller

  alias EventsServer.Users

  action_fallback EventsServerWeb.FallbackController

  def create(conn, %{"email" => email, "password" => password}) do
    with user when user != nil <- Users.get_by_email(email),
         {:ok, _} <- Users.valid_login?(user, password) do
      token = Phoenix.Token.sign(conn, "user_id", user.id)
      render(conn, "show.json", token: token)
    else
      _ -> {:error, :unauthorized}
    end
  end
end
