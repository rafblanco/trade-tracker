from datetime import datetime

from .models import Trade

# Sample trades dataset
TRADES = [
    Trade(id=1, timestamp=datetime(2024, 1, 1, 10), quantity=5, price=100, tags=["tech", "buy"]),
    Trade(id=2, timestamp=datetime(2024, 1, 2, 11), quantity=3, price=110, tags=["sell"]),
    Trade(id=3, timestamp=datetime(2024, 1, 5, 9), quantity=2, price=120, tags=["tech", "sell"]),
]
