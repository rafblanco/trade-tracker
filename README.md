# Trade Tracker

Simple trade tracking service with a tiny Node.js backend and static dashboard.

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
