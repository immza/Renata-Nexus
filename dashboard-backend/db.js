import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./dashboard.db"); //creating a new db file
//users table
db.run(`CREATE TABLE IF NOT EXISTS users ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
)`);

//Customers Table
db.run(`CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  customer_name TEXT,
  division TEXT,
  gender TEXT,
  marital_status TEXT,
  age INTEGER,
  income INTEGER
)`);

// Seed Users
db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES 
  ('admin', 'admin123', 'Admin'),
  ('sales', 'sales123', 'SalesRep')
`);

console.log("Database setup complete.");

export default db;
