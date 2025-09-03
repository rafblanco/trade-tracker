from pydantic import BaseModel
from typing import Optional

class Trade(BaseModel):
    id: int
    symbol: str
    side: str
    qty: float
    entry_price: float
    entry_time: str
    exit_price: Optional[float] = None
    exit_time: Optional[str] = None
    fees: Optional[float] = None
    tags: Optional[str] = None
    notes: Optional[str] = None
