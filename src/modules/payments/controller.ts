import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "@/lib/prisma.js";
import { stripe, constructStripeEvent } from "@/lib/stripe.js";
import { env } from "@/env/index.js";

export const PaymentController = {
  // ✅ 1. WEBHOOK — Stripe notifica pagamento concluído
  async webhook(req: FastifyRequest, reply: FastifyReply) {
    const sig = req.headers["stripe-signature"] as string;

    try {
      const rawBody = Buffer.isBuffer(req.rawBody)
        ? req.rawBody
        : Buffer.from(req.rawBody || "");

      const event = constructStripeEvent(rawBody, sig);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await db.order.update({
            where: { id: orderId },
            data: { status: "PAID" },
          });
          console.log(`✅ Pedido ${orderId} atualizado para PAID`);
        }
      }

      reply.status(200).send({ received: true });
    } catch (err: any) {
      console.error("❌ Erro ao validar webhook:", err.message);
      reply.status(400).send(`Webhook Error: ${err.message}`);
    }
  },

  // ✅ 2. CHECKOUT — cria sessão Stripe e retorna a URL
  async createCheckout(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const { orderId } = req.body as { orderId: string };

    const order = await db.order.findUnique({
      where: { id: orderId, userId: user.id },
      include: { items: { include: { productVariant: true } } },
    });

    if (!order) {
      return reply.status(404).send({ message: "Pedido não encontrado" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.productVariant.name,
            images: [item.productVariant.imageUrl],
          },
          unit_amount: item.priceInCents,
        },
        quantity: item.quantity,
      })),
      metadata: { orderId: order.id },
      success_url: `${env.FRONTEND_URL}/success`,
      cancel_url: `${env.FRONTEND_URL}/orders`,
    });

    reply.send({ url: session.url });
  },
};
