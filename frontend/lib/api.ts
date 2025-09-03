import { Trade, StrategyMetrics } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function fetchTrades(token: string): Promise<Trade[]> {
  const res = await fetch(`${API_BASE}/trades`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load trades');
  return res.json();
}

export async function createTrade(trade: Trade, token: string): Promise<void> {
  await fetch(`${API_BASE}/trades`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(trade),
  });
}

export async function updateTrade(trade: Trade, token: string): Promise<void> {
  if (!trade.id) throw new Error('Trade id required for update');
  await fetch(`${API_BASE}/trades/${trade.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(trade),
  });
}

export async function deleteTrade(id: number, token: string): Promise<void> {
  await fetch(`${API_BASE}/trades/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchStrategyMetrics(): Promise<StrategyMetrics> {
  const res = await fetch(`${API_BASE}/analytics/summary`);
  if (!res.ok) throw new Error('Failed to load metrics');
  return res.json();
}
