import { z } from "zod";

export const REGISTER_USER_SCHEMA = z.object({
  name: z.string().min(1).max(100),
  email: z.email().max(255),
  password: z.string().min(8).max(255),
});

export const LOGIN_USER_SCHEMA = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type RegisterUserRequest = z.infer<typeof REGISTER_USER_SCHEMA>;

export type LoginUserRequest = z.infer<typeof LOGIN_USER_SCHEMA>;

export type AuthResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
};

export type JwtResponse = {
  id: string;
  email: string;
  role: string;
};
