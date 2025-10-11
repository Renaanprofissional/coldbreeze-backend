import fetch from "node-fetch";

interface Coordinates {
  lat: number;
  lon: number;
}

interface BrasilApiResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood?: string;
  street?: string;
  location?: {
    type: string;
    coordinates?: {
      longitude: number;
      latitude: number;
    };
  };
}

export class DistanceService {
  // 🧭 Obtém coordenadas (BrasilAPI → fallback Nominatim)
  private static async getCoordinates(cep: string): Promise<Coordinates> {
    const cleanCep = cep.replace(/\D/g, "");

    // 🔹 1. Tenta BrasilAPI
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
    const data = (await res.json()) as BrasilApiResponse;

    if (data?.location?.coordinates?.latitude && data?.location?.coordinates?.longitude) {
      return {
        lat: data.location.coordinates.latitude,
        lon: data.location.coordinates.longitude,
      };
    }

    // 🔹 2. Fallback para Nominatim (busca cidade/UF)
    if (data?.city && data?.state) {
      const location = encodeURIComponent(`${data.city}, ${data.state}, Brazil`);
      const nominatim = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
      );
      const geo = (await nominatim.json()) as any[];

      if (geo && geo.length > 0) {
        return {
          lat: parseFloat(geo[0].lat),
          lon: parseFloat(geo[0].lon),
        };
      }
    }

    throw new Error("Não foi possível encontrar coordenadas para o CEP.");
  }

  // 📏 Fórmula de Haversine
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // 🚀 Calcula distância + custo de frete
  static async calculateDistanceByCep(cepDestino: string) {
    const cepOrigem = "06266360"; // CEP fixo da loja
    const origem = await this.getCoordinates(cepOrigem);
    const destino = await this.getCoordinates(cepDestino);

    const distanceKm = this.calculateDistance(
      origem.lat,
      origem.lon,
      destino.lat,
      destino.lon
    );

    // 💰 Exemplo de preço de frete: R$ 1,50 por km
    const pricePerKm = 1.5;
    const shippingCost = distanceKm * pricePerKm;

    return {
      distanceKm: Number(distanceKm.toFixed(2)),
      shippingCost: Number(shippingCost.toFixed(2)),
    };
  }
}
