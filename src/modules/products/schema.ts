import { z } from "zod";

/**
 * 🔹 Schema de validação para parâmetros de rotas
 */
export const slugParamSchema = z.object({
  slug: z.string().min(1, "Slug inválido"),
});

/**
 * 🔹 Schema do produto básico (para retorno)
 */
export const productVariantSchema = z.object({
  id: z.string(),
  color: z.string(),
  priceInCents: z.number(),
  imageUrl: z.string().url(),
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  category: categorySchema,
  variants: z.array(productVariantSchema),
});

/**
 * 🔹 Schema para retorno de lista de produtos e categorias
 */
export const productListSchema = z.array(productSchema);

export const categoryWithProductsSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      variants: z.array(productVariantSchema),
    })
  ),
});
