import { type Context, type MiddlewareHandler, type Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { createMiddleware } from "hono/factory";
import type { JwtResponse } from "../auth/auth.model";
import { HttpStatus } from "../utils/status_code";

export const requireRole = (...roles: string[]): MiddlewareHandler =>
  createMiddleware(async (c: Context, next: Next): Promise<void> => {
    const user: JwtResponse = c.get("user");
    if (!user || !roles.includes(user.role)) {
      throw new HTTPException(HttpStatus.FORBIDDEN, {
        message: "Forbidden",
      });
    }
    await next();
  });
