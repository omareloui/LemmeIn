import { Router } from "../deps.ts";

import password from "./password.routes.ts";

const routes = new Router().use("/passwords", password.routes(), password.allowedMethods());

export default routes;
