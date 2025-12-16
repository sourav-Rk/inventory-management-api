import { z } from "zod";

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long");

const addressSchema = z
  .string()
  .min(5, "Address must be at least 5 characters long");

const mobileSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Mobile must be 10 digits and start with 6, 7, 8, or 9");

export const createCustomerSchema = z.object({
  body: z.object({
    name: nameSchema,
    address: addressSchema,
    mobile: mobileSchema,
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: nameSchema.optional(),
    address: addressSchema.optional(),
    mobile: mobileSchema.optional(),
  }),
});


