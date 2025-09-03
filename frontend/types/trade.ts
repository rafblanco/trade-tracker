export type Side = 'buy' | 'sell';

export interface Trade {
  id: number;
  symbol: string;
  side: Side;
  qty: number;
  entry_price: number;
  entry_time: string;
  exit_price?: number | null;
  exit_time?: string | null;
  fees?: number | null;
  tags?: string | null;
  notes?: string | null;
}

export type TradeInput = Omit<Trade, 'id'>;
