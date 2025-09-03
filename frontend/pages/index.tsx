import { useEffect, useState } from 'react';
import TradeForm from '../components/TradeForm';
import TradeTable from '../components/TradeTable';
import StrategyMetrics from '../components/StrategyMetrics';
import { Trade } from '../lib/types';
import { fetchTrades, createTrade, updateTrade, deleteTrade } from '../lib/api';

export default function Home() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [editing, setEditing] = useState<Trade | null>(null);

  useEffect(() => {
    loadTrades();
  }, []);

  async function loadTrades() {
    const data = await fetchTrades();
    setTrades(data);
  }

  async function handleSave(trade: Trade) {
    if (editing) {
      await updateTrade({ ...trade, id: editing.id });
    } else {
      await createTrade(trade);
    }
    setEditing(null);
    await loadTrades();
  }

  function handleEdit(trade: Trade) {
    setEditing(trade);
  }

  async function handleDelete(id: number) {
    await deleteTrade(id);
    await loadTrades();
  }

  function handleReset() {
    setEditing(null);
  }

  return (
    <div>
      <h1>Trade Tracker</h1>
      <TradeForm initialTrade={editing} onSave={handleSave} onReset={handleReset} />
      <h2>Trades</h2>
      <TradeTable trades={trades} onEdit={handleEdit} onDelete={handleDelete} />
      <h2>Strategy Metrics</h2>
      <StrategyMetrics />
    </div>
  );
}
