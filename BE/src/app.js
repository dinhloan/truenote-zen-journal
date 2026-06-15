import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import dailyRoutes from "./routes/daily.routes.js";
import awarenessRoutes from "./routes/awareness.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "truenote-be" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/daily", dailyRoutes);
  app.use("/api", awarenessRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
