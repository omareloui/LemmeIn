import config from "../config/config.ts";
import { ObjectId } from "../deps.ts";
import JwtHelper from "../helpers/jwt.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import { Token, TokenSchema } from "../models/token.model.ts";
import getDateAfterSeconds from "../utils/getDateAfterSeconds.ts";

const tokenErrorHelper = new ErrorHelper("token");

class TokenService {
  private static saveTokenService(options: TokenSchema) {
    const createdAt = new Date();
    const { token, user, expires, type, blacklisted } = options;
    return Token.insertOne({
      token,
      user,
      expires,
      type,
      blacklisted,
      createdAt,
    });
  }

  public static async generateAuthTokensService(userId?: string) {
    if (!userId) {
      return tokenErrorHelper.notFound({ message: "user id is invalid" });
    }

    const accessTokenExpires = config.jwtAccessExpiration;
    const accessToken = await JwtHelper.getToken(accessTokenExpires, userId);
    const refreshTokenExpires = config.jwtRefreshExpiration;
    const refreshToken = await JwtHelper.getToken(refreshTokenExpires, userId);

    await this.saveTokenService({
      token: refreshToken,
      user: userId,
      expires: getDateAfterSeconds(config.jwtRefreshExpiration),
      type: "refresh",
      blacklisted: false,
    });
    return {
      access: {
        token: accessToken,
        expires: getDateAfterSeconds(config.jwtAccessExpiration),
      },
      refresh: {
        token: refreshToken,
        expires: getDateAfterSeconds(config.jwtRefreshExpiration),
      },
    };
  }

  public static async generateRefreshTokensService(userId?: string) {
    if (!userId) {
      return tokenErrorHelper.notFound({ message: "user id is invalid" });
    }

    return await this.generateAuthTokensService(userId);
  }

  public static async verifyTokenService(token: string, type: string) {
    // deno-lint-ignore no-explicit-any
    const payload: any = await JwtHelper.getJwtPayload(token);
    const tokenDoc = await Token.findOne({
      token,
      type,
      user: payload.id,
      blacklisted: false,
    });
    if (!tokenDoc) return tokenErrorHelper.unauthorized();
    return tokenDoc;
  }

  public static async removeExistingRefreshToken(id?: string) {
    if (!id) return tokenErrorHelper.notFound({ message: "Token not found" });
    const deleteCount: number = await Token.deleteOne({
      _id: new ObjectId(id),
    });
    if (!deleteCount) {
      return tokenErrorHelper.notFound({ message: "Token not found" });
    }
    return deleteCount;
  }
}

export default TokenService;
