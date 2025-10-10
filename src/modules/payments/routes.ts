import { FastifyInstance } from "fastify";
import { authGuard } from "@/shared/middlewares.js";
import { PaymentController } from "./controller.js";

export async function paymentRoutes(app: FastifyInstance) {
  // ⚡ Público (Stripe → backend)
  app.post("/webhook", { config: { rawBody: true } }, PaymentController.webhook);

  // 🔐 Protegido (Frontend → backend)
  app.post("/checkout", { preHandler: [authGuard] }, PaymentController.createCheckout);
}
