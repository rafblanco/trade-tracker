async function loadTrades() {
  const res = await fetch('/trades');
  const trades = await res.json();
  const tbody = document.querySelector('#trades-table tbody');
  tbody.innerHTML = '';
  trades.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.symbol}</td>
      <td>${t.side}</td>
      <td>${t.qty}</td>
      <td>${t.entry_price}</td>
      <td>${t.entry_time}</td>
      <td>${t.exit_price || ''}</td>
      <td>${t.exit_time || ''}</td>
      <td>${t.fees || ''}</td>
      <td>${t.tags || ''}</td>
      <td>${t.notes || ''}</td>
      <td>
        <button data-action="edit">Edit</button>
        <button data-action="delete">Delete</button>
      </td>
    `;
    tr.querySelector('[data-action="edit"]').addEventListener('click', () => editTrade(t));
    tr.querySelector('[data-action="delete"]').addEventListener('click', () => deleteTrade(t.id));
    tbody.appendChild(tr);
  });
}

function getFormData() {
  return {
    symbol: document.getElementById('symbol').value,
    side: document.getElementById('side').value,
    qty: parseFloat(document.getElementById('qty').value),
    entry_price: parseFloat(document.getElementById('entry_price').value),
    entry_time: document.getElementById('entry_time').value,
    exit_price: parseFloat(document.getElementById('exit_price').value) || null,
    exit_time: document.getElementById('exit_time').value || null,
    fees: parseFloat(document.getElementById('fees').value) || null,
    tags: document.getElementById('tags').value,
    notes: document.getElementById('notes').value
  };
}

function setFormData(t) {
  document.getElementById('trade-id').value = t.id || '';
  document.getElementById('symbol').value = t.symbol || '';
  document.getElementById('side').value = t.side || 'buy';
  document.getElementById('qty').value = t.qty || '';
  document.getElementById('entry_price').value = t.entry_price || '';
  document.getElementById('entry_time').value = t.entry_time || '';
  document.getElementById('exit_price').value = t.exit_price || '';
  document.getElementById('exit_time').value = t.exit_time || '';
  document.getElementById('fees').value = t.fees || '';
  document.getElementById('tags').value = t.tags || '';
  document.getElementById('notes').value = t.notes || '';
}

async function submitTrade(e) {
  e.preventDefault();
  const id = document.getElementById('trade-id').value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `/trades/${id}` : '/trades';
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(getFormData())
  });
  setFormData({});
  loadTrades();
}

function editTrade(t) {
  setFormData(t);
}

async function deleteTrade(id) {
  await fetch(`/trades/${id}`, { method: 'DELETE' });
  loadTrades();
}

document.getElementById('trade-form').addEventListener('submit', submitTrade);
document.getElementById('reset-btn').addEventListener('click', () => setFormData({}));

loadTrades();
