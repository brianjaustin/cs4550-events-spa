defmodule EventsServerWeb.SessionView do
  use EventsServerWeb, :view

  def render("show.json", %{token: token, user: user}) do
    %{token: token, user_id: user.id, user_email: user.email}
  end
end
