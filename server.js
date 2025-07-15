// server.js
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { connectDB, getDB } = require("./db");
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3001;
// ✅ ตรงนี้ต้องมาก่อนทุก route
app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json());

// 🟩 Route: Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ msg: "Missing fields" });

    const db = getDB();
    const user = await db.collection("users").findOne({ username, password });

    if (user) {
        res.json({ status: "success", msg: "Login successful" });
    } else {
        res.status(401).json({ status: "error", msg: "Invalid credentials" });
    }
});

// 🟦 Route: Register
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ msg: "Missing fields" });

    const db = getDB();
    const exists = await db.collection("users").findOne({ username });
    if (exists) return res.status(409).json({ msg: "User already exists" });

    await db.collection("users").insertOne({ username, password });
    res.json({ status: "success", msg: "User registered" });
});

// ⏯ Start Server
connectDB()
  .then(() => {
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("❌ Failed to start server due to DB connection error.");
    process.exit(1);
  });