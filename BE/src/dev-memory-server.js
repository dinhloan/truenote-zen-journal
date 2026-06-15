import "dotenv/config";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = process.env.PORT || 4000;

process.env.JWT_SECRET ||= "local-development-secret";
process.env.CLIENT_ORIGIN ||= "http://localhost:5173";

const memoryServer = await MongoMemoryServer.create();
await connectDatabase(memoryServer.getUri());

createApp().listen(port, "0.0.0.0", () => {
  console.log(`TrueNote API with in-memory MongoDB listening on http://localhost:${port}`);
});
