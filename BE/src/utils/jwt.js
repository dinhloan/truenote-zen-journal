import jwt from "jsonwebtoken";

export function signAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    process.env.JWT_SECRET || "test-secret",
    { expiresIn: "7d" }
  );
}
