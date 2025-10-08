import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../../lib/jwt.js";

export async function verifyUser(req: FastifyRequest, reply: FastifyReply) {
  try {
    const token = req.cookies.token;
    if (!token) return reply.status(401).send({ message: "Não autenticado" });

    const decoded = verifyToken(token);
    (req as any).user = decoded; // anexa dados do usuário na request
  } catch (err) {
    return reply.status(401).send({ message: "Token inválido" });
  }
}
