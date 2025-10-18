import { FastifyInstance } from "fastify";
import { DistanceController } from "./controller.js";

export async function distanceRoutes(app: FastifyInstance) {
  app.get("/frete", DistanceController.calcular);
}
