from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Query

from .analytics import calculate_stats
from .data import TRADES

app = FastAPI()


@app.get("/stats")
def stats(
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
    tags: Optional[str] = Query(None),
):
    """Return aggregated trade statistics."""
    tag_list: List[str] = tags.split(",") if tags else []
    return calculate_stats(TRADES, start=start, end=end, tags=tag_list)
