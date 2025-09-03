import os
import asyncpg
from typing import Any, Dict, List

_pool: asyncpg.Pool | None = None

async def init_db() -> asyncpg.Pool:
    """Initialize the database connection pool using Supabase credentials."""
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            user=os.getenv("SUPABASE_DB_USER"),
            password=os.getenv("SUPABASE_DB_PASSWORD"),
            host=os.getenv("SUPABASE_DB_HOST"),
            port=int(os.getenv("SUPABASE_DB_PORT", "5432")),
            database=os.getenv("SUPABASE_DB_NAME"),
        )
    return _pool

async def create_trade(trade: Dict[str, Any]) -> int:
    pool = await init_db()
    query = (
        "INSERT INTO trades (id, symbol, side, qty, entry_price, entry_time, "
        "exit_price, exit_time, fees, tags, notes, legs, attachment_url)"
        " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id"
    )
    async with pool.acquire() as conn:
        return await conn.fetchval(
            query,
            trade.get("id"),
            trade["symbol"],
            trade["side"],
            trade["qty"],
            trade["entry_price"],
            trade["entry_time"],
            trade.get("exit_price"),
            trade.get("exit_time"),
            trade.get("fees"),
            trade.get("tags"),
            trade.get("notes"),
            trade.get("legs"),
            trade.get("attachment_url"),
        )

async def get_trades() -> List[asyncpg.Record]:
    pool = await init_db()
    async with pool.acquire() as conn:
        return await conn.fetch("SELECT * FROM trades ORDER BY id")

async def update_trade(trade_id: int, trade: Dict[str, Any]) -> None:
    pool = await init_db()
    query = (
        "UPDATE trades SET symbol=$1, side=$2, qty=$3, entry_price=$4, entry_time=$5,"
        " exit_price=$6, exit_time=$7, fees=$8, tags=$9, notes=$10, legs=$11, attachment_url=$12 WHERE id=$13"
    )
    async with pool.acquire() as conn:
        await conn.execute(
            query,
            trade["symbol"],
            trade["side"],
            trade["qty"],
            trade["entry_price"],
            trade["entry_time"],
            trade.get("exit_price"),
            trade.get("exit_time"),
            trade.get("fees"),
            trade.get("tags"),
            trade.get("notes"),
            trade.get("legs"),
            trade.get("attachment_url"),
            trade_id,
        )

async def delete_trade(trade_id: int) -> None:
    pool = await init_db()
    async with pool.acquire() as conn:
        await conn.execute("DELETE FROM trades WHERE id=$1", trade_id)
