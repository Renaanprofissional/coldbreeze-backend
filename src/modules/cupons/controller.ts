import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "@/lib/prisma.js";

export const CouponController = {
  // ✅ GET /coupons/:code
  async getByCode(req: FastifyRequest, reply: FastifyReply) {
    const { code } = req.params as { code: string };

    // Busca cupom pelo código
    const coupon = await db.coupon.findUnique({
      where: { code },
    });

    // Caso não exista ou esteja desativado
    if (!coupon || !coupon.active) {
      return reply.status(404).send({ error: "Cupom inválido ou expirado." });
    }

    // Valida período de validade (se existir)
    const now = new Date();
    if (
      (coupon.startsAt && coupon.startsAt > now) ||
      (coupon.endsAt && coupon.endsAt < now)
    ) {
      return reply.status(400).send({ error: "Cupom fora do período válido." });
    }

    // Retorna informações relevantes
    return reply.send({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  },
};
