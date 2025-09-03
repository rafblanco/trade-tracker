from fastapi import FastAPI, HTTPException
from typing import List

from .db import create_trade, get_trades, update_trade, delete_trade, init_db
from .models import Trade

app = FastAPI()

@app.on_event("startup")
async def startup_event() -> None:
    await init_db()

@app.post("/trades", response_model=int)
async def create_trade_route(trade: Trade) -> int:
    return await create_trade(trade.dict())

@app.get("/trades", response_model=List[Trade])
async def get_trades_route() -> List[Trade]:
    records = await get_trades()
    return [Trade(**dict(record)) for record in records]

@app.put("/trades/{trade_id}")
async def update_trade_route(trade_id: int, trade: Trade) -> None:
    if trade_id != trade.id:
        raise HTTPException(status_code=400, detail="Trade ID mismatch")
    await update_trade(trade_id, trade.dict())

@app.delete("/trades/{trade_id}")
async def delete_trade_route(trade_id: int) -> None:
    await delete_trade(trade_id)
