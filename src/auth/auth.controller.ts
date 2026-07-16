import { Hono, type Context } from "hono";
import { HttpStatus } from "../utils/status_code";
import { AuthService } from "./auth.service";
import type { LoginUserRequest, RegisterUserRequest } from "./auth.model";
import { AuthMiddleware } from "../middleware/auth.middleware";

const AuthController = new Hono();
AuthController.post("/register", async (c: Context) => {
  const body: RegisterUserRequest = await c.req.json();
  const result = await AuthService.register(body);
  return c.json(
    {
      data: result,
    },
    HttpStatus.CREATED,
  );
});
AuthController.post("/login", async (c: Context) => {
  const body: LoginUserRequest = await c.req.json();
  const result = await AuthService.login(body, c);
  return c.json(
    {
      data: result,
    },
    HttpStatus.OK,
  );
});
AuthController.use(AuthMiddleware);
AuthController.get("/me", async (c: Context) => {
  const result = await AuthService.me(c);
  return c.json(
    {
      data: result,
    },
    HttpStatus.OK,
  );
});

export default AuthController;
