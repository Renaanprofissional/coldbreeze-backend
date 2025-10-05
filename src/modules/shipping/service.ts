import { db } from "@/lib/prisma.js";

export const ShippingService = {
  async listByUser(userId: string) {
    return db.shippingAddress.findMany({ where: { userId } });
  },

  async create(userId: string, data: any) {
    return db.shippingAddress.create({
      data: {
        userId,
        recipient: data.recipient,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phone,
      },
    });
  },

  async remove(userId: string, id: string) {
    const address = await db.shippingAddress.findUnique({ where: { id } });
    if (!address || address.userId !== userId) {
      throw new Error("Endereço não encontrado ou não pertence ao usuário");
    }
    return db.shippingAddress.delete({ where: { id } });
  },

  async calculateShipping(zipCode: string) {
    // 🚚 Frete fixo inicial (você pode integrar com a API dos Correios depois)
    if (zipCode.startsWith("1")) return { price: 19.9, days: 3 };
    if (zipCode.startsWith("2")) return { price: 24.9, days: 5 };
    return { price: 29.9, days: 7 };
  },
};
