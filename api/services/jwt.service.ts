import { config } from "../config/index.ts";
import { JwtHelper, ErrorHelper } from "../helpers/index.ts";
import { getDateAfterSeconds } from "../utils/index.ts";

const tokenErrorHelper = new ErrorHelper("token");

export class JwtService {
  public static async create(userId?: string) {
    if (!userId)
      return tokenErrorHelper.notFound({ message: "User id is invalid" });
    const expiration = config.jwtExpiration;
    const token = await JwtHelper.create(expiration, { id: userId });
    return {
      token,
      expires: getDateAfterSeconds(expiration),
    };
  }
}
