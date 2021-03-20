defmodule EventsServer.Events.Event do
  use Ecto.Schema
  import Ecto.Changeset

  alias EventsServer.Users.User

  schema "events" do
    field :date, :utc_datetime
    field :description, :string
    field :name, :string
    belongs_to :organizer, User

    timestamps()
  end

  @doc false
  def changeset(event, attrs) do
    event
    |> cast(attrs, [:name, :date, :description, :organizer_id])
    |> validate_required([:name, :date, :organizer_id])
  end
end
