import { sign, verify } from "hono/jwt";
import { SECRET } from "./secret";

export type JwtPayload = {
  sub?: string;
  role?: string;
  email?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  iss?: string;
  nbf?: number;
};

export const JwtHelper = {
  async signToken(payload: JwtPayload): Promise<string> {
    return await sign(
      { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      SECRET,
      "HS256",
    );
  },
  async verifyToken(token: string) {
    return verify(token, SECRET, "HS256");
  },
};
