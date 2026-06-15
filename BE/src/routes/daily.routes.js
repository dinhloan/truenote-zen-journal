import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import {
  findDailyEntryByDate,
  findDailyEntryById,
  getOrCreateDailyEntry,
  getRealityByDaily,
  getVerificationByDaily,
  getVerificationById,
  syncThemesForUser,
  updateDailyEntry,
  updateDailyStatus,
  upsertAwarenessTrace,
  upsertDailyEntry,
  upsertReality,
  upsertVerification
} from "../repositories/journal.js";
import { normalizeThemeName, todayIsoDate, uniqueCleanStrings } from "../utils/normalize.js";

const router = Router();

router.use(requireAuth);

const dailySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  rawContent: z.string().max(20000).default(""),
  status: z.enum(["writing", "raw", "checking", "completed"]).default("writing")
});

const updateDailySchema = dailySchema.partial();

const realitySchema = z.object({
  facts: z.array(z.string().trim().min(1).max(500)).max(30).default([])
});

const verificationSchema = z.object({
  beliefBeingChecked: z.string().trim().max(1000).default(""),
  beliefLevelBefore: z.number().int().min(1).max(5).default(3),
  supportingBasis: z.array(z.string().trim().min(1).max(500)).max(30).default([]),
  isBasisEnough: z.enum(["enough", "not_enough", "unsure"]).default("unsure"),
  alternativePossibilities: z.array(z.string().trim().min(1).max(500)).max(30).default([]),
  reasoningConclusion: z.string().trim().max(3000).default(""),
  beliefLevelAfter: z.number().int().min(1).max(5).default(3)
});

const traceSchema = z.object({
  verificationId: z.string().min(1),
  awarenessStatement: z.string().trim().min(1).max(3000),
  reminderStatement: z.string().trim().min(1).max(1000),
  certaintyLevel: z.number().int().min(1).max(5).default(3),
  themes: z.array(z.string().trim().min(1).max(120)).max(12).default([])
});

router.get("/today", async (req, res, next) => {
  try {
    const entry = await getOrCreateDailyEntry(req.user.id, todayIsoDate());
    res.json({ dailyEntry: entry });
  } catch (error) {
    next(error);
  }
});

router.get("/:date", async (req, res, next) => {
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(req.params.date)) {
      return next({ status: 400, message: "Date must be in YYYY-MM-DD format" });
    }

    const entry = await findDailyEntryByDate(req.user.id, req.params.date);

    if (!entry) {
      return next({ status: 404, message: "Daily entry not found" });
    }

    res.json({ dailyEntry: entry });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = dailySchema.parse(req.body);
    const entry = await upsertDailyEntry(req.user.id, {
      date: payload.date || todayIsoDate(),
      rawContent: payload.rawContent,
      status: payload.status
    });

    res.status(201).json({ dailyEntry: entry });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const payload = updateDailySchema.parse(req.body);
    const entry = await updateDailyEntry(req.user.id, req.params.id, payload);

    if (!entry) {
      return next({ status: 404, message: "Daily entry not found" });
    }

    res.json({ dailyEntry: entry });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/reality", async (req, res, next) => {
  try {
    const entry = await findDailyEntryById(req.user.id, req.params.id);
    if (!entry) return next({ status: 404, message: "Daily entry not found" });

    const payload = realitySchema.parse(req.body);
    const reality = await upsertReality(req.user.id, entry.id, uniqueCleanStrings(payload.facts));

    await updateDailyStatus(req.user.id, entry.id, "checking");

    res.status(201).json({ realityCheck: reality });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/reality", async (req, res, next) => {
  try {
    const entry = await findDailyEntryById(req.user.id, req.params.id);
    if (!entry) return next({ status: 404, message: "Daily entry not found" });

    const reality = await getRealityByDaily(req.user.id, entry.id);
    if (!reality) return next({ status: 404, message: "Reality check not found" });

    res.json({ realityCheck: reality });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/verification", async (req, res, next) => {
  try {
    const entry = await findDailyEntryById(req.user.id, req.params.id);
    if (!entry) return next({ status: 404, message: "Daily entry not found" });

    const payload = verificationSchema.parse(req.body);
    const verification = await upsertVerification(req.user.id, entry.id, {
      ...payload,
      supportingBasis: uniqueCleanStrings(payload.supportingBasis),
      alternativePossibilities: uniqueCleanStrings(payload.alternativePossibilities)
    });

    await updateDailyStatus(req.user.id, entry.id, "checking");

    res.status(201).json({ verification });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/verification", async (req, res, next) => {
  try {
    const entry = await findDailyEntryById(req.user.id, req.params.id);
    if (!entry) return next({ status: 404, message: "Daily entry not found" });

    const verification = await getVerificationByDaily(req.user.id, entry.id);
    if (!verification) return next({ status: 404, message: "Verification not found" });

    res.json({ verification });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/awareness-trace", async (req, res, next) => {
  try {
    const entry = await findDailyEntryById(req.user.id, req.params.id);
    if (!entry) return next({ status: 404, message: "Daily entry not found" });

    const payload = traceSchema.parse(req.body);
    const verification = await getVerificationById(req.user.id, payload.verificationId);

    if (!verification || verification.dailyEntryId !== entry.id) {
      return next({ status: 400, message: "A matching verification is required before saving a trace" });
    }

    const trace = await upsertAwarenessTrace(req.user.id, entry.id, {
      verificationId: verification.id,
      awarenessStatement: payload.awarenessStatement,
      reminderStatement: payload.reminderStatement,
      certaintyLevel: payload.certaintyLevel,
      themes: uniqueCleanStrings(payload.themes).map(normalizeThemeName)
    });

    await updateDailyStatus(req.user.id, entry.id, "completed");
    await syncThemesForUser(req.user.id);

    res.status(201).json({ awarenessTrace: trace });
  } catch (error) {
    next(error);
  }
});

export default router;
