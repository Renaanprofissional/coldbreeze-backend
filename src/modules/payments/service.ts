import { stripe } from "@/lib/stripe.js";
import { db } from "@/lib/prisma.js";
import { env } from "@/env/index.js";

export const PaymentService = {
  async createCheckoutSession(orderId: string) {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { productVariant: { include: { product: true } } },
        },
        user: true,
      },
    });

    if (!order) throw new Error("Pedido não encontrado");
    if (!order.items.length) throw new Error("Pedido sem itens");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${env.FRONTEND_URL}/success?order=${order.id}`,
      cancel_url: `${env.FRONTEND_URL}/cancel?order=${order.id}`,
      customer_email: order.user.email,
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "brl",
          unit_amount: item.priceInCents,
          product_data: {
            name: item.productVariant.product.name,
            description: item.productVariant.color,
            images: [item.productVariant.imageUrl],
          },
        },
        quantity: item.quantity,
      })),
      metadata: { orderId: order.id },
    });

    return { url: session.url };
  },
};
