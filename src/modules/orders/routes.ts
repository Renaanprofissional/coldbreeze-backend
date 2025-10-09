import { FastifyInstance } from "fastify";
import { authGuard } from "@/shared/middlewares.js";
import { OrderController } from "./controller.js";

export async function orderRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authGuard);

  app.get("/", OrderController.list);
  app.get("/:id", OrderController.get);
  app.post("/", OrderController.create);

  // 🧊 Novas rotas de gerenciamento:
  app.patch("/:id/cancel", OrderController.cancel);
  app.delete("/:id", OrderController.remove);
}
