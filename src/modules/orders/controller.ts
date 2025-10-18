import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "@/lib/prisma.js";
import { ShippingService } from "../shipping/service.js";
import { OrderService } from "./service.js";

export const OrderController = {
  // 📦 Listar pedidos do usuário
  async list(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const orders = await OrderService.listByUser(user.id);
    return reply.send(orders);
  },

  // 🔍 Buscar pedido específico
  async get(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const { id } = req.params as { id: string };

    const order = await OrderService.getById(user.id, id);
    if (!order)
      return reply.status(404).send({ message: "Pedido não encontrado" });

    return reply.send(order);
  },

  // 🧾 Criar novo pedido
  async create(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const { shippingId } = req.body as { shippingId: string };

    // 🔍 Busca o endereço
    const address = await db.shippingAddress.findUnique({
      where: { id: shippingId },
    });
    if (!address)
      return reply.status(404).send({ message: "Endereço não encontrado" });

    // 🚚 Calcula o frete
    const frete = await ShippingService.calculateShipping(address.zipCode);

    // 🛒 Cria pedido com base no carrinho
    const order = await OrderService.create(user.id, shippingId);

    // 💰 Atualiza o pedido com o frete
    await db.order.update({
      where: { id: order.id },
      data: {
        shippingPrice: Math.round(frete.price * 100),
        totalPrice: order.totalPrice + Math.round(frete.price * 100),
        status: "PENDING",
      },
    });

    return reply.code(201).send(order);
  },

  // 🚫 Cancelar pedido (somente se estiver pendente)
  async cancel(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const { id } = req.params as { id: string };

    const order = await db.order.findFirst({
      where: { id, userId: user.id },
    });

    if (!order)
      return reply.status(404).send({ message: "Pedido não encontrado" });

    if (order.status !== "PENDING") {
      return reply
        .status(400)
        .send({ message: "Apenas pedidos pendentes podem ser cancelados" });
    }

    await db.order.update({
      where: { id },
      data: { status: "CANCELED" },
    });

    return reply.send({ success: true });
  },

  // 🗑️ Excluir pedido (somente se cancelado)
  async remove(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user!;
    const { id } = req.params as { id: string };

    const order = await db.order.findFirst({
      where: { id, userId: user.id },
    });

    if (!order)
      return reply.status(404).send({ message: "Pedido não encontrado" });

    // ✅ Garante que só exclui se for cancelado
    const status = String(order.status).toUpperCase();
    if (status !== "CANCELED") {
      return reply
        .status(400)
        .send({ message: "Só é possível excluir pedidos cancelados" });
    }

    // 🧩 Usa o service para limpar itens e excluir pedido
    const result = await OrderService.remove(user.id, id);
    if (!result)
      return reply.status(404).send({ message: "Erro ao excluir pedido" });

    return reply.send({ success: true });
  },
};
