import { Router } from "../deps.ts";

import password from "./password.routes.ts";
import tag from "./tag.routes.ts";

const routes = new Router()
  .use("/passwords", password.routes(), password.allowedMethods())
  .use("/tags", tag.routes(), tag.allowedMethods());

export default routes;
