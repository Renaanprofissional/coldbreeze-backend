import { FastifyInstance } from "fastify";
import { authGuard } from "@/shared/middlewares.js";
import { PaymentController } from "./controller.js";

export async function paymentRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authGuard);

  // Autenticado: cria sessão de checkout
  app.post("/checkout", { preHandler: [authGuard] }, PaymentController.createCheckout);

  // Público: Stripe chama esse endpoint
  app.post("/webhook", PaymentController.webhook);
}
