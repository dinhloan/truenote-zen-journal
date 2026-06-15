import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { createUser, findUserByEmail, toSafeUser } from "../repositories/users.js";
import { signAuthToken } from "../utils/jwt.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128)
});

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1)
});

router.post("/register", async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const existing = await findUserByEmail(payload.email);

    if (existing) {
      return next({ status: 409, message: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await createUser({ name: payload.name, email: payload.email, passwordHash });

    res.status(201).json({
      token: signAuthToken(user),
      user: toSafeUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await findUserByEmail(payload.email);

    if (!user || !(await bcrypt.compare(payload.password, user.passwordHash))) {
      return next({ status: 401, message: "Email or password is incorrect" });
    }

    res.json({
      token: signAuthToken(user),
      user: toSafeUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: toSafeUser(req.user) });
});

export default router;
