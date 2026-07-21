import { Hono, type Context } from "hono";
import type { JwtResponse } from "../auth/auth.model";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { HttpStatus } from "../utils/status_code";
import { EventService } from "./event.service";
import { HTTPException } from "hono/http-exception";

const EventController = new Hono();
EventController.use(AuthMiddleware);
EventController.get("/:id", async (c: Context) => {
  const id = c.req.param("id");
  if (!id) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Param undefined",
    });
  }
  const result = await EventService.findById(id);
  return c.json(
    {
      data: result,
    },
    HttpStatus.OK,
  );
});
EventController.get("/", async (c: Context) => {
  const page = c.req.query("page");
  const perPage = c.req.query("perPage");
  if (!page) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "query page undefined",
    });
  }
  if (!perPage) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "query perpage undefined",
    });
  }
  const result = await EventService.list(page, perPage);
  return c.json(result, HttpStatus.OK);
});
EventController.use(requireRole("admin", "superadmin", "dosen"));
EventController.post("/", async (c: Context) => {
  const user: JwtResponse = c.get("user");
  const body = await c.req.json();
  const result = await EventService.create(body, user.id);
  return c.json(
    {
      data: result,
    },
    HttpStatus.CREATED,
  );
});
EventController.put("/:id", async (c: Context) => {
  const user: JwtResponse = c.get("user");
  const id = c.req.param("id");
  if (!id) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Param undefined",
    });
  }
  const body = await c.req.json();
  const result = await EventService.update(id, body, user.id, user.role);
  return c.json(
    {
      data: result,
    },
    HttpStatus.OK,
  );
});
EventController.delete("/:id", async (c: Context) => {
  const user: JwtResponse = c.get("user");
  const id = c.req.param("id");
  if (!id) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Param undefined",
    });
  }
  await EventService.remove(id, user.id, user.role);
  return c.json(
    {
      data: "Event berhasil dihapus",
    },
    HttpStatus.OK,
  );
});
EventController.patch("/:id/publish", async (c: Context) => {
  const user: JwtResponse = c.get("user");
  const id = c.req.param("id");
  if (!id) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Param undefined",
    });
  }
  const result = await EventService.setStatus(
    id,
    "published",
    user.id,
    user.role,
  );
  return c.json(
    {
      data: result,
    },
    HttpStatus.OK,
  );
});
EventController.patch("/:id/archive", async (c: Context) => {
  const user: JwtResponse = c.get("user");
  const id = c.req.param("id");
  if (!id) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Param undefined",
    });
  }
  const result = await EventService.setStatus(
    id,
    "archived",
    user.id,
    user.role,
  );
  return c.json(
    {
      data: result,
    },
    HttpStatus.OK,
  );
});

export default EventController;
