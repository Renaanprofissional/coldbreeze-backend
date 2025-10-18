import { FastifyInstance } from "fastify";
import { CouponController } from "./controller.js";

export async function couponRoutes(app: FastifyInstance) {
  // 🔹 Rota pública para buscar cupom
  app.get("/:code", CouponController.getByCode);
}
