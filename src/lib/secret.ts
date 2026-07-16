const secret = Bun.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET tidak diset di environment");
}
export const SECRET = secret;
