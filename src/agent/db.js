import sqlite3 from "sqlite3";

const db = new sqlite3.Database("agent.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE,
    hash TEXT,
    size INTEGER,
    modifiedAt TEXT,
    folder TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Baselines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    folder TEXT,
    createdAt TEXT,
    version TEXT
  )`);
});

export default db;
