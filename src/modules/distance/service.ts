export class DistanceService {
  /**
   * Calcula o valor do frete com base na cidade e estado.
   * Simulação profissional — pode ser substituída por cálculo por KM futuramente.
   */
  static async calcularFrete(city: string, state: string): Promise<number> {
    // Normaliza strings
    const cidade = city.trim().toLowerCase();
    const uf = state.trim().toUpperCase();

    // 🗺️ Tabela de fretes por cidade/região
    const tabelaFrete: Record<string, number> = {
      // Sudeste
      "são paulo": 14.9,
      osasco: 12.9,
      guarulhos: 15.9,
      campinas: 16.9,
      "rio de janeiro": 24.9,
      niteroi: 23.9,
      santos: 18.9,
      // Sul
      curitiba: 25.9,
      florianopolis: 27.9,
      portoalegre: 29.9,
      // Nordeste
      salvador: 29.9,
      recife: 31.9,
      fortaleza: 33.9,
      natal: 32.9,
      // Norte
      manaus: 39.9,
      belem: 35.9,
      // Centro-Oeste
      brasilia: 27.9,
      goiania: 28.9,
      cuiaba: 30.9,
      campo_grande: 29.9,
    };

    const valor = tabelaFrete[cidade] ?? 39.9; // padrão
    await new Promise((r) => setTimeout(r, 200)); // Simula latência da API

    return valor;
  }
}
