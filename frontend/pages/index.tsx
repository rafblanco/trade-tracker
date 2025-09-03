import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/nextjs';
import TradeForm from '../components/TradeForm';
import TradeTable from '../components/TradeTable';
import StrategyMetrics from '../components/StrategyMetrics';
import { Trade } from '../lib/types';
import { fetchTrades, createTrade, updateTrade, deleteTrade } from '../lib/api';

export default function Home() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [editing, setEditing] = useState<Trade | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    loadTrades();
  }, []);

  async function loadTrades() {
    const token = await getToken();
    if (!token) return;
    const data = await fetchTrades(token);
    setTrades(data);
  }

  async function handleSave(trade: Trade) {
    const token = await getToken();
    if (!token) return;
    if (editing) {
      await updateTrade({ ...trade, id: editing.id }, token);
    } else {
      await createTrade(trade, token);
    }
    setEditing(null);
    await loadTrades();
  }

  function handleEdit(trade: Trade) {
    setEditing(trade);
  }

  async function handleDelete(id: number) {
    const token = await getToken();
    if (!token) return;
    await deleteTrade(id, token);
    await loadTrades();
  }

  function handleReset() {
    setEditing(null);
  }

  return (
    <>
      <h1>Trade Tracker</h1>
      <TradeForm initialTrade={editing} onSave={handleSave} onReset={handleReset} />
      <h2>Trades</h2>
      <TradeTable trades={trades} onEdit={handleEdit} onDelete={handleDelete} />
      <h2>Strategy Metrics</h2>
      <StrategyMetrics />
      <SignedIn>
        <div>
          <h1>Trade Tracker</h1>
          <TradeForm initialTrade={editing} onSave={handleSave} onReset={handleReset} />
          <h2>Trades</h2>
          <TradeTable trades={trades} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
