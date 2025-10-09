import { FastifyReply, FastifyRequest } from "fastify";
import { OrderService } from "./service.js";

export const OrderController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const orders = await OrderService.listByUser(user.id);
    return reply.send(orders);
  },

  async get(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const order = await OrderService.getById(user.id, id);

    if (!order) return reply.status(404).send({ message: "Pedido não encontrado" });
    return reply.send(order);
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const { shippingId } = req.body as { shippingId: string };

    const order = await OrderService.create(user.id, shippingId);
    return reply.code(201).send(order);
  },

  // 🧊 NOVO: Cancelar pedido
  async cancel(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const { id } = req.params as { id: string };

    const order = await OrderService.cancel(user.id, id);
    if (!order) return reply.status(404).send({ message: "Pedido não encontrado" });

    return reply.send({ message: "Pedido cancelado com sucesso", order });
  },

  // ❌ NOVO: Excluir pedido
  async remove(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const { id } = req.params as { id: string };

    const success = await OrderService.remove(user.id, id);
    if (!success) return reply.status(404).send({ message: "Pedido não encontrado" });

    return reply.send({ message: "Pedido excluído com sucesso" });
  },
};
