import request from "supertest";
import { createApp } from "../src/app.js";

export const app = createApp();

export async function registerAndLogin(overrides = {}) {
  const payload = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    ...overrides
  };

  const response = await request(app).post("/api/auth/register").send(payload).expect(201);

  return {
    token: response.body.token,
    user: response.body.user,
    authHeader: `Bearer ${response.body.token}`
  };
}

export async function createDailyEntry(authHeader, overrides = {}) {
  const response = await request(app)
    .post("/api/daily")
    .set("Authorization", authHeader)
    .send({
      date: "2026-05-14",
      rawContent: "Hom nay minh rat met va dang nghi nhieu.",
      status: "raw",
      ...overrides
    })
    .expect(201);

  return response.body.dailyEntry;
}
