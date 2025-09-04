'use client';

import { useEffect, useState } from 'react';
import { StrategyMetrics } from '../lib/types';
import { fetchStrategyMetrics } from '../lib/api';

export default function StrategyMetrics() {
  const [metrics, setMetrics] = useState<StrategyMetrics>({});

  useEffect(() => {
    async function load() {
      const data = await fetchStrategyMetrics();
      setMetrics(data);
    }
    load();
  }, []);

  const tags = Object.keys(metrics);
  if (tags.length === 0) return <div>No metrics available</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Strategy</th>
          <th>Trades</th>
          <th>PNL</th>
          <th>Return %</th>
        </tr>
      </thead>
      <tbody>
        {tags.map(tag => (
          <tr key={tag}>
            <td>{tag}</td>
            <td>{metrics[tag].trades}</td>
            <td>{metrics[tag].pnl.toFixed(2)}</td>
            <td>{(metrics[tag].return_pct * 100).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
