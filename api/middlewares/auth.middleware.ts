import { roleRights } from "../config/roles.ts";
import { Context } from "../deps.ts";
import JwtHelper from "../helpers/jwt.helper.ts";
import UserService from "../services/user.service.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import { Rights } from "../config/roles.ts";
import type { UserDoc } from "../services/user.service.ts";

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

export const auth = (...requiredRights: Rights) => async (
  ctx: Context,
  next: () => Promise<unknown>
): Promise<void> => {
  const jwt: string = ctx.request.headers.get("Authorization")
    ? ctx.request.headers.get("Authorization")!
    : "";

  if (!jwt || !jwt.includes("Bearer")) return authErrorHelper.unauthorized();
  const token = jwt.split("Bearer ")[1];
  const data = await JwtHelper.getPayload(token);

  const user: UserDoc = await UserService.getOne(data.id as string);
  if (user && checkRights(requiredRights, user)) ctx.state.user = user;
  await next();
};
