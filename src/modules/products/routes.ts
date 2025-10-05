import { FastifyInstance } from "fastify";
import { ProductController } from "./controller.js";

export async function productRoutes(app: FastifyInstance) {
  app.get("/products", ProductController.list);
  app.get("/products/:slug", ProductController.getBySlug);
  app.get("/categories", ProductController.categories);
}
