import { z } from "zod";

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long");

const descriptionSchema = z
  .string()
  .min(20, "Description must be at least 20 characters long");

const quantitySchema = z
  .number()
  .int()
  .positive("Quantity must be greater than 0");

const priceSchema = z
  .number()
  .positive("Price must be greater than 0");

export const createItemSchema = z.object({
  body: z.object({
    name: nameSchema,
    description: descriptionSchema,
    quantity: quantitySchema,
    price: priceSchema,
  }),
});

export const updateItemSchema = z.object({
  body: z.object({
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
    quantity: quantitySchema.optional(),
    price: priceSchema.optional(),
  }),
});


