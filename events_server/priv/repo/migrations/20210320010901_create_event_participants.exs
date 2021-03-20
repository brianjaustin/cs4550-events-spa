defmodule EventsServer.Repo.Migrations.CreateEventParticipants do
  use Ecto.Migration

  def change do
    create table(:event_participants) do
      add :email, :string, null: false
      add :status, :string, null: false, default: "unknown"
      add :comments, :text
      add :event_id, references(:events, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:event_participants, [:event_id])
    create unique_index(:event_participants, [:email, :event_id])
  end
end
