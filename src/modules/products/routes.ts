import { FastifyInstance } from "fastify";
import { ProductController } from "./controller.js";
import { slugParamSchema } from "./schema.js";

export async function productRoutes(app: FastifyInstance) {
  app.get("/products", ProductController.list);

  app.get(
    "/products/:slug",
    {
      schema: {
        params: slugParamSchema,
      },
    },
    ProductController.getBySlug
  );

  app.get("/categories", ProductController.categories);
}
