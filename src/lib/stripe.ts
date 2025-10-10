import Stripe from "stripe";
import { env } from "@/env/index.js";

// ✅ Instância global do Stripe (versão mais recente)
export const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

// ✅ Helper opcional — construir eventos de webhook com segurança
export function constructStripeEvent(rawBody: Buffer, signature: string) {
  return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET!);
}
