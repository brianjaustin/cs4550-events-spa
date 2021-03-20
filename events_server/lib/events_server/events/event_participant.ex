defmodule EventsServer.Events.EventParticipant do
  use Ecto.Schema
  import Ecto.Changeset

  alias EventsServer.Events.Event

  schema "event_participants" do
    field :comments, :string
    field :email, :string
    field :status, Ecto.Enum, values: [:yes, :maybe, :no, :unknown]
    belongs_to :event, Event

    timestamps()
  end

  @doc false
  def changeset(event_participant, attrs) do
    event_participant
    |> cast(attrs, [:email, :status, :comments, :event_id])
    |> validate_required([:email, :event_id])
    # Python Regex from http://emailregex.com/
    |> validate_format(:email, ~r/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
    |> unique_constraint([:event_id, :email],
      name: :event_participants_email_event_id_index,
      message: "Already invited to event")
  end
end
