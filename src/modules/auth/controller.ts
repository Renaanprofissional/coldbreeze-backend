import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./service.js";
import { registerSchema, loginSchema } from "./schemas.js";

export const AuthController = {
  async register(req: FastifyRequest, reply: FastifyReply) {
    const data = registerSchema.parse(req.body);
    const result = await AuthService.register(
      data.name,
      data.email,
      data.password
    );

    reply
      .setCookie("token", result.token, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 dias
        sameSite: "none", // ✅ cross-domain
        secure: true, // ✅ HTTPS obrigatório
        domain: ".coldbreeze.com.br", // ✅ funciona com e sem www
      })
      .send({ user: result.user });
  },

  async login(req: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(req.body);
    const result = await AuthService.login(data.email, data.password);

    reply
      .setCookie("token", result.token, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "none", // ✅
        secure: true, // ✅
      })
      .send({ user: result.user });
  },

  async logout(_req: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("token", {
      path: "/",
      sameSite: "none", // ✅ garante remoção correta
      secure: true,
    });

    reply.send({ message: "Logout realizado com sucesso" });
  },
};
