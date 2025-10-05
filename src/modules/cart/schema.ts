import { z } from "zod";

export const addItemSchema = z.object({
  variantId: z.string().uuid("O ID da variante do produto é inválido"),
  quantity: z
    .number()
    .int("A quantidade precisa ser um número inteiro")
    .min(1, "A quantidade mínima é 1"),
});

export const removeItemSchema = z.object({
  itemId: z.string().uuid("O ID do item é inválido"),
});

export const clearCartSchema = z.object({
  confirm: z.boolean().optional(),
});
