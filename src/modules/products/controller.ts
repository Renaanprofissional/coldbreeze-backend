import { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "./service.js";

export const ProductController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    const products = await ProductService.list();
    reply.send(products);
  },

  async getBySlug(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    const product = await ProductService.getBySlug(req.params.slug);
    if (!product) return reply.status(404).send({ error: "Produto não encontrado" });
    reply.send(product);
  },

  async categories(req: FastifyRequest, reply: FastifyReply) {
    const categories = await ProductService.categories();
    reply.send(categories);
  },
};
