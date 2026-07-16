import { HTTPException } from "hono/http-exception";
import { passwordHelper } from "../lib/password";
import {
  LOGIN_USER_SCHEMA,
  REGISTER_USER_SCHEMA,
  type AuthResponse,
  type JwtResponse,
  type LoginUserRequest,
  type RegisterUserRequest,
} from "./auth.model";
import { HttpStatus } from "../utils/status_code";
import { prisma } from "../db";
import { JwtHelper } from "../lib/jwt";
import { setSignedCookie } from "hono/cookie";
import { SECRET } from "../lib/secret";
import type { Context } from "hono";

export const AuthService = {
  async register(req: RegisterUserRequest): Promise<AuthResponse> {
    const data = REGISTER_USER_SCHEMA.parse(req);
    const passw = await passwordHelper.hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: passw,
        role: "mahasiswa",
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
  async login(req: LoginUserRequest, c: Context): Promise<AuthResponse> {
    const credentials = LOGIN_USER_SCHEMA.parse(req);
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });
    if (!user) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Password atau email salah",
      });
    }
    const validpw = await passwordHelper.verifyPassword(
      credentials.password,
      user.password,
    );
    if (!validpw) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Password atau email salah",
      });
    }
    const token = await JwtHelper.signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await setSignedCookie(c, token, "access_token", SECRET, {
      httpOnly: true,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token,
    };
  },
  async me(c: Context): Promise<JwtResponse> {
    const user = c.get("user");
    return user;
  },
};
