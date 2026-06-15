import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = process.env.PORT || 4000;

process.env.SQLITE_DB_PATH = ":memory:";
process.env.JWT_SECRET ||= "local-development-secret";
process.env.CLIENT_ORIGIN ||= "http://localhost:5173";

connectDatabase(":memory:");

createApp().listen(port, () => {
  console.log(`TrueNote API with in-memory SQLite listening on http://localhost:${port}`);
});
