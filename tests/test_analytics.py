from datetime import datetime
import pytest

from trade_tracker.analytics import calculate_stats
from trade_tracker.data import TRADES


def test_calculate_stats_filters():
    start = datetime(2024, 1, 1)
    end = datetime(2024, 1, 3)
    stats = calculate_stats(TRADES, start=start, end=end, tags=["tech"])
    assert stats["trade_count"] == 1
    assert stats["total_quantity"] == 5
    assert stats["average_price"] == 100


def test_calculate_stats_all():
    stats = calculate_stats(TRADES)
    assert stats["trade_count"] == 3
    assert stats["total_quantity"] == 10
    assert stats["average_price"] == pytest.approx(107.0)
