import jwt from "jsonwebtoken";
import { env } from "../env/index.js";

// Tipagem do payload do token
interface TokenPayload {
  id: string;
  email: string;
}

// 🔹 Gera token com id + email
export function generateToken(user: TokenPayload) {
  return jwt.sign(
    { sub: user.id, email: user.email }, // 👈 inclui email
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// 🔹 Verifica token e retorna o payload
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    return { id: decoded.sub as string, email: decoded.email as string };
  } catch {
    return null;
  }
}
