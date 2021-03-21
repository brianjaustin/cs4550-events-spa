defmodule EventsServerWeb.SessionView do
  use EventsServerWeb, :view

  def render("show.json", %{token: token, user_id: user_id}) do
    %{token: token, user_id: user_id}
  end
end
