import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = process.env.PORT || 4000;

try {
  await connectDatabase();

  createApp().listen(port, "0.0.0.0", () => {
    console.log(`TrueNote API listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error("Failed to start TrueNote API", error);
  process.exit(1);
}
