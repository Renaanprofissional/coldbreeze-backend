import { db } from "../../lib/prisma.js";
import { hashPassword, comparePassword } from "../../lib/bcrypt.js";
import { generateToken } from "../../lib/jwt.js";

export const AuthService = {
  async register(name: string, email: string, password: string) {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) throw new Error("E-mail já cadastrado.");

    const hashed = await hashPassword(password);
    const user = await db.user.create({
      data: { name, email, password: hashed },
    });

    const token = generateToken(user.id);
    return { user, token };
  },

  async login(email: string, password: string) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado.");

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error("Senha incorreta.");

    const token = generateToken(user.id);
    return { user, token };
  },
};
