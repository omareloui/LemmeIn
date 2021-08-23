import { create, getNumericDate, Header, Payload, verify } from "../deps.ts";
import ErrorHelper from "./error.helper.ts";

const jwtSecret = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

const header: Header = { alg: "HS512", typ: "JWT" };

class JwtHelper {
  public static getToken(expiresInSeconds: number, id?: string) {
    const payload: Payload = {
      iss: "djwt",
      iat: Date.now(),
      id,
      exp: getNumericDate(expiresInSeconds),
    };
    return create(header, payload, jwtSecret);
  }

  public static async getJwtPayload(token: string) {
    try {
      return await verify(token, jwtSecret);
    } catch (_e) {
      ErrorHelper.throw({
        status: ErrorHelper.status.unauthorized,
        name: "Unauthorized",
        path: "access_token",
        param: "access_token",
        message: `access_token is expired`,
        type: "Unauthorized",
      });
    }
  }
}

export default JwtHelper;
