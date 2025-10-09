import { db } from "@/lib/prisma.js";

export const OrderService = {
  async listByUser(userId: string) {
    return db.order.findMany({
      where: { userId },
      include: {
        items: { include: { productVariant: { include: { product: true } } } },
        shippingAddress: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(userId: string, id: string) {
    return db.order.findFirst({
      where: { id, userId },
      include: {
        items: { include: { productVariant: { include: { product: true } } } },
        shippingAddress: true,
      },
    });
  },

  async create(userId: string, shippingId: string) {
    const cart = await db.cart.findUnique({
      where: { userId },
      include: { items: { include: { productVariant: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Carrinho vazio");
    }

    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
      0
    );

    const order = await db.order.create({
      data: {
        userId,
        shippingId,
        totalPrice,
        items: {
          create: cart.items.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
          })),
        },
      },
      include: { items: true, shippingAddress: true },
    });

    await db.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  },

  // 🧊 Cancelar pedido
  async cancel(userId: string, id: string) {
    const order = await db.order.findFirst({ where: { id, userId } });
    if (!order) return null;

    if (order.status === "CANCELED") return order;

    return db.order.update({
      where: { id },
      data: { status: "CANCELED" },
    });
  },

  // ❌ Excluir pedido
  async remove(userId: string, id: string) {
    const order = await db.order.findFirst({ where: { id, userId } });
    if (!order) return false;

    await db.orderItem.deleteMany({ where: { orderId: id } });
    await db.order.delete({ where: { id } });
    return true;
  },
};
