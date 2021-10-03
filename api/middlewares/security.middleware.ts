import { Application } from "../deps.ts";
import { Snelm } from "../deps.ts";

const snelm = new Snelm("oak");

export default function (app: Application) {
  app.use(({ response, request }, next) => {
    response = snelm.snelm(request, response);
    next();
  });
}
