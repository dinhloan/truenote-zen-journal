import { ZodError } from "zod";

export function notFoundHandler(req, _res, next) {
  next({ status: 404, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  const status = error.status || 500;
  const message = status === 500 ? "Internal server error" : error.message;

  if (status === 500 && process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  res.status(status).json({ message });
}
