import { afterAll, afterEach, beforeAll } from "vitest";
import { closeDatabase, connectDatabase, resetDatabase } from "../src/config/database.js";

beforeAll(() => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret";
  process.env.SQLITE_DB_PATH = ":memory:";
  connectDatabase(":memory:");
});

afterEach(() => {
  resetDatabase();
});

afterAll(() => {
  closeDatabase();
});
