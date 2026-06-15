import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import dailyRoutes from "./routes/daily.routes.js";
import awarenessRoutes from "./routes/awareness.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

const defaultAllowedOrigins = [
  "https://truenote-zen-journal.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174"
];

function getAllowedOrigins() {
  const configuredOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(/[\s,]+/)
    .map((origin) => origin.trim())
    .filter(Boolean)
    .filter((origin) => {
      try {
        return new URL(origin).origin === origin;
      } catch (_error) {
        return false;
      }
    });

  return [...new Set([...configuredOrigins, ...defaultAllowedOrigins])];
}

export function createApp() {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
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
