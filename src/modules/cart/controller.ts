import { FastifyReply, FastifyRequest } from "fastify";
import { CartService } from "./service.js";

export const CartController = {
  async getCart(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;
    const cart = await CartService.getCartByUser(user.id);
    return reply.send(cart || { items: [] });
  },

  async addItem(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;
    const { variantId, quantity } = req.body as { variantId: string; quantity: number };

    const item = await CartService.addItem(user.id, variantId, quantity);
    return reply.send(item);
  },

  async removeItem(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;
    const { itemId } = req.params as { itemId: string };

    const cart = await CartService.removeItem(user.id, itemId);
    return reply.send(cart);
  },

  async clear(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;
    const cart = await CartService.clearCart(user.id);
    return reply.send(cart);
  },
};
