// src/modules/distance/controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { DistanceService } from "./service.js";

export const DistanceController = {
  async calculate(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { cep } = req.query as { cep: string };
      if (!cep) return reply.status(400).send({ error: "CEP é obrigatório." });

      const result = await DistanceService.calculateDistanceByCep(cep);
      reply.send(result);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  },
};
