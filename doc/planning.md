# options

1. people log in with notion, session details are stored on their local computer and they exist, we'll use those and not ask them to log in
2. we store all details and settings in a database (Firebase)

## user flow

- if they don't
  - link to the template and ask them to clone it
  - log in and give the app access to that newly-cloned page
  - no need to select what fields are which, it uses defaults.
    - could still show screen but fields are auto-filled
- if they already have a tasks tracker
  - log in with notion account
  - select epics database and tasks database
    - if they don't have epics db, suggest they make one (allow them to clone subset of Victoria's template)
  - select what the "epic" field is in tasks database
- view dashboard

## where is data stored

    - access token, pages, etc - Firebase
        - I downloaded the Service Account private key from Firebase, base64 encoded it, and added as an environment variable (.env for local development)
    - what to show on page (graph, chart, etc) - Notion

## fields in the "tasks" databases

- "Epic(s)" - required, but user could select the one that matches their name
- start date/due date (required for pi chart)

## fields in the "epics" databases

- bar/pie checkboxes
- color (can be easily made optional if field doesn't exist in database)

## firebase db structure

- users:
  - notion access token stuff

- pages

    -
