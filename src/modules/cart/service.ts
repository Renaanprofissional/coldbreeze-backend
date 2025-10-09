import { db } from "@/lib/prisma.js";

export const CartService = {
  // 🛒 Buscar o carrinho de um usuário
  async getCartByUser(userId: string) {
    const cart = await db.cart.findUnique({
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

    // ✅ Sempre retorna estrutura consistente
    return cart || { items: [] };
  },

  // ➕ Adicionar item ao carrinho
  async addItem(userId: string, variantId: string, quantity: number) {
    let cart = await db.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await db.cart.create({ data: { userId } });
    }

    const existingItem = await db.cartItem.findFirst({
      where: { cartId: cart.id, productVariantId: variantId },
    });

    if (existingItem) {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId: variantId,
          quantity,
        },
      });
    }

    return this.getCartByUser(userId);
  },

  // ❌ Remover item
  async removeItem(userId: string, itemId: string) {
    const cart = await db.cart.findUnique({ where: { userId } });
    if (!cart) return { items: [] };

    await db.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id },
    });

    return (await this.getCartByUser(userId)) || { items: [] };
  },

  // 🧹 Limpar carrinho completamente
  async clearCart(userId: string) {
    const cart = await db.cart.findUnique({ where: { userId } });

    // ⚠️ Garante retorno mesmo sem carrinho
    if (!cart) {
      return { items: [] };
    }

    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // ✅ Retorna estrutura consistente mesmo vazia
    const updatedCart = await this.getCartByUser(userId);
    return updatedCart || { items: [] };
  },
};
