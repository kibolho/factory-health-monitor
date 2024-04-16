import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}).openapi({ description: "Register user"})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}).openapi({ description: "Login user"})

export const refreshSchema = z.object({
  refreshToken: z.string(),
}).openapi({ description: "Refresh token"})