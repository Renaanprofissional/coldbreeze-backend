import { db } from "@/lib/prisma.js";

export const CartService = {
  // 🛒 Buscar o carrinho de um usuário
  async getCartByUser(userId: string) {
    return db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            productVariant: {
              include: { product: true },
            },
          },
        },
      },
    });
  },

  // ➕ Adicionar item ao carrinho
  async addItem(userId: string, variantId: string, quantity: number) {
    let cart = await db.cart.findUnique({ where: { userId } });

    // se o usuário ainda não tem carrinho, cria um
    if (!cart) {
      cart = await db.cart.create({
        data: { userId },
      });
    }

    // verifica se o item já existe
    const existingItem = await db.cartItem.findFirst({
      where: { cartId: cart.id, productVariantId: variantId },
    });

    if (existingItem) {
      return db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    // adiciona novo item
    return db.cartItem.create({
      data: {
        cartId: cart.id,
        productVariantId: variantId,
        quantity,
      },
    });
  },

  // ❌ Remover item
  async removeItem(userId: string, itemId: string) {
    const cart = await db.cart.findUnique({ where: { userId } });
    if (!cart) return null;

    await db.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id },
    });

    return this.getCartByUser(userId);
  },

  // 🧹 Limpar carrinho
  async clearCart(userId: string) {
    const cart = await db.cart.findUnique({ where: { userId } });
    if (!cart) return null;

    await db.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getCartByUser(userId);
  },
};
