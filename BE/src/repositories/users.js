import { User } from "../models/User.js";

function toUser(document) {
  if (!document) return null;

  return {
    id: document._id.toString(),
    _id: document._id.toString(),
    name: document.name,
    email: document.email,
    passwordHash: document.passwordHash,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt
  };
}

export function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

export async function findUserByEmail(email) {
  const user = await User.findOne({ email }).exec();
  return toUser(user);
}

export async function findUserById(id) {
  const user = await User.findById(id).exec();
  return toUser(user);
}

export async function createUser({ name, email, passwordHash }) {
  const user = await User.create({ name, email, passwordHash });
  return toUser(user);
}
