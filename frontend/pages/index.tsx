import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TradeForm from "../components/TradeForm";
import TradeTable from "../components/TradeTable";
import StrategyMetrics from "../components/StrategyMetrics";
import { Trade, TradeInput } from "../types/trade";
import { fetchTrades, createTrade, updateTrade, deleteTrade } from "../lib/api";

// Disable static generation
export const getServerSideProps = () => {
  return { props: {} };
};

export default function Home() {
  const [editing, setEditing] = useState<Trade | null>(null);
  const queryClient = useQueryClient();

  // Check if Clerk is available at runtime
  const [clerkAvailable, setClerkAvailable] = useState(false);
  const [auth, setAuth] = useState<any>(null);

  useEffect(() => {
    try {
      const clerk = require("@clerk/nextjs");
      setClerkAvailable(true);
      setAuth(clerk.useAuth());
    } catch (e) {
      setClerkAvailable(false);
    }
  }, []);

  const getToken = auth?.getToken;

  const { data: trades = [] } = useQuery({
    queryKey: ["trades"],
    queryFn: async () => {
      const token = getToken ? await getToken() : undefined;
      return fetchTrades(token || undefined);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (trade: TradeInput) => {
      const token = getToken ? await getToken() : undefined;
      return createTrade(trade, token || undefined);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trades"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async (trade: Trade) => {
      const token = getToken ? await getToken() : undefined;
      return updateTrade(trade, token || undefined);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trades"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = getToken ? await getToken() : undefined;
      return deleteTrade(id, token || undefined);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trades"] }),
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

  // If Clerk is not configured, show the app without authentication
  if (!clerkAvailable) {
    return (
      <div>
        <h1>Trade Tracker</h1>
        <TradeForm
          initialTrade={editing}
          onSave={handleSave}
          onReset={handleReset}
        />
        <h2>Trades</h2>
        <TradeTable
          trades={trades}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <h2>Strategy Metrics</h2>
        <StrategyMetrics />
      </div>
    );
  }

  // Dynamic imports for Clerk components
  const SignedIn = require("@clerk/nextjs").SignedIn;
  const SignedOut = require("@clerk/nextjs").SignedOut;
  const RedirectToSignIn = require("@clerk/nextjs").RedirectToSignIn;

  return (
    <>
      <SignedIn>
        <div>
          <h1>Trade Tracker</h1>
          <TradeForm
            initialTrade={editing}
            onSave={handleSave}
            onReset={handleReset}
          />
          <h2>Trades</h2>
          <TradeTable
            trades={trades}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <h2>Strategy Metrics</h2>
          <StrategyMetrics />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
