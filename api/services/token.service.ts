import config from "../config/config.ts";
import JwtHelper from "../helpers/jwt.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import getDateAfterSeconds from "../utils/getDateAfterSeconds.ts";

const tokenErrorHelper = new ErrorHelper("token");

class TokenService {
  public static async create(userId?: string) {
    if (!userId)
      return tokenErrorHelper.notFound({ message: "User id is invalid" });
    const expiration = config.jwtExpiration;
    const token = await JwtHelper.create(expiration, userId);
    return {
      token,
      expires: getDateAfterSeconds(expiration),
    };
  }
}

export default TokenService;
