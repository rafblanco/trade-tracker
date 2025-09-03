# trade-tracker

Simple analytics service for aggregating trade metrics. Provides `/stats` endpoint to compute statistics over trades filtered by date range and tags.

## Running the API

```bash
pip install -r requirements.txt
uvicorn trade_tracker.main:app --reload
```

## Running Tests

```bash
pytest
```
