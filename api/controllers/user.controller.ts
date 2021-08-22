import { roles } from "../config/roles.ts";
import type { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import UserService from "../services/user.service.ts";

class UserController {
  public static async create({ request, response }: RouterContext): Promise<void> {
    const body = request.body();
    const { name, email, password, role, isDisabled } = await body.value;
    log.debug("Creating user");
    response.body = await UserService.createUser({
      name,
      email,
      password,
      role: role || roles[0],
      isDisabled: typeof isDisabled === "boolean" ? isDisabled : false,
    });
  }

  public static async fetch({ response }: RouterContext): Promise<void> {
    log.debug("Getting users list");
    response.body = await UserService.getUsers();
  }

  public static me({ state, response }: RouterContext): void {
    log.debug("Getting me data");
    response.body = state;
  }

  public static async show({ params, response }: RouterContext): Promise<void> {
    const { id } = params;
    log.debug("Getting user");
    response.body = await UserService.getUser(id as string);
  }

  public static async update({ params, request, response }: RouterContext): Promise<void> {
    const { id } = params;
    const body = request.body();
    const { name, role, isDisabled } = await body.value;
    log.debug("Updating user");
    response.body = await UserService.updateUser(id as string, {
      name,
      role,
      isDisabled,
    });
  }

  public static async remove({ params, response }: RouterContext): Promise<void> {
    const { id } = params;
    log.debug("Removing user");
    const deleteCount: number | Error = await UserService.removeUser(id as string);
    response.body = { deleted: deleteCount };
  }
}

export default UserController;

// import User, { UserSchema } from "../models/User.ts";

// import { createJWT, getNumericDate, hash } from "../deps.ts";
// import ControllerHelper from "./lib/ControllerHelper.ts";
// import APIError from "../lib/APIError.ts";

// const UserControllerHelper = new ControllerHelper(User, {
//   requiredFields: ["email", "password", "username", "name"],
// });

// export default class UserController {
//   async register(data: UserSchema) {
//     const jwtSecret = Deno.env.get("JWT_TOKEN");

//     const key = await crypto.subtle.generateKey({ name: "HMAC", hash: "SHA-512" }, true, [
//       "sign",
//       "verify",
//     ]);

//     if (!jwtSecret) {
//       throw new APIError("Something went wrong, please try again later", 500);
//     }
//     const {
//       username,
//       email,
//       password,
//       name: { first, last },
//     } = data;
//     if (!username || !email || !password || !first || !last) {
//       throw new APIError("All the fields has to be fill.", 400);
//     }
//     const hashedPassword = await hash(password);
//     // TODO: make sure the username and the email are unique
//     const insertId = await User.insertOne({
//       ...data,
//       password: hashedPassword,
//     });
//     const expiration = getNumericDate(60 * 60);
//     const token = await createJWT(
//       { alg: "RS512", typ: "JWT" },
//       { userId: insertId, exp: getNumericDate(60 * 60) },
//       key
//     );

//     console.log({ key });
//     console.log({ expiration });
//     console.log({ token });
//     return { insertId, token };
//   }

//   async signin() {}

//   async viewAll() {
//     return await UserControllerHelper.viewAll();
//   }

//   async viewById(id: string | undefined) {
//     return await UserControllerHelper.viewById(id);
//   }

//   async delete(id: string | undefined) {
//     const deletionCount = await UserControllerHelper.deleteById(id);
//     return { ok: deletionCount > 0 };
//   }
// }
