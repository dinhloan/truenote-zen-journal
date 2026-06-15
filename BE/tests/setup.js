import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, afterEach, beforeAll } from "vitest";
import { closeDatabase, connectDatabase, resetDatabase } from "../src/config/database.js";

let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret";
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  await connectDatabase(process.env.MONGODB_URI);
});

afterEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closeDatabase();
  await mongoServer?.stop();
});
