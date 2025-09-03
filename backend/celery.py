import os
import asyncio
from typing import Any, Dict

from celery import Celery

from .db import get_trades

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

celery_app = Celery(
    "trade_tracker", broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND
)

@celery_app.task(name="recalculate_trade_analytics")
def recalculate_trade_analytics() -> Dict[str, Any]:
    """Recompute simple trade analytics.

    This example aggregates the total quantity and number of trades
    currently stored in the database.
    """
    trades = asyncio.run(get_trades())
    total_qty = sum(record["qty"] for record in trades)
    return {"trade_count": len(trades), "total_qty": total_qty}
