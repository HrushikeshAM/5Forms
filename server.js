require("dotenv").config(); // Load environment variables
app.use(express.static("public"));


const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable

app.use(bodyParser.json());
app.use(cors());

// Azure SQL Configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    enableArithAbort: true,
  }
};

// Connect to Azure SQL
sql.connect(dbConfig)
  .then(() => console.log("Connected to Azure SQL Database"))
  .catch(err => console.log("Database connection failed: ", err));

// Create a request object for queries
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

// API Routes

// 1️⃣ Login API
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
      await poolConnect;
      const userExists = await pool.request()
        .input("username", sql.VarChar, username)
        .query("SELECT * FROM Users WHERE username = @username");
  
      if (userExists.recordset.length > 0) {
        return res.json({ success: false, message: "Username already exists." });
      }
  
      await pool.request()
        .input("username", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .query("INSERT INTO Users (username, password_hash) VALUES (@username, @password)");
  
      res.json({ success: true, message: "Signup successful!" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error: " + err.message });
    }
  });
  
  

// 2️⃣ Survey API
app.post("/survey", async (req, res) => {
  const { age, satisfaction } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input("age", sql.Int, age)
      .input("satisfaction", sql.VarChar, satisfaction)
      .query("INSERT INTO Survey (age, satisfaction) VALUES (@age, @satisfaction)");

    res.json({ success: true, message: "Survey submitted successfully!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 3️⃣ Contact API
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input("name", sql.VarChar, name)
      .input("email", sql.VarChar, email)
      .input("message", sql.Text, message)
      .query("INSERT INTO Contact (name, email, message) VALUES (@name, @email, @message)");

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 4️⃣ Favorite Food API
app.post("/favorite-food", async (req, res) => {
  const { name, fav_food, cuisine, why } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input("name", sql.VarChar, name)
      .input("fav_food", sql.VarChar, fav_food)
      .input("cuisine", sql.VarChar, cuisine)
      .input("why", sql.Text, why)
      .query("INSERT INTO FavoriteFood (name, fav_food, cuisine, reason) VALUES (@name, @fav_food, @cuisine, @why)");

    res.json({ success: true, message: "Favorite food submitted successfully!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 5️⃣ Feedback API
app.post("/feedback", async (req, res) => {
  const { name, email, rating, comments } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input("name", sql.VarChar, name)
      .input("email", sql.VarChar, email)
      .input("rating", sql.Int, rating)
      .input("comments", sql.Text, comments)
      .query("INSERT INTO Feedback (name, email, rating, comments) VALUES (@name, @email, @rating, @comments)");

    res.json({ success: true, message: "Feedback submitted successfully!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
