from fastapi.testclient import TestClient

from trade_tracker.main import app


def test_stats_endpoint():
    client = TestClient(app)
    response = client.get("/stats", params={"start": "2024-01-01", "end": "2024-01-03", "tags": "tech"})
    assert response.status_code == 200
    data = response.json()
    assert data["trade_count"] == 1
    assert data["total_quantity"] == 5
    assert data["average_price"] == 100
