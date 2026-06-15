import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

let db;

function nowIso() {
  return new Date().toISOString();
}

export function connectDatabase(dbPath = process.env.SQLITE_DB_PATH || path.resolve("data", "truenote.sqlite")) {
  if (db) return db;

  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  migrate(db);
  return db;
}

export function getDb() {
  return db || connectDatabase();
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = undefined;
  }
}

export function resetDatabase() {
  const database = getDb();
  database.exec(`
    DELETE FROM themes;
    DELETE FROM awareness_traces;
    DELETE FROM verifications;
    DELETE FROM reality_checks;
    DELETE FROM daily_entries;
    DELETE FROM users;
  `);
}

export function timestamps() {
  const timestamp = nowIso();
  return { createdAt: timestamp, updatedAt: timestamp };
}

function migrate(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      raw_content TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL CHECK (status IN ('writing', 'raw', 'checking', 'completed')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE (user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reality_checks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      daily_entry_id TEXT NOT NULL,
      facts TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE (user_id, daily_entry_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (daily_entry_id) REFERENCES daily_entries(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS verifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      daily_entry_id TEXT NOT NULL,
      belief_being_checked TEXT NOT NULL DEFAULT '',
      belief_level_before INTEGER NOT NULL DEFAULT 3,
      supporting_basis TEXT NOT NULL DEFAULT '[]',
      is_basis_enough TEXT NOT NULL CHECK (is_basis_enough IN ('enough', 'not_enough', 'unsure')),
      alternative_possibilities TEXT NOT NULL DEFAULT '[]',
      reasoning_conclusion TEXT NOT NULL DEFAULT '',
      belief_level_after INTEGER NOT NULL DEFAULT 3,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE (user_id, daily_entry_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (daily_entry_id) REFERENCES daily_entries(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS awareness_traces (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      daily_entry_id TEXT NOT NULL,
      verification_id TEXT NOT NULL,
      awareness_statement TEXT NOT NULL,
      reminder_statement TEXT NOT NULL,
      certainty_level INTEGER NOT NULL DEFAULT 3,
      themes TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE (user_id, daily_entry_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (daily_entry_id) REFERENCES daily_entries(id) ON DELETE CASCADE,
      FOREIGN KEY (verification_id) REFERENCES verifications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS themes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      trace_count INTEGER NOT NULL DEFAULT 0,
      related_themes TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE (user_id, name),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}
