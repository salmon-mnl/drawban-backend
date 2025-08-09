// db.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = 'mongodb+srv://drawban:r2HW346CP84142rB@cluster0.unfiqwt.mongodb.net/members?retryWrites=true&w=majority&tls=true';
console.log(uri);

const client = new MongoClient(uri);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("members");
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
    }
}

function getDB() {
    if (!db) throw new Error("DB not initialized");
    return db;
}

module.exports = { connectDB, getDB };