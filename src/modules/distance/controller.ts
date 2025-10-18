import { FastifyRequest, FastifyReply } from "fastify";
import { DistanceService } from "./service.js";

export class DistanceController {
  static async calcular(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { city, state } = req.query as { city?: string; state?: string };

      if (!city || !state) {
        return reply
          .status(400)
          .send({ error: "Parâmetros 'city' e 'state' são obrigatórios." });
      }

      const valor = await DistanceService.calcularFrete(city, state);

      return reply.send({
        city,
        state,
        valor,
        moeda: "BRL",
        mensagem: `Frete para ${city}/${state}: R$${valor.toFixed(2)}`,
      });
    } catch (error: any) {
      console.error("Erro ao calcular frete:", error);
      return reply
        .status(500)
        .send({ error: "Erro interno ao calcular o frete" });
    }
  }
}
