require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
    }
};

// Connect to Database
sql.connect(dbConfig)
    .then(() => console.log("✅ Connected to DB"))
    .catch(err => console.error("❌ DB Connection Failed:", err));

// Route 1: Sign Up Form (one.html)
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await sql.query`INSERT INTO Users (username, password_hash) VALUES (${username}, ${hashedPassword})`;
        res.json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route 2: Survey Form (two.html)
app.post("/survey", async (req, res) => {
    const { age, satisfaction } = req.body;
    try {
        await sql.query`INSERT INTO Survey (age, satisfaction) VALUES (${age}, ${satisfaction})`;
        res.json({ message: "Survey submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route 3: Contact Form (three.html)
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await sql.query`INSERT INTO Contact (name, email, message) VALUES (${name}, ${email}, ${message})`;
        res.json({ message: "Contact form submitted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route 4: Food Form (four.html)
app.post("/food", async (req, res) => {
    const { name, fav_food, cuisine, reason } = req.body;
    try {
        await sql.query`INSERT INTO FavoriteFood (name, fav_food, cuisine, reason) VALUES (${name}, ${fav_food}, ${cuisine}, ${reason})`;
        res.json({ message: "Food preference saved!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route 5: Feedback Form (five.html)
app.post("/feedback", async (req, res) => {
    const { name, email, rating, comments } = req.body;
    try {
        await sql.query`INSERT INTO Feedback (name, email, rating, comments) VALUES (${name}, ${email}, ${rating}, ${comments})`;
        res.json({ message: "Feedback submitted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
