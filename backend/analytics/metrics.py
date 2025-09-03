"""Utility functions for analysing trades and options.

This module leverages NumPy and pandas to compute common
performance metrics for trades as well as basic option Greeks.
"""
from __future__ import annotations

import math
from typing import Dict

import numpy as np
import pandas as pd


def compute_trade_metrics(trade: Dict[str, float]) -> pd.Series:
    """Return profit and loss statistics for a trade.

    Parameters
    ----------
    trade: mapping
        Dictionary containing trade information.  The object must at least
        contain ``side``, ``qty``, ``entry_price`` and ``exit_price`` fields and
        may optionally contain ``fees``.

    Returns
    -------
    pandas.Series
        Series containing ``pnl`` (net profit and loss) and ``return_pct``
        (percentage return on capital).
    """
    if trade.get("exit_price") is None:
        raise ValueError("exit_price is required to compute P&L")

    side = str(trade.get("side", "buy")).lower()
    qty = float(trade.get("qty", 0))
    entry = float(trade.get("entry_price", 0))
    exit_ = float(trade["exit_price"])
    fees = float(trade.get("fees") or 0.0)

    # Long trades gain when price increases; short trades gain when price falls
    direction = 1.0 if side == "buy" else -1.0
    gross = (exit_ - entry) * qty * direction
    net = gross - fees
    invested = entry * qty

    return pd.Series({
        "pnl": net,
        "return_pct": net / invested if invested else np.nan,
    })


def option_greeks(
    S: float,
    K: float,
    T: float,
    r: float,
    sigma: float,
    option_type: str = "call",
) -> pd.Series:
    """Compute Black-Scholes delta and gamma for a European option.

    Parameters
    ----------
    S : float
        Spot price of the underlying asset.
    K : float
        Strike price.
    T : float
        Time to expiry in years.
    r : float
        Risk-free interest rate expressed as a decimal.
    sigma : float
        Annualised volatility expressed as a decimal.
    option_type : {"call", "put"}
        Type of the option.

    Returns
    -------
    pandas.Series
        Series containing ``delta`` and ``gamma``.
    """
    if T <= 0 or sigma <= 0 or S <= 0 or K <= 0:
        raise ValueError("Inputs must be positive")

    sqrtT = math.sqrt(T)
    d1 = (math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * sqrtT)
    d2 = d1 - sigma * sqrtT

    N = lambda x: 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))  # cumulative normal
    pdf = lambda x: math.exp(-0.5 * x ** 2) / math.sqrt(2.0 * math.pi)

    if option_type.lower() == "call":
        delta = N(d1)
    else:
        delta = N(d1) - 1.0

    gamma = pdf(d1) / (S * sigma * sqrtT)

    return pd.Series({"delta": delta, "gamma": gamma})
