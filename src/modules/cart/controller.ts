import { FastifyReply, FastifyRequest } from "fastify";
import { CartService } from "./service.js";

export const CartController = {
  // 🛒 Buscar o carrinho do usuário
  async getCart(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;
    const cart = await CartService.getCartByUser(user.id);

    // 🔹 Garante que o front receba sempre um objeto com items (mesmo vazio)
    return reply.send(cart || { items: [] });
  },

  // ➕ Adicionar item ao carrinho
  async addItem(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;
    const { variantId, quantity } = req.body as { variantId: string; quantity: number };

    const item = await CartService.addItem(user.id, variantId, quantity);

    // 🔹 Retorna o carrinho atualizado em vez de apenas o item
    const updatedCart = await CartService.getCartByUser(user.id);
    return reply.send(updatedCart || { items: [] });
  },

  // ❌ Remover item do carrinho
  async removeItem(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;
    const { itemId } = req.params as { itemId: string };

    const cart = await CartService.removeItem(user.id, itemId);

    // 🔹 Corrigido: evita status 204 retornando sempre um objeto
    return reply.send(cart || { items: [] });
  },

  // 🧹 Limpar carrinho
  async clear(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;
    const cart = await CartService.clearCart(user.id);

    // 🔹 Corrigido: sempre retorna um JSON
    return reply.send(cart || { items: [] });
  },
};
