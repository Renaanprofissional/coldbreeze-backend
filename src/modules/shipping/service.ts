import { db } from "@/lib/prisma.js";

export const ShippingService = {
  async listByUser(userId: string) {
    const addresses = await db.shippingAddress.findMany({ where: { userId } });

    const addressesWithFrete = await Promise.all(
      addresses.map(async (address) => {
        const frete = await this.calculateShipping(address.zipCode);
        return { ...address, frete };
      })
    );

    return addressesWithFrete;
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

  /**
   * 🚚 Calcula frete de forma profissional com base no CEP.
   * - Faixas definidas por região do Brasil
   * - Valores e prazos simulados com realismo
   */
  async calculateShipping(zipCode: string) {
    const cleanCep = zipCode.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      throw new Error("CEP inválido");
    }

    // Extrai os dois primeiros dígitos do CEP (faixa regional)
    const prefix = parseInt(cleanCep.substring(0, 2));

    let price = 39.9;
    let days = 7;

    // 🗺️ Tabelas profissionais (baseadas nos prefixos do CEP)
    if (prefix >= 0 && prefix <= 19) {
      // SP / Sudeste
      price = 14.8;
      days = 3;
    } else if (prefix >= 20 && prefix <= 28) {
      // RJ / Sudeste
      price = 24.9;
      days = 5;
    } else if (prefix >= 29 && prefix <= 29) {
      // ES
      price = 26.9;
      days = 5;
    } else if (prefix >= 30 && prefix <= 39) {
      // MG
      price = 22.9;
      days = 5;
    } else if (prefix >= 40 && prefix <= 49) {
      // Nordeste (BA, SE, AL, PE, PB, RN, CE)
      price = 29.9;
      days = 6;
    } else if (prefix >= 50 && prefix <= 57) {
      // Centro-Oeste (DF, GO, MS, MT)
      price = 27.9;
      days = 6;
    } else if (prefix >= 58 && prefix <= 59) {
      // Norte do Nordeste (PB, RN)
      price = 31.9;
      days = 7;
    } else if (prefix >= 60 && prefix <= 69) {
      // Norte (PA, AM, AC, RO, RR, AP)
      price = 39.9;
      days = 9;
    } else if (prefix >= 70 && prefix <= 73) {
      // DF
      price = 28.9;
      days = 6;
    } else if (prefix >= 80 && prefix <= 89) {
      // Sul (PR, SC, RS)
      price = 25.9;
      days = 5;
    }

    return { price, days };
  },
};
