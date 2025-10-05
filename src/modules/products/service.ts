import { db } from "../../lib/prisma.js";

export const ProductService = {
  async list() {
    return db.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
        variants: {
          select: {
            id: true,
            color: true,
            priceInCents: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getBySlug(slug: string) {
    return db.product.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
        variants: {
          select: {
            id: true,
            color: true,
            priceInCents: true,
            imageUrl: true,
          },
        },
      },
    });
  },

  async categories() {
    return db.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            variants: {
              select: {
                id: true,
                color: true,
                priceInCents: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  },
};
