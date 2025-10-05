import { FastifyInstance } from "fastify";
import { CartController } from "./controller.js";
import { authGuard } from "@/shared/middlewares.js";

export async function cartRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authGuard);

  app.get("/", CartController.getCart);
  app.post("/add", CartController.addItem);
  app.delete("/remove/:itemId", CartController.removeItem);
  app.delete("/clear", CartController.clear);
}
