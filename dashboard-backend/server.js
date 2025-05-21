import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Use .env fallback to 5000

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Login Route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ error: "Invalid credentials" });
      return res.json({ username: row.username, role: row.role });
    }
  );
});

// Customers Route
app.get("/api/customers", (req, res) => {
  db.all("SELECT * FROM customers", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/", (req, res) => {
  res.send("🚀 API is running. Try /api/login or /api/customers");
});

app.delete("/api/customers/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM customers WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ success: true });
  });
});

app.put("/api/customers/:id", (req, res) => {
  const { id } = req.params;
  const { customer_name, age, income } = req.body;
  db.run(
    "UPDATE customers SET customer_name = ?, age = ?, income = ? WHERE id = ?",
    [customer_name, age, income, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json({ success: true });
    }
  );
});

app.post("/api/customers", (req, res) => {
  const { id, customer_name, division, gender, marital_status, age, income } =
    req.body;

  //Insert into SQLite
  db.run(
    `INSERT INTO customers (id, customer_name, division, gender, marital_status, age, income) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, customer_name, division, gender, marital_status, age, income],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Append to CSV
      const csvLine = `\n${id},${customer_name},${division},${gender},${marital_status},${age},${income}`;
      const csvPath = path.join(process.cwd(), "customers.csv");

      fs.appendFile(csvPath, csvLine, (err) => {
        if (err) {
          console.error("❌ CSV append failed:", err.message);
          // Don't fail the request because of CSV issue
        } else {
          console.log(`✅ Appended to CSV: ${customer_name}`);
        }
        res.json({ success: true });
      });
    }
  );
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
