import axios from "axios";
import { Trade, TradeInput, StrategyMetrics } from "../types/trade";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export async function fetchTrades(token?: string): Promise<Trade[]> {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await apiClient.get<Trade[]>("/trades", { headers });
  return data;
}

export async function createTrade(
  trade: TradeInput,
  token?: string
): Promise<Trade> {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await apiClient.post<Trade>("/trades", trade, { headers });
  return data;
}

export async function updateTrade(
  trade: Trade,
  token?: string
): Promise<Trade> {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await apiClient.put<Trade>(`/trades/${trade.id}`, trade, {
    headers,
  });
  return data;
}

export async function deleteTrade(id: number, token?: string): Promise<void> {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  await apiClient.delete(`/trades/${id}`, { headers });
}

export async function fetchStrategyMetrics(): Promise<StrategyMetrics> {
  const res = await fetch(`${API_BASE}/analytics/summary`);
  if (!res.ok) throw new Error("Failed to load metrics");
  return res.json();
}
