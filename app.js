/**
 * Expense Tracker Application
 * Tech: Node.js, Express, MySQL, EJS
 * Author: Swati Zampal
 */

const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

/* ===============================
   App Configuration
================================ */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ===============================
   MySQL Database Connection
================================ */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Pass@123",
  database: "expense_db"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    process.exit(1);
  }
  console.log("✅ MySQL Connected");
});

/* ===============================
   Routes
================================ */

/**
 * Home Page – List Expenses
 */
app.get("/", (req, res) => {
  const sql = "SELECT * FROM expenses ORDER BY expense_date DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }

    const total = results.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    res.render("index", {
      expenses: results,
      total
    });
  });
});

/**
 * Add New Expense
 */
app.post("/add", (req, res) => {
  const {
    title,
    category,
    amount,
    payment_mode,
    expense_date,
    notes
  } = req.body;

  const sql = `
    INSERT INTO expenses
    (title, category, amount, payment_mode, expense_date, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, category, amount, payment_mode, expense_date, notes],
    err => {
      if (err) {
        console.error(err);
        return res.status(500).send("Insert failed");
      }
      res.redirect("/");
    }
  );
});

/**
 * Delete Expense
 */
app.post("/delete/:id", (req, res) => {
  const sql = "DELETE FROM expenses WHERE id = ?";

  db.query(sql, [req.params.id], err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Delete failed");
    }
    res.redirect("/");
  });
});

/* ===============================
   Server Start
================================ */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Expense Tracker running on port ${PORT}`);
});

