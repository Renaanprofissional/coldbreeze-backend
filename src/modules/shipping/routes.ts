import { FastifyInstance } from "fastify";
import { ShippingController } from "./controller.js";
import { authGuard } from "@/shared/middlewares.js";

export async function shippingRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authGuard);

  app.get("/", ShippingController.list);
  app.post("/", ShippingController.create);
  app.delete("/:id", ShippingController.remove);

  // 🚚 Cálculo de frete (rota pública)
  app.get("/calculate", ShippingController.calculate);
}
