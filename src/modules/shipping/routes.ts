import { FastifyInstance } from "fastify";
import { ShippingController } from "./controller.js";
import { authGuard } from "@/shared/middlewares.js";

export async function shippingRoutes(app: FastifyInstance) {
  // 🚚 Cálculo de frete (rota pública)
  app.get("/calculate", ShippingController.calculate);

  // 🔒 Rotas protegidas (usuário precisa estar logado)
  app.get("/", { preHandler: authGuard }, ShippingController.list);
  app.post("/", { preHandler: authGuard }, ShippingController.create);
  app.delete("/:id", { preHandler: authGuard }, ShippingController.remove);
}
