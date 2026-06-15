import mongoose from "mongoose";
import { AwarenessTrace } from "../models/AwarenessTrace.js";
import { DailyEntry } from "../models/DailyEntry.js";
import { RealityCheck } from "../models/RealityCheck.js";
import { Theme } from "../models/Theme.js";
import { Verification } from "../models/Verification.js";
import { normalizeThemeName } from "../utils/normalize.js";

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

function toClient(document) {
  return document ? document.toClient() : null;
}

function validIds(ids) {
  return ids.filter((id) => isValidId(id));
}

export async function findDailyEntryById(userId, id) {
  if (!isValidId(id)) return null;
  const entry = await DailyEntry.findOne({ _id: id, userId }).exec();
  return toClient(entry);
}

export async function findDailyEntryByDate(userId, date) {
  const entry = await DailyEntry.findOne({ userId, date }).exec();
  return toClient(entry);
}

export async function upsertDailyEntry(userId, { date, rawContent = "", status = "writing" }) {
  const entry = await DailyEntry.findOneAndUpdate(
    { userId, date },
    { $set: { rawContent, status } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).exec();

  return toClient(entry);
}

export async function getOrCreateDailyEntry(userId, date) {
  const existing = await findDailyEntryByDate(userId, date);
  return existing || upsertDailyEntry(userId, { date });
}

export async function updateDailyEntry(userId, id, payload) {
  const entry = await findDailyEntryById(userId, id);
  if (!entry) return null;

  const next = {
    date: payload.date ?? entry.date,
    rawContent: payload.rawContent ?? entry.rawContent,
    status: payload.status ?? entry.status
  };

  const updated = await DailyEntry.findOneAndUpdate({ _id: id, userId }, { $set: next }, { new: true }).exec();
  return toClient(updated);
}

export async function updateDailyStatus(userId, id, status) {
  if (!isValidId(id)) return;
  await DailyEntry.updateOne({ _id: id, userId }, { $set: { status } }).exec();
}

export async function upsertReality(userId, dailyEntryId, facts) {
  const reality = await RealityCheck.findOneAndUpdate(
    { userId, dailyEntryId },
    { $set: { facts } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).exec();

  return toClient(reality);
}

export async function getRealityByDaily(userId, dailyEntryId) {
  if (!isValidId(dailyEntryId)) return null;
  const reality = await RealityCheck.findOne({ userId, dailyEntryId }).exec();
  return toClient(reality);
}

export async function getRealityById(userId, id) {
  if (!isValidId(id)) return null;
  const reality = await RealityCheck.findOne({ _id: id, userId }).exec();
  return toClient(reality);
}

export async function updateReality(userId, id, facts) {
  if (!isValidId(id)) return null;
  const reality = await RealityCheck.findOneAndUpdate({ _id: id, userId }, { $set: { facts } }, { new: true }).exec();
  return toClient(reality);
}

export async function upsertVerification(userId, dailyEntryId, payload) {
  const verification = await Verification.findOneAndUpdate(
    { userId, dailyEntryId },
    {
      $set: {
        beliefBeingChecked: payload.beliefBeingChecked,
        beliefLevelBefore: payload.beliefLevelBefore,
        supportingBasis: payload.supportingBasis,
        isBasisEnough: payload.isBasisEnough,
        alternativePossibilities: payload.alternativePossibilities,
        reasoningConclusion: payload.reasoningConclusion,
        beliefLevelAfter: payload.beliefLevelAfter
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).exec();

  return toClient(verification);
}

export async function getVerificationByDaily(userId, dailyEntryId) {
  if (!isValidId(dailyEntryId)) return null;
  const verification = await Verification.findOne({ userId, dailyEntryId }).exec();
  return toClient(verification);
}

export async function getVerificationById(userId, id) {
  if (!isValidId(id)) return null;
  const verification = await Verification.findOne({ _id: id, userId }).exec();
  return toClient(verification);
}

export async function updateVerification(userId, id, payload) {
  const current = await getVerificationById(userId, id);
  if (!current) return null;

  return upsertVerification(userId, current.dailyEntryId, {
    beliefBeingChecked: payload.beliefBeingChecked ?? current.beliefBeingChecked,
    beliefLevelBefore: payload.beliefLevelBefore ?? current.beliefLevelBefore,
    supportingBasis: payload.supportingBasis ?? current.supportingBasis,
    isBasisEnough: payload.isBasisEnough ?? current.isBasisEnough,
    alternativePossibilities: payload.alternativePossibilities ?? current.alternativePossibilities,
    reasoningConclusion: payload.reasoningConclusion ?? current.reasoningConclusion,
    beliefLevelAfter: payload.beliefLevelAfter ?? current.beliefLevelAfter
  });
}

export async function upsertAwarenessTrace(userId, dailyEntryId, payload) {
  const trace = await AwarenessTrace.findOneAndUpdate(
    { userId, dailyEntryId },
    {
      $set: {
        verificationId: payload.verificationId,
        awarenessStatement: payload.awarenessStatement,
        reminderStatement: payload.reminderStatement,
        certaintyLevel: payload.certaintyLevel,
        themes: payload.themes
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).exec();

  return toClient(trace);
}

export async function getTraceByDaily(userId, dailyEntryId) {
  if (!isValidId(dailyEntryId)) return null;
  const trace = await AwarenessTrace.findOne({ userId, dailyEntryId }).exec();
  return toClient(trace);
}

export async function getTraceById(userId, id) {
  if (!isValidId(id)) return null;
  const trace = await AwarenessTrace.findOne({ _id: id, userId }).exec();
  return toClient(trace);
}

export async function getTraces(userId, order = "DESC") {
  const direction = order === "ASC" ? 1 : -1;
  const traces = await AwarenessTrace.find({ userId }).sort({ createdAt: direction }).exec();
  return traces.map(toClient);
}

export async function syncThemesForUser(userId) {
  const counts = new Map();
  const traces = await getTraces(userId, "ASC");

  for (const trace of traces) {
    for (const theme of trace.themes) {
      const name = normalizeThemeName(theme);
      if (name) counts.set(name, (counts.get(name) || 0) + 1);
    }
  }

  if (counts.size === 0) {
    await Theme.deleteMany({ userId }).exec();
    return;
  }

  const names = [...counts.keys()];
  await Theme.deleteMany({ userId, name: { $nin: names } }).exec();

  await Promise.all(
    [...counts.entries()].map(([name, traceCount]) =>
      Theme.findOneAndUpdate(
        { userId, name },
        { $set: { traceCount }, $setOnInsert: { relatedThemes: [] } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).exec()
    )
  );
}

export async function getThemes(userId) {
  const themes = await Theme.find({ userId }).sort({ traceCount: -1, name: 1 }).exec();
  return themes.map(toClient);
}

export async function getThemeById(userId, id) {
  if (!isValidId(id)) return null;
  const theme = await Theme.findOne({ _id: id, userId }).exec();
  return toClient(theme);
}

export async function getDailyEntriesByIds(ids) {
  const filtered = validIds(ids);
  if (!filtered.length) return [];
  const entries = await DailyEntry.find({ _id: { $in: filtered } }).exec();
  return entries.map(toClient);
}

export async function getVerificationsByIds(userId, ids) {
  const filtered = validIds(ids);
  if (!filtered.length) return [];
  const verifications = await Verification.find({ userId, _id: { $in: filtered } }).exec();
  return verifications.map(toClient);
}

export async function getTracesByTheme(userId, themeName) {
  const traces = await AwarenessTrace.find({ userId, themes: themeName }).sort({ createdAt: 1 }).exec();
  return traces.map(toClient);
}
