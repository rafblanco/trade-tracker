'use client';

import { Trade } from '../lib/types';

interface TradeTableProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: number) => Promise<void>;
}

export default function TradeTable({ trades, onEdit, onDelete }: TradeTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th><th>Side</th><th>Qty</th><th>Entry Price</th><th>Entry Time</th>
          <th>Exit Price</th><th>Exit Time</th><th>Fees</th><th>Tags</th><th>Notes</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {trades.map(t => (
          <tr key={t.id}>
            <td>{t.symbol}</td>
            <td>{t.side}</td>
            <td>{t.qty}</td>
            <td>{t.entry_price}</td>
            <td>{t.entry_time}</td>
            <td>{t.exit_price ?? ''}</td>
            <td>{t.exit_time ?? ''}</td>
            <td>{t.fees ?? ''}</td>
            <td>{t.tags ?? ''}</td>
            <td>{t.notes ?? ''}</td>
            <td>
              <button onClick={() => onEdit(t)}>Edit</button>
              <button onClick={() => t.id && onDelete(t.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
