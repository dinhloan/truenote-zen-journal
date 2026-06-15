import jwt from "jsonwebtoken";
import { findUserById } from "../repositories/users.js";

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next({ status: 401, message: "Authentication token is required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || "test-secret");
    const user = await findUserById(payload.sub);

    if (!user) {
      return next({ status: 401, message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (_error) {
    next({ status: 401, message: "Invalid or expired token" });
  }
}
