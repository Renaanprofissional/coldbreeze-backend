import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./service.js";
import { registerSchema, loginSchema } from "./schemas.js";

export const AuthController = {
  async register(req: FastifyRequest, reply: FastifyReply) {
    const data = registerSchema.parse(req.body);
    const result = await AuthService.register(data.name, data.email, data.password);

    reply.setCookie("token", result.token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      secure: true,
      sameSite: "lax",
    });

    reply.send({ user: result.user });
  },

  async login(req: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(req.body);
    const result = await AuthService.login(data.email, data.password);

    reply.setCookie("token", result.token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      secure: true,
      sameSite: "lax",
    });

    reply.send({ user: result.user });
  },

  async logout(_req: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("token", { path: "/" });
    reply.send({ message: "Logout realizado com sucesso" });
  },
};
