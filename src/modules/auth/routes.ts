import { FastifyInstance } from "fastify";
import { AuthController } from "./controller.js";
import { verifyToken } from "@/lib/jwt.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", AuthController.register);
  app.post("/login", AuthController.login);
  app.post("/logout", AuthController.logout);
  app.get("/teste", async (req, reply) => {
    try {
      const token = req.cookies.token;
      if (!token) return reply.status(401).send({ message: "Não autenticado" });
      const decoded = verifyToken(token);
      return reply.send({ user: decoded });
    } catch (err) {
      return reply.status(401).send({ message: "Token inválido" });
    }
  });
}
