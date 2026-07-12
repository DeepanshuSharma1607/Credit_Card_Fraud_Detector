# Fraud Gazette — Frontend

A React + Vite frontend for the existing FastAPI credit-card-fraud backend
(`src/`). Styled to the "Newsprint" design system: a two-page app — a case
intake form that returns an instant verdict, and a ledger of every past
prediction.

This folder is fully self-contained and does not modify anything under the
project's existing `src/` backend.

## Stack

- React 19 + Vite 8
- Tailwind CSS v4 (CSS-first config, see `src/index.css` `@theme` block)
- react-router-dom (client-side routing between `/` and `/ledger`)
- axios

## Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## How it talks to the backend

The backend (`src/backend/__init__.py`) mounts its router at:

```
/api/v1/prediction
```

with two endpoints (`src/backend/routes.py`):

| Method | Path       | Purpose                                   |
| ------ | ---------- | ------------------------------------------ |
| GET    | `/`        | List every past prediction                 |
| POST   | `/predict` | Score a transaction and persist the result |

The frontend calls these as **relative paths** (`/api/v1/prediction/...`),
never an absolute `http://localhost:8000/...` URL. In dev, `vite.config.js`
proxies `/api/*` to the backend (default `http://127.0.0.1:8000`, override
with `VITE_BACKEND_ORIGIN` in `.env`). This means the browser never makes a
cross-origin request during development, so the backend's lack of CORS
middleware never becomes a blocker locally.

**For production**, since the backend `src/` folder can't be modified, either:
- Serve `frontend/dist` behind the same reverse proxy / domain as the API
  (e.g. an nginx rule forwarding `/api/*` to the FastAPI process), or
- Add `CORSMiddleware` to the backend yourself if it must live on a
  different origin:
  ```python
  from fastapi.middleware.cors import CORSMiddleware
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["https://your-frontend-domain"],
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

## Request/response contract (`src/backend/schemas.py`)

**POST `/predict`** body (`CreateCreditCardDetails`):

```json
{
  "trans_date_trans_time": "2026-07-12T14:30:00",
  "category": "gas_transport",
  "amt": 250.75,
  "gender": "F",
  "city_pop": 48000,
  "job": "Academic librarian",
  "dob": "1990-05-01",
  "dist": 12.5
}
```

**Response** (`Predictions`, also the shape of every item from `GET /`):

```json
{
  "uid": "72c18bd5-4913-4793-86ba-ce2ea9b96a54",
  "trans_date_trans_time": "2026-07-12T14:30:00",
  "category": "gas_transport",
  "amt": 250.75,
  "gender": "F",
  "city_pop": 48000,
  "job": "Academic librarian",
  "dob": "1990-05-01",
  "dist": 12.5,
  "is_fraud": false,
  "fraud_probability": 0.0000401
}
```

## Backend behaviors this frontend was built around

These were found by reading `src/backend/prediction.py` and `service.py`,
and confirmed by running the backend locally against this frontend:

1. **`trans_date_trans_time` must be a naive datetime (no timezone).**
   `prediction.py` computes `age = (trans_time - dob).days // 365`. If
   `trans_date_trans_time` is sent as timezone-aware (e.g. ending in `Z` or
   `+00:00`) while `dob` is naive, pandas raises
   `TypeError: Cannot subtract tz-naive and tz-aware datetime-like objects`
   and the endpoint returns a 500. `PredictionForm.jsx` deliberately sends
   the raw `<input type="datetime-local">` value (already naive) rather
   than `Date.prototype.toISOString()` (which appends `Z`).

2. **`gender` only accepts `"F"` or `"M"`.** The backend runs it through a
   scikit-learn `LabelEncoder` fit only on those two labels
   (`fraud_model_1.pkl`); anything else throws server-side
   (`y contains previously unseen labels`) rather than failing validation.
   The form's gender field is a closed select, not free text.

3. **`category` and `job` are frequency-encoded against fixed lookup
   tables** baked into the pickle. Pydantic's schema accepts any string for
   these, but a value the model has never seen silently gets a frequency of
   0, degrading the prediction without an error. `src/data/options.js` and
   `src/data/jobs_raw.json` enumerate the exact 14 categories and 494 job
   titles the model recognizes (extracted directly from the pickle's
   `cat_freq_map` / `job_freq_map`), and the form only lets you pick from
   those.

4. **No authentication.** Neither endpoint requires a token or session, so
   the frontend doesn't implement any auth flow.

5. **`GET /` returns rows in whatever order the database gives them** (no
   `ORDER BY` in `service.py`). The ledger page sorts client-side by
   `trans_date_trans_time` descending.

## Project structure

```
frontend/
├── src/
│   ├── api/              # axios client + typed calls to the 2 endpoints
│   ├── components/       # Masthead, forms, verdict card, ledger table, etc.
│   ├── data/              # options.js + jobs_raw.json (extracted from the model pickle)
│   ├── pages/             # NewCasePage ("/"), LedgerPage ("/ledger")
│   ├── utils/             # currency/date/percent formatting
│   ├── App.jsx             # routes + layout
│   └── index.css           # Tailwind v4 theme tokens (Newsprint design system)
├── vite.config.js          # Tailwind plugin + /api dev proxy
└── .env                     # VITE_BACKEND_ORIGIN (dev proxy target only)
```

## Notes

- Every screen was tested end-to-end against a locally running instance of
  the provided backend (SQLite swapped in for Postgres only for this local
  test — the backend `src/` itself was never modified).
- Field-level validation lives in `PredictionForm.jsx` (required fields,
  positive amount, positive integer population, non-negative distance, dob
  before transaction date) as a first line of defense; server errors are
  still surfaced via `ErrorBanner` for anything the backend itself rejects.
