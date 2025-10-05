import { FastifyInstance } from "fastify";
import { authGuard } from "@/shared/middlewares.js";
import { PaymentController } from "./controller.js";

export async function paymentRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authGuard);

  // Criar checkout (autenticado)
  app.post("/checkout", PaymentController.createCheckout);

  // Webhook do Stripe (não autenticado)
  app.post("/webhook", PaymentController.webhook);
}
