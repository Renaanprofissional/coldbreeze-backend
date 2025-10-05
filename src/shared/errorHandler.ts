import { FastifyInstance } from "fastify";

export function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    reply.status(500).send({
      error: "Internal Server Error",
      message: error.message,
    });
  });
}
