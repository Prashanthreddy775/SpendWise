# SpendWise

A beginner-friendly student expense tracker built with React, Vite, Express, and MongoDB. The first version supports expense CRUD, category and month summaries, title search, and category/month filters.

## Requirements

- Node.js 18 or later
- npm
- A MongoDB Atlas connection string for database-backed features

## Set up and run

1. Open a terminal in the project folder and run `cd server`, then `npm install`.
2. In another terminal, run `cd client`, then `npm install`.
3. Copy `server/.env.example` to `server/.env` and replace the sample `MONGODB_URI` with your Atlas connection string.
4. In the server terminal, run `npm run dev`.
5. In the client terminal, run `npm run dev` and open the Vite URL, usually `http://localhost:5173`.

The API health check is at `http://localhost:5000/api/health`. MongoDB-backed routes are under `/api/expenses`.

## Configuration

`server/.env` uses these values:

```text
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_atlas_connection_string
```

The dashboard currently formats amounts as Indian rupees (INR), based on the example amounts in the project requirements. Change the currency in `client/src/App.jsx` if your project uses another currency.

Never commit `server/.env`; `.gitignore` excludes it. The checked-in `server/.env.example` contains only a placeholder.

## Before deployment

- Deploy the Express server and set `MONGODB_URI`, `PORT`, and `CLIENT_URL` in the host's environment settings.
- Deploy the Vite client and set `VITE_API_URL` to the deployed server origin.
- Check that `/api/health` responds and verify creating, editing, deleting, filtering, and dashboard totals against the deployed database.

## Verify the MVP

- Add an expense with each required field and confirm it appears in the list and summaries.
- Try an empty title, zero/negative amount, missing category, and invalid date.
- Edit an expense and delete one after confirming the prompt.
- Search by title; filter by category and month; clear each filter.
- Check the empty state, no-match state, API-offline message, and the layout at a narrow mobile width.