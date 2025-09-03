export interface Leg {
  symbol: string;
  side: 'buy' | 'sell';
  qty: number;
  price: number;
}

export interface Trade {
  id?: number;
  symbol: string;
  side: 'buy' | 'sell';
  qty: number;
  entry_price: number;
  entry_time: string;
  exit_price?: number | null;
  exit_time?: string | null;
  fees?: number | null;
  tags?: string;
  notes?: string;
  legs?: Leg[];
  attachment_url?: string | null;
}

export interface StrategyMetrics {
  [tag: string]: {
    pnl: number;
    return_pct: number;
    trades: number;
  };
}
