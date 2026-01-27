// src/lib/validations/vendorSchema.js
import { z } from "zod";

export const vendorSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  categories: z.array(z.string()).optional(),
  specialization: z.string().optional(),
  businessName: z.string().optional(),
  gstin: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  maxProjects: z.number().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  products: z.string().optional(),
  brands: z.string().optional(),
});