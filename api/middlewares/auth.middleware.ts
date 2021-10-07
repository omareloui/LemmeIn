import { Context } from "../deps.ts";

import { roleRights, Rights } from "../config/index.ts";
import { JwtHelper, ErrorHelper } from "../helpers/index.ts";

import { UserService, UserDoc } from "../services/index.ts";

const authErrorHelper = new ErrorHelper("auth");

function checkRights(requiredRights: Rights, user: UserDoc) {
  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) =>
      userRights.includes(requiredRight)
    );
    if (!hasRequiredRights) return authErrorHelper.forbidden();
  }
  return true;
}

export function auth(...requiredRights: Rights) {
  return async function (
    ctx: Context,
    next: () => Promise<unknown>
  ): Promise<void> {
    const jwt: string = ctx.request.headers.get("Authorization")
      ? ctx.request.headers.get("Authorization")!
      : "";

    if (!jwt || !jwt.includes("Bearer")) return authErrorHelper.unauthorized();
    const token = jwt.split("Bearer ")[1];
    const data = await JwtHelper.getPayload(token);

    const user = await UserService.getOne(data.id as string);
    if (user && checkRights(requiredRights, user)) ctx.state.user = user;
    await next();
  };
}
