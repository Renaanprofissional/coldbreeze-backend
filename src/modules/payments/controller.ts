import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "@/lib/prisma.js";
import { stripe } from "@/lib/stripe.js";
import { env } from "@/env/index.js";

export const PaymentController = {
  // ✅ 1. Webhook do Stripe — confirma pagamento
  async webhook(req: FastifyRequest, reply: FastifyReply) {
    const sig = req.headers["stripe-signature"] as string;

    try {
      const rawBody = Buffer.isBuffer(req.rawBody)
        ? req.rawBody
        : Buffer.from(req.rawBody || "");

      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );

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

      return reply.status(200).send({ received: true });
    } catch (err: any) {
      console.error("❌ Erro no webhook Stripe:", err.message);
      return reply.status(400).send(`Webhook Error: ${err.message}`);
    }
  },

  // ✅ 2. Cria sessão Stripe com frete incluído
  async createCheckout(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const { orderId } = req.body as { orderId: string };

    // 🔍 Busca pedido e itens
    const order = await db.order.findUnique({
      where: { id: orderId, userId: user.id },
      include: { items: { include: { productVariant: true } } },
    });

    if (!order)
      return reply.status(404).send({ message: "Pedido não encontrado" });

    // 💰 Calcula subtotal + frete
    const subtotalCents = order.items.reduce(
      (sum, item) => sum + item.priceInCents * item.quantity,
      0
    );
    const shippingCents = order.shippingPrice ?? 0;
    const totalCents = subtotalCents + shippingCents;

    // 🧾 Monta os itens do Stripe
    const lineItems = [
      ...order.items.map((item) => ({
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
      ...(shippingCents > 0
        ? [
            {
              price_data: {
                currency: "brl",
                product_data: { name: "Frete" },
                unit_amount: shippingCents,
              },
              quantity: 1,
            },
          ]
        : []),
    ];

    // 🚀 Cria sessão Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: { orderId: order.id },
      success_url: `${env.FRONTEND_URL}/success`,
      cancel_url: `${env.FRONTEND_URL}/orders`,
    });

    console.log(
      `💰 Sessão Stripe criada: R$ ${(totalCents / 100).toFixed(2)}`
    );

    return reply.send({ url: session.url });
  },
};
