import { randomUUID } from "node:crypto";
import { getDb } from "../config/database.js";

function toUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

export function findUserByEmail(email) {
  const row = getDb().prepare("SELECT * FROM users WHERE email = ?").get(email);
  return toUser(row);
}

export function findUserById(id) {
  const row = getDb().prepare("SELECT * FROM users WHERE id = ?").get(id);
  return toUser(row);
}

export function createUser({ name, email, passwordHash }) {
  const timestamp = new Date().toISOString();
  const id = randomUUID();

  getDb()
    .prepare(
      `INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(id, name, email, passwordHash, timestamp, timestamp);

  return findUserById(id);
}
