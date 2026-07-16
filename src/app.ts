import { Context, Hono, type Env, type Input } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { winstonlogger } from "./utils/winston-logger";
import { rateLimiter } from "hono-rate-limiter";
import GlobalError from "./utils/error-handling";

const app = new Hono();

const limiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 5,
  keyGenerator: (c: Context<Env, string, Input>): string =>
    c.req.header("x-forwarded-for") || "unknown",
});

app.use(
  "/*",
  cors({
    origin: Bun.env.CORS_ORIGIN_DEV,
    credentials: true,
  }),
);

app.use("/*", logger());
app.onError(GlobalError);

for (let i = 0; i < app.routes.length; i++) {
  const route = app.routes[i];
  winstonlogger.info(
    `[METHOD] ${route?.method.padEnd(6)} | [ROUTE] ${route?.path}`,
  );
}

export default app;
