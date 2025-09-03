import numpy as np
from fastapi.testclient import TestClient
import pytest

from backend.app.main import app, DB_PATH
from backend.analytics.metrics import compute_trade_metrics, option_greeks


@pytest.fixture(autouse=True)
def clear_db():
    if DB_PATH.exists():
        DB_PATH.unlink()
    yield
    if DB_PATH.exists():
        DB_PATH.unlink()


def test_compute_trade_metrics():
    trade = {
        "symbol": "AAPL",
        "side": "buy",
        "qty": 10,
        "entry_price": 100,
        "entry_time": "2024-01-01T00:00:00Z",
        "exit_price": 110,
        "exit_time": "2024-01-02T00:00:00Z",
        "fees": 2,
    }
    metrics = compute_trade_metrics(trade)
    assert np.isclose(metrics["pnl"], 98.0)
    assert np.isclose(metrics["return_pct"], 0.098)


def test_option_greeks():
    greeks = option_greeks(100, 100, 1, 0.01, 0.2, option_type="call")
    assert np.isclose(greeks["delta"], 0.6368, atol=1e-4)
    assert np.isclose(greeks["gamma"], 0.0188, atol=1e-4)


def test_trade_analytics_endpoint():
    client = TestClient(app)
    trade = {
        "symbol": "AAPL",
        "side": "buy",
        "qty": 10,
        "entry_price": 100,
        "entry_time": "2024-01-01T00:00:00Z",
        "exit_price": 110,
        "exit_time": "2024-01-02T00:00:00Z",
        "fees": 2,
    }
    resp = client.post("/trades", json=trade)
    assert resp.status_code == 201
    trade_id = resp.json()["id"]

    analytics = client.get(f"/trades/{trade_id}/analytics")
    assert analytics.status_code == 200
    data = analytics.json()
    assert np.isclose(data["pnl"], 98.0)
    assert np.isclose(data["return_pct"], 0.098)


def test_analytics_summary_endpoint():
    client = TestClient(app)
    base = {
        "side": "buy",
        "qty": 1,
        "entry_price": 100,
        "entry_time": "2024-01-01T00:00:00Z",
        "exit_price": 105,
        "exit_time": "2024-01-02T00:00:00Z",
        "fees": 0,
    }
    client.post("/trades", json={"symbol": "AAA", **base, "tags": "strat"})
    client.post("/trades", json={"symbol": "BBB", **base, "tags": "strat"})

    summary = client.get("/analytics/summary")
    assert summary.status_code == 200
    data = summary.json()
    assert data["strat"]["trades"] == 2
