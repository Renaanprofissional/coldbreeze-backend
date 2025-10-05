import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    rawBody?: Buffer;
    user?: {
      id: string;
      email: string;
      name?: string;
      image?: string | null;
    };
  }
}
