from datetime import datetime
from typing import List
from pydantic import BaseModel


class Trade(BaseModel):
    """Represents a trade entry."""
    id: int
    timestamp: datetime
    quantity: float
    price: float
    tags: List[str]
