import { randomUUID } from "node:crypto";
import { getDb } from "../config/database.js";
import { normalizeThemeName } from "../utils/normalize.js";

function jsonParse(value, fallback = []) {
  try {
    return JSON.parse(value || "null") ?? fallback;
  } catch (_error) {
    return fallback;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function toDailyEntry(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    rawContent: row.raw_content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toReality(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    dailyEntryId: row.daily_entry_id,
    facts: jsonParse(row.facts),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toVerification(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    dailyEntryId: row.daily_entry_id,
    beliefBeingChecked: row.belief_being_checked,
    beliefLevelBefore: row.belief_level_before,
    supportingBasis: jsonParse(row.supporting_basis),
    isBasisEnough: row.is_basis_enough,
    alternativePossibilities: jsonParse(row.alternative_possibilities),
    reasoningConclusion: row.reasoning_conclusion,
    beliefLevelAfter: row.belief_level_after,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toTrace(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    dailyEntryId: row.daily_entry_id,
    verificationId: row.verification_id,
    awarenessStatement: row.awareness_statement,
    reminderStatement: row.reminder_statement,
    certaintyLevel: row.certainty_level,
    themes: jsonParse(row.themes),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toTheme(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    traceCount: row.trace_count,
    relatedThemes: jsonParse(row.related_themes),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function findDailyEntryById(userId, id) {
  return toDailyEntry(getDb().prepare("SELECT * FROM daily_entries WHERE id = ? AND user_id = ?").get(id, userId));
}

export function findDailyEntryByDate(userId, date) {
  return toDailyEntry(getDb().prepare("SELECT * FROM daily_entries WHERE user_id = ? AND date = ?").get(userId, date));
}

export function upsertDailyEntry(userId, { date, rawContent = "", status = "writing" }) {
  const existing = findDailyEntryByDate(userId, date);
  const timestamp = nowIso();

  if (existing) {
    getDb()
      .prepare("UPDATE daily_entries SET raw_content = ?, status = ?, updated_at = ? WHERE id = ?")
      .run(rawContent, status, timestamp, existing.id);
    return findDailyEntryById(userId, existing.id);
  }

  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO daily_entries (id, user_id, date, raw_content, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(id, userId, date, rawContent, status, timestamp, timestamp);

  return findDailyEntryById(userId, id);
}

export function getOrCreateDailyEntry(userId, date) {
  return findDailyEntryByDate(userId, date) || upsertDailyEntry(userId, { date });
}

export function updateDailyEntry(userId, id, payload) {
  const entry = findDailyEntryById(userId, id);
  if (!entry) return null;

  const next = {
    date: payload.date ?? entry.date,
    rawContent: payload.rawContent ?? entry.rawContent,
    status: payload.status ?? entry.status
  };

  getDb()
    .prepare("UPDATE daily_entries SET date = ?, raw_content = ?, status = ?, updated_at = ? WHERE id = ? AND user_id = ?")
    .run(next.date, next.rawContent, next.status, nowIso(), id, userId);

  return findDailyEntryById(userId, id);
}

export function updateDailyStatus(userId, id, status) {
  getDb().prepare("UPDATE daily_entries SET status = ?, updated_at = ? WHERE id = ? AND user_id = ?").run(status, nowIso(), id, userId);
}

export function upsertReality(userId, dailyEntryId, facts) {
  const existing = getRealityByDaily(userId, dailyEntryId);
  const timestamp = nowIso();
  const encodedFacts = JSON.stringify(facts);

  if (existing) {
    getDb().prepare("UPDATE reality_checks SET facts = ?, updated_at = ? WHERE id = ?").run(encodedFacts, timestamp, existing.id);
    return getRealityById(userId, existing.id);
  }

  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO reality_checks (id, user_id, daily_entry_id, facts, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(id, userId, dailyEntryId, encodedFacts, timestamp, timestamp);

  return getRealityById(userId, id);
}

export function getRealityByDaily(userId, dailyEntryId) {
  return toReality(getDb().prepare("SELECT * FROM reality_checks WHERE user_id = ? AND daily_entry_id = ?").get(userId, dailyEntryId));
}

export function getRealityById(userId, id) {
  return toReality(getDb().prepare("SELECT * FROM reality_checks WHERE id = ? AND user_id = ?").get(id, userId));
}

export function updateReality(userId, id, facts) {
  const reality = getRealityById(userId, id);
  if (!reality) return null;
  getDb().prepare("UPDATE reality_checks SET facts = ?, updated_at = ? WHERE id = ?").run(JSON.stringify(facts), nowIso(), id);
  return getRealityById(userId, id);
}

export function upsertVerification(userId, dailyEntryId, payload) {
  const existing = getVerificationByDaily(userId, dailyEntryId);
  const timestamp = nowIso();
  const values = {
    beliefBeingChecked: payload.beliefBeingChecked,
    beliefLevelBefore: payload.beliefLevelBefore,
    supportingBasis: JSON.stringify(payload.supportingBasis),
    isBasisEnough: payload.isBasisEnough,
    alternativePossibilities: JSON.stringify(payload.alternativePossibilities),
    reasoningConclusion: payload.reasoningConclusion,
    beliefLevelAfter: payload.beliefLevelAfter
  };

  if (existing) {
    getDb()
      .prepare(
        `UPDATE verifications
         SET belief_being_checked = ?, belief_level_before = ?, supporting_basis = ?, is_basis_enough = ?,
             alternative_possibilities = ?, reasoning_conclusion = ?, belief_level_after = ?, updated_at = ?
         WHERE id = ?`
      )
      .run(
        values.beliefBeingChecked,
        values.beliefLevelBefore,
        values.supportingBasis,
        values.isBasisEnough,
        values.alternativePossibilities,
        values.reasoningConclusion,
        values.beliefLevelAfter,
        timestamp,
        existing.id
      );
    return getVerificationById(userId, existing.id);
  }

  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO verifications (
        id, user_id, daily_entry_id, belief_being_checked, belief_level_before, supporting_basis,
        is_basis_enough, alternative_possibilities, reasoning_conclusion, belief_level_after, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      userId,
      dailyEntryId,
      values.beliefBeingChecked,
      values.beliefLevelBefore,
      values.supportingBasis,
      values.isBasisEnough,
      values.alternativePossibilities,
      values.reasoningConclusion,
      values.beliefLevelAfter,
      timestamp,
      timestamp
    );

  return getVerificationById(userId, id);
}

export function getVerificationByDaily(userId, dailyEntryId) {
  return toVerification(getDb().prepare("SELECT * FROM verifications WHERE user_id = ? AND daily_entry_id = ?").get(userId, dailyEntryId));
}

export function getVerificationById(userId, id) {
  return toVerification(getDb().prepare("SELECT * FROM verifications WHERE id = ? AND user_id = ?").get(id, userId));
}

export function updateVerification(userId, id, payload) {
  const current = getVerificationById(userId, id);
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

export function upsertAwarenessTrace(userId, dailyEntryId, payload) {
  const existing = getTraceByDaily(userId, dailyEntryId);
  const timestamp = nowIso();
  const themes = JSON.stringify(payload.themes);

  if (existing) {
    getDb()
      .prepare(
        `UPDATE awareness_traces
         SET verification_id = ?, awareness_statement = ?, reminder_statement = ?, certainty_level = ?, themes = ?, updated_at = ?
         WHERE id = ?`
      )
      .run(payload.verificationId, payload.awarenessStatement, payload.reminderStatement, payload.certaintyLevel, themes, timestamp, existing.id);
    return getTraceById(userId, existing.id);
  }

  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO awareness_traces (
        id, user_id, daily_entry_id, verification_id, awareness_statement, reminder_statement,
        certainty_level, themes, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      userId,
      dailyEntryId,
      payload.verificationId,
      payload.awarenessStatement,
      payload.reminderStatement,
      payload.certaintyLevel,
      themes,
      timestamp,
      timestamp
    );

  return getTraceById(userId, id);
}

export function getTraceByDaily(userId, dailyEntryId) {
  return toTrace(getDb().prepare("SELECT * FROM awareness_traces WHERE user_id = ? AND daily_entry_id = ?").get(userId, dailyEntryId));
}

export function getTraceById(userId, id) {
  return toTrace(getDb().prepare("SELECT * FROM awareness_traces WHERE id = ? AND user_id = ?").get(id, userId));
}

export function getTraces(userId, order = "DESC") {
  const direction = order === "ASC" ? "ASC" : "DESC";
  return getDb()
    .prepare(`SELECT * FROM awareness_traces WHERE user_id = ? ORDER BY created_at ${direction}`)
    .all(userId)
    .map(toTrace);
}

export function syncThemesForUser(userId) {
  const counts = new Map();
  for (const trace of getTraces(userId, "ASC")) {
    for (const theme of trace.themes) {
      const name = normalizeThemeName(theme);
      if (name) counts.set(name, (counts.get(name) || 0) + 1);
    }
  }

  const db = getDb();
  const timestamp = nowIso();

  if (counts.size === 0) {
    db.prepare("DELETE FROM themes WHERE user_id = ?").run(userId);
    return;
  }

  const names = [...counts.keys()];
  const placeholders = names.map(() => "?").join(", ");
  db.prepare(`DELETE FROM themes WHERE user_id = ? AND name NOT IN (${placeholders})`).run(userId, ...names);

  const upsert = db.prepare(
    `INSERT INTO themes (id, user_id, name, trace_count, related_themes, created_at, updated_at)
     VALUES (?, ?, ?, ?, '[]', ?, ?)
     ON CONFLICT(user_id, name) DO UPDATE SET trace_count = excluded.trace_count, updated_at = excluded.updated_at`
  );

  for (const [name, traceCount] of counts.entries()) {
    upsert.run(randomUUID(), userId, name, traceCount, timestamp, timestamp);
  }
}

export function getThemes(userId) {
  return getDb()
    .prepare("SELECT * FROM themes WHERE user_id = ? ORDER BY trace_count DESC, name ASC")
    .all(userId)
    .map(toTheme);
}

export function getThemeById(userId, id) {
  return toTheme(getDb().prepare("SELECT * FROM themes WHERE id = ? AND user_id = ?").get(id, userId));
}

export function getDailyEntriesByIds(ids) {
  if (!ids.length) return [];
  const placeholders = ids.map(() => "?").join(", ");
  return getDb()
    .prepare(`SELECT * FROM daily_entries WHERE id IN (${placeholders})`)
    .all(...ids)
    .map(toDailyEntry);
}

export function getVerificationsByIds(userId, ids) {
  if (!ids.length) return [];
  const placeholders = ids.map(() => "?").join(", ");
  return getDb()
    .prepare(`SELECT * FROM verifications WHERE user_id = ? AND id IN (${placeholders})`)
    .all(userId, ...ids)
    .map(toVerification);
}

export function getTracesByTheme(userId, themeName) {
  return getTraces(userId, "ASC").filter((trace) => trace.themes.includes(themeName));
}
