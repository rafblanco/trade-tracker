import axios from 'axios';
import { Trade, TradeInput } from '../types/trade';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchTrades(): Promise<Trade[]> {
  const { data } = await apiClient.get<Trade[]>('/trades');
  return data;
}

export async function createTrade(trade: TradeInput): Promise<Trade> {
  const { data } = await apiClient.post<Trade>('/trades', trade);
  return data;
}

export async function updateTrade(trade: Trade): Promise<Trade> {
  const { data } = await apiClient.put<Trade>(`/trades/${trade.id}`, trade);
  return data;
}

export async function deleteTrade(id: number): Promise<void> {
  await apiClient.delete(`/trades/${id}`);
}
