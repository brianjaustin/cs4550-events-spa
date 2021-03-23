# cs4550-events-spa

## Design Notes
* The phoenix scaffolding page for users is not included in the React version
of this application.
* In contrast to the server-side version of this application, timezones are
supported. The database stores everything in UTC, conversion happens in the
frontend.
* Also differently than the previous version, participants are included as
a comma-separated input at event creation/edit. Validation for this happens
in the browser to prevent sending bad data to the API.

## Scaling Notes
* In order to help find events without links, the index page shows a list of
all events. This won't scale well, so should be changed to paginate if this
application needs to support a large number of users.
* Participants also should be paginated if a large number is expected to
improve performance.

## Other Notes
* A different date/time picker is used on this assignment than for the
server-side version. This is due to problems encountered with the React
version of Flatpickr.
* The application handles API errors from form submissions (i.e. registering
an already-registered email). However, it does not necessarily display all
possible server-side errors (401, 500, etc.) as cleanly.
* Redirects away from pages that require a specific user may happen after the
UI loads, as the data required to determine access rights is fetched
asynchronously from the server.
