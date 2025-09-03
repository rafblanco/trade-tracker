const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const DATA_FILE = path.join(__dirname, 'trades.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

async function loadTrades() {
  try {
    const data = await fs.promises.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error loading trades:', err);
    }
    return [];
  }
}

async function saveTrades(trades) {
  const tempFile = `${DATA_FILE}.tmp`;
  await fs.promises.writeFile(tempFile, JSON.stringify(trades, null, 2));
  await fs.promises.rename(tempFile, DATA_FILE);
}

let trades = [];

function sendJson(res, statusCode, obj) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && url.pathname === '/trades') {
    return sendJson(res, 200, trades);
  }
  if (req.method === 'POST' && url.pathname === '/trades') {
    return parseBody(req, async (err, trade) => {
      if (err) return sendJson(res, 400, { error: 'Invalid JSON' });
      trade.id = Date.now();
      trades.push(trade);
      try {
        await saveTrades(trades);
        return sendJson(res, 201, trade);
      } catch (e) {
        console.error('Error saving trades:', e);
        return sendJson(res, 500, { error: 'Failed to save trade' });
      }
    });
  }
  if (req.method === 'PUT' && url.pathname.startsWith('/trades/')) {
    const id = Number(url.pathname.split('/')[2]);
    return parseBody(req, async (err, updated) => {
      if (err) return sendJson(res, 400, { error: 'Invalid JSON' });
      const index = trades.findIndex(t => t.id === id);
      if (index === -1) return sendJson(res, 404, { error: 'Not found' });
      trades[index] = { ...trades[index], ...updated, id };
      try {
        await saveTrades(trades);
        return sendJson(res, 200, trades[index]);
      } catch (e) {
        console.error('Error saving trades:', e);
        return sendJson(res, 500, { error: 'Failed to save trade' });
      }
    });
  }
  if (req.method === 'DELETE' && url.pathname.startsWith('/trades/')) {
    const id = Number(url.pathname.split('/')[2]);
    const index = trades.findIndex(t => t.id === id);
    if (index === -1) return sendJson(res, 404, { error: 'Not found' });
    const removed = trades.splice(index, 1)[0];
    try {
      await saveTrades(trades);
      return sendJson(res, 200, removed);
    } catch (e) {
      console.error('Error saving trades:', e);
      return sendJson(res, 500, { error: 'Failed to save trade' });
    }
  }
  sendJson(res, 404, { error: 'Not found' });
}

function serveStatic(req, res) {
  const filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/trades')) {
    handleApi(req, res).catch(err => {
      console.error('Unhandled API error:', err);
      sendJson(res, 500, { error: 'Internal Server Error' });
    });
  } else {
    serveStatic(req, res);
  }
});

const PORT = process.env.PORT || 3000;

async function initialize() {
  try {
    trades = await loadTrades();
  } catch (err) {
    console.error('Failed to load trades:', err);
    trades = [];
  }

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

initialize().catch(err => {
  console.error('Failed to start server:', err);
});
