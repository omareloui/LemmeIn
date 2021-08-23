import { create, getNumericDate, Header, Payload, verify } from "../deps.ts";
import ErrorHelper from "./error.helper.ts";

const jwtSecret = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"]
);

const header: Header = { alg: "HS512", typ: "JWT" };

class JwtHelper {
  public static create(expiresInSeconds: number, id?: string) {
    const payload: Payload = {
      iss: "djwt",
      iat: Date.now(),
      id,
      exp: getNumericDate(expiresInSeconds),
    };
    return create(header, payload, jwtSecret);
  }

  public static async verify(token: string) {
    try {
      const isValid = await verify(token, jwtSecret);
      return !!isValid;
    } catch (_e) {
      return false;
    }
  }

  public static async getPayload(token: string) {
    try {
      return await verify(token, jwtSecret);
    } catch (e) {
      let message: string;
      if (e.message.includes("does not match the verification signature"))
        message = `Invalid token`;
      else message = `The token has been expired`;

      ErrorHelper.throw({
        status: ErrorHelper.status.unauthorized,
        name: "Unauthorized",
        path: "access_token",
        param: "access_token",
        message,
        type: "Unauthorized",
      });
    }
  }
}

export default JwtHelper;
