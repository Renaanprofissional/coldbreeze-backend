import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../lib/jwt.js";

export async function authGuard(req: FastifyRequest, reply: FastifyReply) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return reply.status(401).send({ error: "Não autenticado" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return reply.status(401).send({ error: "Token inválido" });
    }

    // ✅ Injeta o usuário no objeto da requisição
    (req as any).user = {
      id: payload.id,
      email: payload.email,
    };

    // ✅ Continua o fluxo normalmente
    return;
  } catch (error) {
    console.error("Erro no authGuard:", error);
    return reply.status(401).send({ error: "Falha na autenticação" });
  }
}
