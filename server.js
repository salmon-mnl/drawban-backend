// server.js
require('dotenv').config(); // ไม่เป็นไรถ้าจะคงไว้
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB, getDB } = require('./db');

const app = express();
const port = 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

// healthcheck
app.get('/', (_req, res) => res.send('OK'));
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// 🟩 Login
app.post('/login', async (req, res) => {
  try {
    const db = getDB();
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ msg: 'Missing fields' });

    const user = await db.collection('users').findOne({ username, password });
    if (user) return res.json({ status: 'success', msg: 'Login successful' });
    return res.status(401).json({ status: 'error', msg: 'Invalid credentials' });
  } catch (e) {
    console.error('login error:', e.message);
    return res.status(503).json({ status: 'error', msg: 'DB not ready' });
  }
});

// 🟦 Register
app.post('/register', async (req, res) => {
  try {
    const db = getDB();
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ msg: 'Missing fields' });

    const exists = await db.collection('users').findOne({ username });
    if (exists) return res.status(409).json({ msg: 'User already exists' });

    await db.collection('users').insertOne({ username, password });
    return res.json({ status: 'success', msg: 'User registered' });
  } catch (e) {
    console.error('register error:', e.message);
    return res.status(503).json({ status: 'error', msg: 'DB not ready' });
  }
});

// ⏯ เริ่มฟังพอร์ตก่อน แล้วต่อ DB เบื้องหลัง (กัน 502)
app.listen(port, () => {
  console.log(`🚀 Server listening on ${port}`);
  connectDB()
    .then(() => console.log('DB ready'))
    .catch(err => console.error('DB connect failed:', err.message));
});