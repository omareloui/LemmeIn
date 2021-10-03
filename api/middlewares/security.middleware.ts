import { Application } from "../deps.ts";
import { Snelm } from "../deps.ts";

const snelm = new Snelm("oak");

export default function (app: Application) {
  app.use(async (ctx, next) => {
    ctx.response = snelm.snelm(ctx.request, ctx.response);
    await next();
  });
}
