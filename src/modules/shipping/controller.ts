import { FastifyReply, FastifyRequest } from "fastify";
import { ShippingService } from "./service.js";

export const ShippingController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user;
    const addresses = await ShippingService.listByUser(user!.id);
    return reply.send(addresses);
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user;
    const data = req.body as any;

    const address = await ShippingService.create(user!.id, data);
    return reply.code(201).send(address);
  },

  async remove(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user;
    const { id } = req.params as { id: string };

    await ShippingService.remove(user!.id, id);
    return reply.send({ success: true });
  },

  async calculate(req: FastifyRequest, reply: FastifyReply) {
    const { zipCode } = req.query as { zipCode: string };
    const result = await ShippingService.calculateShipping(zipCode);
    return reply.send(result);
  },
};
