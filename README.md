# Trade Tracker

Simple trade tracking service with a FastAPI backend and static dashboard.

## Planned Tech Stack
The project is evolving toward a modern stack that supports option strategy analytics and richer workflows:

- **Frontend:** TypeScript + React (Next.js)
- **Backend API:** Python (FastAPI)
- **Authentication:** Clerk
- **Database & File Storage:** Supabase (PostgreSQL and object storage)
- **Background Tasks:** Celery with Redis
- **Analytics:** NumPy, Pandas, and custom option‑pricing modules

These components will enable tracking multi‑leg option strategies, computing performance metrics, and storing trade journals with screenshots.

## Database Schema
The application uses a `trades` table with the following columns:

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| symbol | TEXT | Asset symbol |
| side | TEXT | `buy` or `sell` |
| qty | REAL | Quantity traded |
| entry_price | REAL | Entry price |
| entry_time | TEXT | Entry timestamp |
| exit_price | REAL | Exit price |
| exit_time | TEXT | Exit timestamp |
| fees | REAL | Fees paid |
| tags | TEXT | Comma separated tags |
| notes | TEXT | Additional notes |

## API
- `POST /trades` – create a trade
- `GET /trades` – list trades
- `PUT /trades/:id` – update a trade
- `DELETE /trades/:id` – remove a trade

## Authentication
The backend uses Clerk to validate requests. Every `/trades` endpoint requires
an `Authorization: Bearer <token>` header containing a valid Clerk session
token.

### Environment variables
The FastAPI service reads the following variables:

| Variable | Description |
|----------|-------------|
| `CLERK_SECRET_KEY` | Backend API key used to verify session tokens |
| `CLERK_PUBLISHABLE_KEY` | Frontend key used by the client to obtain tokens |

Export them before running the server:

```
export CLERK_SECRET_KEY=sk_test_...
export CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Development
### Backend (FastAPI)
Install dependencies and start the API server:
```
pip install fastapi uvicorn
uvicorn backend.app.main:app --reload
```

### Background Worker
Install Celery and run the worker (requires a running Redis instance). The
connection is configurable via the `CELERY_BROKER_URL` and
`CELERY_RESULT_BACKEND` environment variables (defaults to
`redis://localhost:6379/0`):
```
pip install celery redis
celery -A backend.celery.celery_app worker --loglevel=info
```

Trigger analytics recalculation through the API:
```
curl -X POST http://localhost:8000/analytics/recalculate
```

### Frontend
```
npm install
npm start
```

Run tests:
```
npm test
```
