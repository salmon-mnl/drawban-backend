// db.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
    try {
        console.log("🌐 Connecting to MongoDB...");
        await client.connect();
        db = client.db("members");
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        throw err; // สำคัญ! ต้องโยนออกไปให้ server.js จับ
    }
}

function getDB() {
    
    if (!db) throw new Error("DB not initialized");
    return db;
}

module.exports = { connectDB, getDB };