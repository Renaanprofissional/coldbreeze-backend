import { FastifyReply, FastifyRequest } from "fastify";
import { PaymentService } from "./service.js";
import { stripe } from "@/lib/stripe.js";
import { db } from "@/lib/prisma.js";
import { env } from "@/env/index.js";

export const PaymentController = {
  async createCheckout(req: FastifyRequest, reply: FastifyReply) {
    const { orderId } = req.body as { orderId: string };
    const session = await PaymentService.createCheckoutSession(orderId);
    return reply.send(session);
  },

  async webhook(req: FastifyRequest, reply: FastifyReply) {
    const sig = req.headers["stripe-signature"];
    if (!sig) return reply.status(400).send("Missing Stripe signature");

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        (req as any).rawBody,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      return reply.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId = session.metadata?.orderId as string | undefined;
      if (orderId) {
        await db.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });
      }
    }

    return reply.send({ received: true });
  },
};
