import { Context, Hono } from "hono";
import { UserService } from "./user.service";
import { HttpStatus } from "../utils/status_code";
import { HTTPException } from "hono/http-exception";

const UserController = new Hono();
UserController.get("/", async (c: Context) => {
  const data = await UserService.getUsers();
  return c.json(
    {
      data: data,
    },
    HttpStatus.OK,
  );
});
UserController.patch("/:id", async (c: Context) => {
  const id = c.req.param("id");
  if (!id) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "param undefined",
    });
  }
  const data = await UserService.changeRole(id);
  return c.json(
    {
      data: data,
    },
    HttpStatus.OK,
  );
});
UserController.delete("/:id", async (c: Context) => {
  const id = c.req.param("id");
  if (!id) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "param undefined",
    });
  }
  await UserService.deleteUser(id);
  return c.json({
    data: "User deleted succes",
  });
});

export default UserController;
