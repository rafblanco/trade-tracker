from pydantic import BaseModel
from typing import Optional, List


class Leg(BaseModel):
    symbol: str
    side: str
    qty: float
    price: float


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
    legs: Optional[List[Leg]] = None
    attachment_url: Optional[str] = None
