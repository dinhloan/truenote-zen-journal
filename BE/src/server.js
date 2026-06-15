import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = process.env.PORT || 4000;

connectDatabase();

createApp().listen(port, () => {
  console.log(`TrueNote API listening on http://localhost:${port}`);
});
