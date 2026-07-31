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

export const CHANGE_USERNAME_SCHEMA = z.object({
  name: z.string().min(3),
});

export const RESET_PASSWORD_SCHEMA = z.object({
  password: z.string().min(8).max(100),
});

export const VERIFY_RECOVERY_SCHEMA = z.object({
  email: z.email(),
  name: z.string().min(1),
});

export const RESET_RECOVERY_SCHEMA = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(100),
});

export type RegisterUserRequest = z.infer<typeof REGISTER_USER_SCHEMA>;
export type LoginUserRequest = z.infer<typeof LOGIN_USER_SCHEMA>;
export type ChangeNameRequest = z.infer<typeof CHANGE_USERNAME_SCHEMA>;
export type ResetPasswordRequest = z.infer<typeof RESET_PASSWORD_SCHEMA>;
export type VerifyRecoveryRequest = z.infer<typeof VERIFY_RECOVERY_SCHEMA>;
export type ResetRecoveryRequest = z.infer<typeof RESET_RECOVERY_SCHEMA>;

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

export type VerifyRecoveryResponse = {
  token: string;
};

export type RecoveryTokenPayload = {
  email: string;
  type: "recovery";
};
