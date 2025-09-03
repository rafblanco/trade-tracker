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
}
