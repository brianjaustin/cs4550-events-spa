defmodule EventsServer.Events do
  @moduledoc """
  The Events context.
  """

  import Ecto.Query, warn: false
  alias EventsServer.Repo

  alias EventsServer.Events.Event
  alias EventsServer.Events.EventParticipant

  @doc """
  Returns the list of events.

  ## Examples

      iex> list_events()
      [%Event{}, ...]

  """
  def list_events do
    Repo.all(Event)
  end

  @doc """
  Gets a single event.

  Raises `Ecto.NoResultsError` if the Event does not exist.

  ## Examples

      iex> get_event!(123)
      %Event{}

      iex> get_event!(456)
      ** (Ecto.NoResultsError)

  """
  def get_event!(id), do: Repo.get!(Event, id)

  @doc """
  Creates a event.

  ## Examples

      iex> create_event(%{field: value})
      {:ok, %Event{}}

      iex> create_event(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_event(attrs \\ %{}) do
    result = %Event{}
    |> Event.changeset(attrs)
    |> Repo.insert()

    case result do
      {:ok, event} ->
        set_event_participants(attrs, event)
        {:ok, get_event!(event.id)}
      _ ->
        result
    end
  end

  @doc """
  Updates a event.

  ## Examples

      iex> update_event(event, %{field: new_value})
      {:ok, %Event{}}

      iex> update_event(event, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_event(%Event{} = event, attrs) do
    result = event
    |> Event.changeset(attrs)
    |> Repo.update()

    case result do
      {:ok, event} ->
        set_event_participants(attrs, event)
        {:ok, get_event!(event.id)}
      _ ->
        result
    end
  end

  @doc """
  Deletes a event.

  ## Examples

      iex> delete_event(event)
      {:ok, %Event{}}

      iex> delete_event(event)
      {:error, %Ecto.Changeset{}}

  """
  def delete_event(%Event{} = event) do
    Repo.delete(event)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking event changes.

  ## Examples

      iex> change_event(event)
      %Ecto.Changeset{data: %Event{}}

  """
  def change_event(%Event{} = event, attrs \\ %{}) do
    Event.changeset(event, attrs)
  end

  @doc """
  Gets a single event_participant.

  Raises `Ecto.NoResultsError` if the Event participant does not exist.

  ## Examples

      iex> get_event_participant!(123)
      %EventParticipant{}

      iex> get_event_participant!(456)
      ** (Ecto.NoResultsError)

  """
  def get_event_participant!(id), do: Repo.get!(EventParticipant, id)

  @doc """
  Creates a event_participant.

  ## Examples

      iex> create_event_participant(%{field: value})
      {:ok, %EventParticipant{}}

      iex> create_event_participant(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_event_participant(attrs \\ %{}) do
    %EventParticipant{}
    |> EventParticipant.changeset(attrs)
    |> Repo.insert(on_conflict: :nothing)
  end

  defp set_event_participants(attrs, event) do
    emails = (attrs["participants"] || attrs[:participants] || [])

    emails
    |> Enum.map(&create_event_participant(%{event_id: event.id, email: &1}))

    # Cleanup
    Repo.delete_all(from p in EventParticipant,
      where: p.event_id == ^event.id and p.email not in ^emails)
  end

  @doc """
  Updates a event_participant.

  ## Examples

      iex> update_event_participant(event_participant, %{field: new_value})
      {:ok, %EventParticipant{}}

      iex> update_event_participant(event_participant, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_event_participant(%EventParticipant{} = event_participant, attrs) do
    event_participant
    |> EventParticipant.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a event_participant.

  ## Examples

      iex> delete_event_participant(event_participant)
      {:ok, %EventParticipant{}}

      iex> delete_event_participant(event_participant)
      {:error, %Ecto.Changeset{}}

  """
  def delete_event_participant(%EventParticipant{} = event_participant) do
    Repo.delete(event_participant)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking event_participant changes.

  ## Examples

      iex> change_event_participant(event_participant)
      %Ecto.Changeset{data: %EventParticipant{}}

  """
  def change_event_participant(%EventParticipant{} = event_participant, attrs \\ %{}) do
    EventParticipant.changeset(event_participant, attrs)
  end
end
