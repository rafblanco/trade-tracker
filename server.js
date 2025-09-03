const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const DATA_FILE = path.join(__dirname, 'trades.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

function loadTrades() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveTrades(trades) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(trades, null, 2));
}

let trades = loadTrades();

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

function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && url.pathname === '/trades') {
    return sendJson(res, 200, trades);
  }
  if (req.method === 'POST' && url.pathname === '/trades') {
    return parseBody(req, (err, trade) => {
      if (err) return sendJson(res, 400, { error: 'Invalid JSON' });
      trade.id = Date.now();
      trades.push(trade);
      saveTrades(trades);
      return sendJson(res, 201, trade);
    });
  }
  if (req.method === 'PUT' && url.pathname.startsWith('/trades/')) {
    const id = Number(url.pathname.split('/')[2]);
    return parseBody(req, (err, updated) => {
      if (err) return sendJson(res, 400, { error: 'Invalid JSON' });
      const index = trades.findIndex(t => t.id === id);
      if (index === -1) return sendJson(res, 404, { error: 'Not found' });
      trades[index] = { ...trades[index], ...updated, id };
      saveTrades(trades);
      return sendJson(res, 200, trades[index]);
    });
  }
  if (req.method === 'DELETE' && url.pathname.startsWith('/trades/')) {
    const id = Number(url.pathname.split('/')[2]);
    const index = trades.findIndex(t => t.id === id);
    if (index === -1) return sendJson(res, 404, { error: 'Not found' });
    const removed = trades.splice(index, 1)[0];
    saveTrades(trades);
    return sendJson(res, 200, removed);
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
    handleApi(req, res);
  } else {
    serveStatic(req, res);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
