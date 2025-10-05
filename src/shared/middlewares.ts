import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../lib/jwt.js";

export async function authGuard(req: FastifyRequest, reply: FastifyReply) {
  const token = req.cookies.token;
  if (!token) return reply.status(401).send({ error: "Não autenticado" });

  const payload = verifyToken(token);
  if (!payload) return reply.status(401).send({ error: "Token inválido" });

  req.user = { id: payload.userId };
}
