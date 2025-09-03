import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TradeForm from '../components/TradeForm';
import TradeTable from '../components/TradeTable';
import { Trade, TradeInput } from '../types/trade';
import { fetchTrades, createTrade, updateTrade, deleteTrade } from '../lib/api';

export default function Home() {
  const [editing, setEditing] = useState<Trade | null>(null);
  const queryClient = useQueryClient();

  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: fetchTrades,
  });

  const createMutation = useMutation({
    mutationFn: createTrade,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trades'] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateTrade,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trades'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrade,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trades'] }),
  });

  async function handleSave(trade: TradeInput) {
    if (editing) {
      await updateMutation.mutateAsync({ ...trade, id: editing.id });
    } else {
      await createMutation.mutateAsync(trade);
    }
    setEditing(null);
  }

  function handleEdit(trade: Trade) {
    setEditing(trade);
  }

  async function handleDelete(id: number) {
    await deleteMutation.mutateAsync(id);
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
    </div>
  );
}
