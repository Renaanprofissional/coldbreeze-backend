// src/modules/distance/routes.ts
import { FastifyInstance } from "fastify";
import { DistanceController } from "./controller.js";

export async function distanceRoutes(app: FastifyInstance) {
  app.get("/distance", DistanceController.calculate);
}
