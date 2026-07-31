import { Hono, type Context } from "hono";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { HttpStatus } from "../utils/status_code";
import type {
  ChangeNameRequest,
  JwtResponse,
  LoginUserRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
  ResetRecoveryRequest,
  VerifyRecoveryRequest,
} from "./auth.model";
import { AuthService } from "./auth.service";

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
AuthController.post("/recovery/verify", async (c: Context) => {
  const body: VerifyRecoveryRequest = await c.req.json();
  const result = await AuthService.verifyRecovery(body.email, body.name);
  return c.json(
    {
      data: result,
    },
    HttpStatus.OK,
  );
});
AuthController.post("/recovery/reset", async (c: Context) => {
  const body: ResetRecoveryRequest = await c.req.json();
  await AuthService.resetRecovery(body.token, body.password);
  return c.json(
    {
      data: "Password changed successfully",
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
AuthController.patch("/name", async (c: Context) => {
  const user: JwtResponse = c.get("user");
  const body: ChangeNameRequest = await c.req.json();
  await AuthService.changeName(body.name, user.email, c);
  return c.json(
    {
      data: "Name changed successfully",
    },
    HttpStatus.OK,
  );
});
AuthController.patch("/password", async (c: Context) => {
  const user: JwtResponse = c.get("user");
  const body: ResetPasswordRequest = await c.req.json();
  await AuthService.resetPassword(body.password, user.email);
  return c.json(
    {
      data: "Password changed successfully",
    },
    HttpStatus.OK,
  );
});

AuthController.delete("/logout", async (c: Context) => {
  await AuthService.logout(c);
  return c.json(
    {
      data: "Cookies cleared successfully",
    },
    HttpStatus.OK,
  );
});

export default AuthController;
