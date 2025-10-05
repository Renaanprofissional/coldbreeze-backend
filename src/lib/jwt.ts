import jwt from "jsonwebtoken";
import { env } from "../env/index.js";

export function generateToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}
