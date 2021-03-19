defmodule EventsServerWeb.PageController do
  use EventsServerWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
