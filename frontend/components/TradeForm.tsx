"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Trade, TradeInput, Leg } from "../types/trade";
import { uploadAttachment } from "../lib/storage";

interface TradeFormProps {
  initialTrade?: Trade | null;
  onSave: (trade: TradeInput) => Promise<void>;
  onReset: () => void;
}

const emptyTrade: TradeInput = {
  symbol: "",
  side: "buy",
  qty: 0,
  entry_price: 0,
  entry_time: "",
  exit_price: null,
  exit_time: "",
  fees: null,
  tags: "",
  notes: "",
  legs: [{ symbol: "", side: "buy", qty: 0, price: 0 }],
  attachment_url: null,
};

export default function TradeForm({
  initialTrade,
  onSave,
  onReset,
}: TradeFormProps) {
  const [trade, setTrade] = useState<TradeInput>(emptyTrade);

  useEffect(() => {
    if (initialTrade) {
      const { id, ...rest } = initialTrade;
      setTrade({
        ...rest,
        legs:
          rest.legs && rest.legs.length > 0
            ? rest.legs
            : [
                {
                  symbol: rest.symbol,
                  side: rest.side,
                  qty: rest.qty,
                  price: rest.entry_price,
                },
              ],
      });
    } else {
      setTrade(emptyTrade);
    }
  }, [initialTrade]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { id, value } = e.target;

    setTrade((t) => {
      if (id === "qty" || id === "entry_price") {
        return { ...t, [id]: value === "" ? 0 : Number(value) };
      }
      if (id === "exit_price" || id === "fees") {
        return { ...t, [id]: value === "" ? null : Number(value) };
      }
      return { ...t, [id]: value };
    });
  }

  function handleLegChange(index: number, field: keyof Leg, value: string) {
    setTrade((t) => {
      const legs = t.legs ? [...t.legs] : [];
      legs[index] = {
        ...legs[index],
        [field]: field === "qty" || field === "price" ? Number(value) : value,
      } as Leg;
      const updated: TradeInput = { ...t, legs };
      const first = legs[0];
      if (first) {
        updated.symbol = first.symbol;
        updated.side = first.side as "buy" | "sell";
        updated.qty = first.qty;
        updated.entry_price = first.price;
      }
      return updated;
    });
  }

  function addLeg() {
    setTrade((t) => ({
      ...t,
      legs: [...(t.legs || []), { symbol: "", side: "buy", qty: 0, price: 0 }],
    }));
  }

  function removeLeg(index: number) {
    setTrade((t) => {
      const legs = [...(t.legs || [])];
      legs.splice(index, 1);
      const updated: TradeInput = { ...t, legs };
      const first = legs[0] || { symbol: "", side: "buy", qty: 0, price: 0 };
      updated.symbol = first.symbol;
      updated.side = first.side as "buy" | "sell";
      updated.qty = first.qty;
      updated.entry_price = first.price;
      return updated;
    });
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadAttachment(file);
      setTrade((t) => ({ ...t, attachment_url: url }));
    }
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
      {trade.legs?.map((leg, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            padding: "4px",
            marginBottom: "4px",
          }}
        >
          <h4>Leg {idx + 1}</h4>
          <div>
            <label>
              Symbol:{" "}
              <input
                value={leg.symbol}
                onChange={(e) => handleLegChange(idx, "symbol", e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Side:
              <select
                value={leg.side}
                onChange={(e) => handleLegChange(idx, "side", e.target.value)}
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Quantity:{" "}
              <input
                type="number"
                step="any"
                value={leg.qty}
                onChange={(e) => handleLegChange(idx, "qty", e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Price:{" "}
              <input
                type="number"
                step="any"
                value={leg.price}
                onChange={(e) => handleLegChange(idx, "price", e.target.value)}
                required
              />
            </label>
          </div>
          {trade.legs && trade.legs.length > 1 && (
            <button type="button" onClick={() => removeLeg(idx)}>
              Remove Leg
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addLeg}>
        Add Leg
      </button>
      <div>
        <label>
          Entry Time:{" "}
          <input
            id="entry_time"
            type="datetime-local"
            value={trade.entry_time}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Exit Price:{" "}
          <input
            id="exit_price"
            type="number"
            step="any"
            value={trade.exit_price ?? ""}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Exit Time:{" "}
          <input
            id="exit_time"
            type="datetime-local"
            value={trade.exit_time ?? ""}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Fees:{" "}
          <input
            id="fees"
            type="number"
            step="any"
            value={trade.fees ?? ""}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Tags:{" "}
          <input
            id="tags"
            value={trade.tags ?? ""}
            onChange={handleChange}
            placeholder="tag1, tag2"
          />
        </label>
      </div>
      <div>
        <label>
          Notes:
          <br />
          <textarea
            id="notes"
            value={trade.notes ?? ""}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Attachment: <input type="file" onChange={handleFileChange} />
        </label>
        {trade.attachment_url && (
          <div>
            <a
              href={trade.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View File
            </a>
          </div>
        )}
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
}
