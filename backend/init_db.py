import asyncio
from pathlib import Path

from .db import init_db

async def run() -> None:
    pool = await init_db()
    schema_path = Path(__file__).resolve().parent.parent / "schema.sql"
    with open(schema_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    async with pool.acquire() as conn:
        await conn.execute(schema_sql)

if __name__ == "__main__":
    asyncio.run(run())
