import { db } from "@/lib/prisma.js";

export const OrderService = {
  async listByUser(userId: string) {
    return db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { productVariant: { include: { product: true } } },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(userId: string, id: string) {
    return db.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: { productVariant: { include: { product: true } } },
        },
        shippingAddress: true,
      },
    });
  },

  async create(userId: string, shippingId: string) {
    // 1️⃣ busca carrinho do usuário
    const cart = await db.cart.findUnique({
      where: { userId },
      include: { items: { include: { productVariant: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Carrinho vazio");
    }

    // 2️⃣ calcula total
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
      0
    );

    // 3️⃣ cria o pedido
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

    // 4️⃣ limpa o carrinho
    await db.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  },
};
