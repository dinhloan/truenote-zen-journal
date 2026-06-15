import request from "supertest";
import { describe, expect, it } from "vitest";
import { app, registerAndLogin } from "./helpers.js";

describe("auth routes", () => {
  it("registers a user and returns a JWT plus safe profile", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Awareness Writer",
        email: "writer@example.com",
        password: "password123"
      })
      .expect(201);

    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      name: "Awareness Writer",
      email: "writer@example.com"
    });
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  it("logs in and protects /me", async () => {
    await registerAndLogin({ email: "me@example.com" });

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "me@example.com", password: "password123" })
      .expect(200);

    const me = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${login.body.token}`).expect(200);

    expect(me.body.user.email).toBe("me@example.com");
  });

  it("rejects duplicate registrations", async () => {
    await registerAndLogin({ email: "dupe@example.com" });

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Second User",
        email: "dupe@example.com",
        password: "password123"
      })
      .expect(409);
  });
});
