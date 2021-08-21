import User, { UserSchema } from "../models/User.ts";

import { createJWT, getNumericDate, hash } from "../deps.ts";
import ControllerHelper from "./lib/ControllerHelper.ts";
import APIError from "../lib/APIError.ts";

const UserControllerHelper = new ControllerHelper(User, {
  requiredFields: ["email", "password", "username", "name"],
});

export default class UserController {
  async register(data: UserSchema) {
    const jwtSecret = Deno.env.get("JWT_TOKEN");

    const key = await crypto.subtle.generateKey({ name: "HMAC", hash: "SHA-512" }, true, [
      "sign",
      "verify",
    ]);

    if (!jwtSecret) throw new APIError("Something went wrong, please try again later", 500);
    const {
      username,
      email,
      password,
      name: { first, last },
    } = data;
    if (!username || !email || !password || !first || !last)
      throw new APIError("All the fields has to be fill.", 400);
    const hashedPassword = await hash(password);
    // TODO: make sure the username and the email are unique
    const insertId = await User.insertOne({ ...data, password: hashedPassword });
    const expiration = getNumericDate(60 * 60);
    const token = await createJWT(
      { alg: "RS512", typ: "JWT" },
      { userId: insertId, exp: getNumericDate(60 * 60) },
      key
    );

    console.log({ key });
    console.log({ expiration });
    console.log({ token });
    return { insertId, token };
  }

  async signin() {}

  async viewAll() {
    return await UserControllerHelper.viewAll();
  }

  async viewById(id: string | undefined) {
    return await UserControllerHelper.viewById(id);
  }

  async delete(id: string | undefined) {
    const deletionCount = await UserControllerHelper.deleteById(id);
    return { ok: deletionCount > 0 };
  }
}
