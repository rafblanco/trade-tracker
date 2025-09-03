'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Trade, TradeInput } from '../types/trade';

interface TradeFormProps {
  initialTrade?: Trade | null;
  onSave: (trade: TradeInput) => Promise<void>;
  onReset: () => void;
}

const emptyTrade: TradeInput = {
  symbol: '',
  side: 'buy',
  qty: 0,
  entry_price: 0,
  entry_time: '',
  exit_price: null,
  exit_time: '',
  fees: null,
  tags: '',
  notes: '',
};

export default function TradeForm({ initialTrade, onSave, onReset }: TradeFormProps) {
  const [trade, setTrade] = useState<TradeInput>(emptyTrade);

  useEffect(() => {
    if (initialTrade) {
      const { id, ...rest } = initialTrade;
      setTrade(rest);
    } else {
      setTrade(emptyTrade);
    }
  }, [initialTrade]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { id, value } = e.target;

    setTrade(t => {
      if (id === 'qty' || id === 'entry_price') {
        return { ...t, [id]: value === '' ? 0 : Number(value) };
      }
      if (id === 'exit_price' || id === 'fees') {
        return { ...t, [id]: value === '' ? null : Number(value) };
      }
      return { ...t, [id]: value };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSave(trade);
    setTrade(emptyTrade);
  }

  function handleReset() {
    setTrade(emptyTrade);
    onReset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Symbol: <input id="symbol" value={trade.symbol} onChange={handleChange} required /></label>
      </div>
      <div>
        <label>Side:
          <select id="side" value={trade.side} onChange={handleChange}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
      </div>
      <div>
        <label>Quantity: <input id="qty" type="number" step="any" value={trade.qty ?? ''} onChange={handleChange} required /></label>
      </div>
      <div>
        <label>Entry Price: <input id="entry_price" type="number" step="any" value={trade.entry_price ?? ''} onChange={handleChange} required /></label>
      </div>
      <div>
        <label>Entry Time: <input id="entry_time" type="datetime-local" value={trade.entry_time} onChange={handleChange} required /></label>
      </div>
      <div>
        <label>Exit Price: <input id="exit_price" type="number" step="any" value={trade.exit_price ?? ''} onChange={handleChange} /></label>
      </div>
      <div>
        <label>Exit Time: <input id="exit_time" type="datetime-local" value={trade.exit_time ?? ''} onChange={handleChange} /></label>
      </div>
      <div>
        <label>Fees: <input id="fees" type="number" step="any" value={trade.fees ?? ''} onChange={handleChange} /></label>
      </div>
      <div>
        <label>Tags: <input id="tags" value={trade.tags ?? ''} onChange={handleChange} placeholder="tag1, tag2" /></label>
      </div>
      <div>
        <label>Notes:<br />
          <textarea id="notes" value={trade.notes ?? ''} onChange={handleChange} />
        </label>
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
}
