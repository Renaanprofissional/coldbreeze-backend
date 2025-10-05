import { FastifyInstance } from "fastify";
import { AuthController } from "./controller.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", AuthController.register);
  app.post("/login", AuthController.login);
  app.post("/logout", AuthController.logout);
}
