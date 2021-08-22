import { roleRights } from "../config/roles.ts";
import { Context, State } from "../deps.ts";
import JwtHelper from "../helpers/jwt.helper.ts";
import UserService from "../services/user.service.ts";
import type { UserStructure } from "../types/types.interface.ts";
import ErrorHelper from "../helpers/error.helper.ts";

const authErrorHelper = new ErrorHelper("auth");

const checkRights = (requiredRights: string[], user: UserStructure): boolean | Error => {
  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) =>
      userRights.includes(requiredRight)
    );
    if (!hasRequiredRights) return authErrorHelper.forbidden();
  }
  return true;
};

export const auth = (...requiredRights: string[]) => async (
  // deno-lint-ignore no-explicit-any
  ctx: Context<State, Record<string, any>>,
  next: () => Promise<unknown>
): Promise<void> => {
  let JWT: string;
  const jwt: string = ctx.request.headers.get("Authorization")
    ? ctx.request.headers.get("Authorization")!
    : "";
  if (jwt && jwt.includes("Bearer")) {
    JWT = jwt.split("Bearer ")[1];
    // deno-lint-ignore no-explicit-any
    const data: any | Error = await JwtHelper.getJwtPayload(JWT);
    if (data) {
      const user: UserStructure | Error = await UserService.getUser(data.id);
      if (user && checkRights(requiredRights, user as UserStructure)) {
        ctx.state = user;
      }
    } else return authErrorHelper.unauthorized();
  } else return authErrorHelper.unauthorized();

  await next();
};
