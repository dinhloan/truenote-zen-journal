import request from "supertest";
import { describe, expect, it } from "vitest";
import { app, createDailyEntry, registerAndLogin } from "./helpers.js";

describe("daily awareness flow", () => {
  it("creates and updates a daily entry", async () => {
    const { authHeader } = await registerAndLogin();
    const entry = await createDailyEntry(authHeader);

    expect(entry.status).toBe("raw");

    const update = await request(app)
      .put(`/api/daily/${entry.id}`)
      .set("Authorization", authHeader)
      .send({ rawContent: "Minh da viet ro hon.", status: "writing" })
      .expect(200);

    expect(update.body.dailyEntry.rawContent).toBe("Minh da viet ro hon.");
    expect(update.body.dailyEntry.status).toBe("writing");
  });

  it("saves reality, verification, awareness trace, and updates themes", async () => {
    const { authHeader } = await registerAndLogin();
    const entry = await createDailyEntry(authHeader);

    const reality = await request(app)
      .post(`/api/daily/${entry.id}/reality`)
      .set("Authorization", authHeader)
      .send({
        facts: [
          "Ho chua tra loi trong 5 tieng",
          "Minh chua hoi ly do",
          "Ho chua tra loi trong 5 tieng"
        ]
      })
      .expect(201);

    expect(reality.body.realityCheck.facts).toEqual(["Ho chua tra loi trong 5 tieng", "Minh chua hoi ly do"]);

    const verification = await request(app)
      .post(`/api/daily/${entry.id}/verification`)
      .set("Authorization", authHeader)
      .send({
        beliefBeingChecked: "Ho khong con quan tam minh",
        beliefLevelBefore: 4,
        supportingBasis: ["Ho chua tra loi trong 5 tieng"],
        isBasisEnough: "not_enough",
        alternativePossibilities: ["Ho co the dang ban", "Ho co the chua thay tin"],
        reasoningConclusion: "Minh chua du co so de ket luan dieu do.",
        beliefLevelAfter: 2
      })
      .expect(201);

    const trace = await request(app)
      .post(`/api/daily/${entry.id}/awareness-trace`)
      .set("Authorization", authHeader)
      .send({
        verificationId: verification.body.verification.id,
        awarenessStatement: "Minh hay bien su im lang thanh bang chung minh khong quan trong.",
        reminderStatement: "Su im lang khong dong nghia voi tu choi.",
        certaintyLevel: 4,
        themes: ["So bi bo roi", "Gia tri ban than", "So bi bo roi"]
      })
      .expect(201);

    expect(trace.body.awarenessTrace.themes).toEqual(["so bi bo roi", "gia tri ban than"]);

    const map = await request(app).get("/api/awareness-map").set("Authorization", authHeader).expect(200);

    expect(map.body.themes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "so bi bo roi", traceCount: 1 }),
        expect.objectContaining({ name: "gia tri ban than", traceCount: 1 })
      ])
    );
    expect(map.body.timeline).toHaveLength(1);
  });

  it("does not allow one user to read another user's entry", async () => {
    const first = await registerAndLogin({ email: "first@example.com" });
    const second = await registerAndLogin({ email: "second@example.com" });
    const entry = await createDailyEntry(first.authHeader);

    await request(app).put(`/api/daily/${entry.id}`).set("Authorization", second.authHeader).send({ status: "raw" }).expect(404);
  });
});
