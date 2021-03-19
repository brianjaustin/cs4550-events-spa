defmodule EventsServer.Repo do
  use Ecto.Repo,
    otp_app: :events_server,
    adapter: Ecto.Adapters.Postgres
end
