# Trade Tracker

Simple trade tracking service with a tiny Node.js backend and static dashboard.

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

## Development
```
npm install  # no external dependencies
npm start    # start server at http://localhost:3000
```

Run tests:
```
npm test
```
