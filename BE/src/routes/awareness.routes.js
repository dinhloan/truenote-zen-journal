import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import {
  getDailyEntriesByIds,
  getRealityByDaily,
  getThemeById,
  getThemes,
  getTraceById,
  getTraces,
  getTracesByTheme,
  getVerificationsByIds,
  getVerificationById,
  updateReality,
  updateVerification
} from "../repositories/journal.js";
import { uniqueCleanStrings } from "../utils/normalize.js";

const router = Router();

router.use(requireAuth);

const updateRealitySchema = z.object({
  facts: z.array(z.string().trim().min(1).max(500)).max(30)
});

const updateVerificationSchema = z
  .object({
    beliefBeingChecked: z.string().trim().max(1000),
    beliefLevelBefore: z.number().int().min(1).max(5),
    supportingBasis: z.array(z.string().trim().min(1).max(500)).max(30),
    isBasisEnough: z.enum(["enough", "not_enough", "unsure"]),
    alternativePossibilities: z.array(z.string().trim().min(1).max(500)).max(30),
    reasoningConclusion: z.string().trim().max(3000),
    beliefLevelAfter: z.number().int().min(1).max(5)
  })
  .partial();

router.put("/reality/:id", async (req, res, next) => {
  try {
    const payload = updateRealitySchema.parse(req.body);
    const reality = await updateReality(req.user.id, req.params.id, uniqueCleanStrings(payload.facts));

    if (!reality) {
      return next({ status: 404, message: "Reality check not found" });
    }

    res.json({ realityCheck: reality });
  } catch (error) {
    next(error);
  }
});

router.put("/verification/:id", async (req, res, next) => {
  try {
    const payload = updateVerificationSchema.parse(req.body);
    const verification = await updateVerification(req.user.id, req.params.id, {
      ...payload,
      supportingBasis: payload.supportingBasis ? uniqueCleanStrings(payload.supportingBasis) : undefined,
      alternativePossibilities: payload.alternativePossibilities ? uniqueCleanStrings(payload.alternativePossibilities) : undefined
    });

    if (!verification) {
      return next({ status: 404, message: "Verification not found" });
    }

    res.json({ verification });
  } catch (error) {
    next(error);
  }
});

router.get("/awareness-traces", async (req, res, next) => {
  try {
    res.json({ awarenessTraces: await getTraces(req.user.id) });
  } catch (error) {
    next(error);
  }
});

router.get("/awareness-traces/:id", async (req, res, next) => {
  try {
    const trace = await getTraceById(req.user.id, req.params.id);

    if (!trace) {
      return next({ status: 404, message: "Awareness trace not found" });
    }

    const dailyEntry = (await getDailyEntriesByIds([trace.dailyEntryId]))[0] || null;
    const realityCheck = await getRealityByDaily(req.user.id, trace.dailyEntryId);
    const verification = await getVerificationById(req.user.id, trace.verificationId);

    res.json({
      awarenessTrace: trace,
      dailyEntry,
      realityCheck,
      verification
    });
  } catch (error) {
    next(error);
  }
});

router.get("/themes", async (req, res, next) => {
  try {
    res.json({ themes: await getThemes(req.user.id) });
  } catch (error) {
    next(error);
  }
});

router.get("/themes/:themeId", async (req, res, next) => {
  try {
    const theme = await getThemeById(req.user.id, req.params.themeId);

    if (!theme) {
      return next({ status: 404, message: "Theme not found" });
    }

    const traces = await getTracesByTheme(req.user.id, theme.name);
    const dailyEntries = await getDailyEntriesByIds(traces.map((trace) => trace.dailyEntryId));
    const verifications = await getVerificationsByIds(
      req.user.id,
      traces.map((trace) => trace.verificationId)
    );

    res.json({
      theme,
      traces,
      dailyEntries,
      verifications
    });
  } catch (error) {
    next(error);
  }
});

router.get("/awareness-map", async (req, res, next) => {
  try {
    res.json({
      themes: await getThemes(req.user.id),
      timeline: await getTraces(req.user.id, "ASC")
    });
  } catch (error) {
    next(error);
  }
});

export default router;
