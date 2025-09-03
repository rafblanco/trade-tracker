from datetime import datetime
from typing import Iterable, List, Optional, Sequence

from .models import Trade


def _filter_trades(
    trades: Iterable[Trade],
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    tags: Optional[Sequence[str]] = None,
) -> List[Trade]:
    """Filter trades by date range and tags."""
    result: List[Trade] = []
    tag_set = set(tags or [])
    for trade in trades:
        if start and trade.timestamp < start:
            continue
        if end and trade.timestamp > end:
            continue
        if tag_set and not tag_set.issubset(trade.tags):
            continue
        result.append(trade)
    return result


def calculate_stats(
    trades: Iterable[Trade],
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    tags: Optional[Sequence[str]] = None,
) -> dict:
    """Aggregate trades and return key metrics."""
    filtered = _filter_trades(trades, start=start, end=end, tags=tags)
    total_quantity = sum(t.quantity for t in filtered)
    total_value = sum(t.price * t.quantity for t in filtered)
    trade_count = len(filtered)
    average_price = total_value / total_quantity if total_quantity else 0
    return {
        "trade_count": trade_count,
        "total_quantity": total_quantity,
        "average_price": average_price,
    }
