defmodule EventsServer.Users.User do
  @moduledoc """
  Module for interacting with users in the database.

  ## Attribution

    Password security is based on the recommendations in
    * https://github.com/riverrun/comeonin/wiki/Hashing-passwords
    * https://github.com/riverrun/phauxth-example/blob/master/lib/forks_the_egg_sample/accounts/user.ex
    and demonstrations shown in lectures.
  """

  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string
    field :password, :string, virtual: true, redact: true
    field :password_hash, :string, redact: true

    timestamps()
  end

  @doc """
  Generic changeset for updating users without updating a user's
  password. Creating users with passwords should use the `create_changeset/2`
  function below, and changing passwords should use
  `update_password_changeset/2`.
  
  ## Arguments

    - user: existing user struct to update
    - attrs: map of attributes (name and/or email) to update
  """
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :name])
    |> validate_required([:email, :name])
    |> validate_email()
  end

  @doc """
  Changeset for creating a user. This means email, name, and
  password will all be set. Updating a user's information should
  be done with the regular `changeset/2` function and changin a user's
  password should be done via `update_password_changeset/2`.

  ## Arguments

    - user: should be an empty user struct `%User{}`
    - attrs: map of attributes to use for creating the user;
             must include email, name, and password
  """
  def create_changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :name, :password])
    |> validate_required([:email, :name, :password])
    |> validate_email()
    |> validate_password(:password)
    |> put_pass_hash()
  end

  @doc """
  Changeset for updating a user's password. Any other information will
  be discarded; to update this, use the regular `changeset/2` function.

  ## Arguments

    - user: exising user whose password should be updated
    - attrs: map of attributes containing the user's new password
  """
  def update_password_changeset(user, attrs) do
    user
    |> cast(attrs, [:password])
    |> validate_required([:password])
    |> validate_password(:password)
    |> put_pass_hash()
  end

  defp validate_email(changeset) do
    changeset
    # Python Regex from http://emailregex.com/
    |> validate_format(:email, ~r/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
    |> unique_constraint(:email)
  end

  defp validate_password(changeset, field) do
    validate_change(changeset, field, fn _, password -> 
      case NotQwerty123.PasswordStrength.strong_password?(password, min_length: 10) do
        {:ok, _} -> []
        {:error, msg} -> [{field, msg}]
      end
    end)
  end

  defp put_pass_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    changeset
    |> change(Argon2.add_hash(password))
    |> change(%{password: nil})
  end

  defp put_pass_hash(changeset), do: changeset
end
