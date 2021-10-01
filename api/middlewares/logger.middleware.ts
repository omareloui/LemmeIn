import { Application } from "../deps.ts";
import { log } from "../utils/logger.ts";

export default function (app: Application) {
  app.use(async ({ response, request }, next) => {
    await next();
    const responseTime = response.headers.get("X-Response-Time");
    log.info(
      `${request.method} [${response.status}] ${request.url} - ${responseTime}`
    );
  });

  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
  });
}
