from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Generator
import sqlite3
from pathlib import Path
import uvicorn

from .auth import require_auth
from backend.analytics.metrics import compute_trade_metrics


ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / "trades.db"
SCHEMA_PATH = ROOT / "schema.sql"

app = FastAPI()

def init_db() -> None:
    with sqlite3.connect(DB_PATH) as conn:
        with open(SCHEMA_PATH) as f:
            conn.executescript(f.read())
        conn.commit()

def get_db() -> Generator[sqlite3.Connection, None, None]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

@app.on_event("startup")
def on_startup() -> None:
    init_db()

class TradeBase(BaseModel):
    symbol: str
    side: str
    qty: float
    entry_price: float
    entry_time: str
    exit_price: Optional[float] = None
    exit_time: Optional[str] = None
    fees: Optional[float] = None
    tags: Optional[str] = None
    notes: Optional[str] = None

class TradeCreate(TradeBase):
    pass

class TradeUpdate(BaseModel):
    symbol: Optional[str] = None
    side: Optional[str] = None
    qty: Optional[float] = None
    entry_price: Optional[float] = None
    entry_time: Optional[str] = None
    exit_price: Optional[float] = None
    exit_time: Optional[str] = None
    fees: Optional[float] = None
    tags: Optional[str] = None
    notes: Optional[str] = None

class Trade(TradeBase):
    id: int

@app.get("/trades", response_model=List[Trade], dependencies=[Depends(require_auth)])
def list_trades(db: sqlite3.Connection = Depends(get_db)) -> List[Trade]:
    rows = db.execute("SELECT * FROM trades").fetchall()
    return [Trade(**dict(row)) for row in rows]

@app.post(
    "/trades",
    response_model=Trade,
    status_code=201,
    dependencies=[Depends(require_auth)],
)
def create_trade(trade: TradeCreate, db: sqlite3.Connection = Depends(get_db)) -> Trade:
    cursor = db.execute(
        """
        INSERT INTO trades (symbol, side, qty, entry_price, entry_time, exit_price, exit_time, fees, tags, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            trade.symbol,
            trade.side,
            trade.qty,
            trade.entry_price,
            trade.entry_time,
            trade.exit_price,
            trade.exit_time,
            trade.fees,
            trade.tags,
            trade.notes,
        ),
    )
    db.commit()
    return Trade(id=cursor.lastrowid, **trade.dict())

@app.put(
    "/trades/{trade_id}",
    response_model=Trade,
    dependencies=[Depends(require_auth)],
)
def update_trade(
    trade_id: int, trade: TradeUpdate, db: sqlite3.Connection = Depends(get_db)
) -> Trade:
    existing = db.execute("SELECT * FROM trades WHERE id = ?", (trade_id,)).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Trade not found")
    data = {**dict(existing), **trade.dict(exclude_unset=True)}
    db.execute(
        """
        UPDATE trades SET symbol=?, side=?, qty=?, entry_price=?, entry_time=?, exit_price=?, exit_time=?, fees=?, tags=?, notes=?
        WHERE id=?
        """,
        (
            data["symbol"],
            data["side"],
            data["qty"],
            data["entry_price"],
            data["entry_time"],
            data.get("exit_price"),
            data.get("exit_time"),
            data.get("fees"),
            data.get("tags"),
            data.get("notes"),
            trade_id,
        ),
    )
    db.commit()
    updated = db.execute("SELECT * FROM trades WHERE id = ?", (trade_id,)).fetchone()
    return Trade(**dict(updated))



@app.get("/trades/{trade_id}/analytics")
def trade_analytics(trade_id: int, db: sqlite3.Connection = Depends(get_db)) -> dict:
    """Return computed analytics for a single trade."""
    trade = db.execute("SELECT * FROM trades WHERE id = ?", (trade_id,)).fetchone()
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    metrics = compute_trade_metrics(dict(trade))
    return metrics.to_dict()

@app.delete("/trades/{trade_id}", response_model=Trade)
def delete_trade(trade_id: int, db: sqlite3.Connection = Depends(get_db)) -> Trade:
    existing = db.execute("SELECT * FROM trades WHERE id = ?", (trade_id,)).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Trade not found")
    db.execute("DELETE FROM trades WHERE id = ?", (trade_id,))
    db.commit()
    return Trade(**dict(existing))

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
