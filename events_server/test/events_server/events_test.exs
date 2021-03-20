defmodule EventsServer.EventsTest do
  use EventsServer.DataCase

  alias EventsServer.Events
  alias EventsServer.Users

  describe "events" do
    alias EventsServer.Events.Event

    @valid_attrs %{date: "2010-04-17T14:00:00Z", description: "some description", name: "some name"}
    @update_attrs %{date: "2011-05-18T15:01:01Z", description: "some updated description", name: "some updated name"}
    @invalid_attrs %{date: nil, description: nil, name: nil}

    def user_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(%{email: "some@email.com", name: "some name", password: "some password_hash"})
        |> Users.create_user()

      user
    end

    def event_fixture(attrs \\ %{}) do
      user = user_fixture()

      {:ok, event} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Map.put(:organizer_id, user.id)
        |> Events.create_event()

      event
    end

    test "list_events/0 returns all events" do
      event = event_fixture()
      assert Events.list_events() == [event]
    end

    test "get_event!/1 returns the event with given id" do
      event = event_fixture()
      assert Events.get_event!(event.id) == event
    end

    test "create_event/1 with valid data creates a event" do
      user = user_fixture()
      assert {:ok, %Event{} = event} = @valid_attrs
      |> Map.put(:organizer_id, user.id)
      |> Events.create_event()
      assert event.date == DateTime.from_naive!(~N[2010-04-17T14:00:00Z], "Etc/UTC")
      assert event.description == "some description"
      assert event.name == "some name"
    end

    test "create_event/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Events.create_event(@invalid_attrs)
    end

    test "update_event/2 with valid data updates the event" do
      event = event_fixture()
      assert {:ok, %Event{} = event} = Events.update_event(event, @update_attrs)
      assert event.date == DateTime.from_naive!(~N[2011-05-18T15:01:01Z], "Etc/UTC")
      assert event.description == "some updated description"
      assert event.name == "some updated name"
    end

    test "update_event/2 with invalid data returns error changeset" do
      event = event_fixture()
      assert {:error, %Ecto.Changeset{}} = Events.update_event(event, @invalid_attrs)
      assert event == Events.get_event!(event.id)
    end

    test "delete_event/1 deletes the event" do
      event = event_fixture()
      assert {:ok, %Event{}} = Events.delete_event(event)
      assert_raise Ecto.NoResultsError, fn -> Events.get_event!(event.id) end
    end

    test "change_event/1 returns a event changeset" do
      event = event_fixture()
      assert %Ecto.Changeset{} = Events.change_event(event)
    end
  end
end
