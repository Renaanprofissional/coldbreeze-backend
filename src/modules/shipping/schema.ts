import { z } from "zod";

export const createAddressSchema = z.object({
  recipient: z.string().min(3),
  street: z.string(),
  number: z.string(),
  complement: z.string().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string().min(8),
  phone: z.string().min(10),
});
