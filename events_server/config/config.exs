# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :events_server,
  ecto_repos: [EventsServer.Repo]

# Configures the endpoint
config :events_server, EventsServerWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "yAWbQ4hNr+FMwyRRDO0SHMTj6HT1j9lm92jy6ap3Bilic+jxnJdYnWEbIdBtK6qW",
  render_errors: [view: EventsServerWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: EventsServer.PubSub,
  live_view: [signing_salt: "fiDar6Wg"]

# Configures Argon2 hashing library (see
# https://github.com/riverrun/comeonin/wiki/Choosing-the-password-hashing-library#argon2)
config :argon2_elixir, t_cost: 2, m_cost: 8

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
