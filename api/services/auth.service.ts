import HashHelper from "../helpers/hash.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import type { TokenSchema } from "../models/token.model.ts";
import { User, UserSchema } from "../models/user.model.ts";
import type {
  TokenStructure,
  UserStructure,
} from "../types/types.interface.ts";
import TokenService from "./token.service.ts";
import UserService from "./user.service.ts";

const authErrorHelper = new ErrorHelper("auth");

class AuthService {
  public static async login({
    email: enteredEmail,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const user: UserSchema | undefined = await User.findOne({
      email: enteredEmail,
      isDisabled: false,
    });

    const isValidPass = user &&
      (await HashHelper.compare(password, user.password));
    if (!user?.password || !isValidPass) {
      return authErrorHelper.unauthorized({
        message: `email or password is not correct`,
        path: "login",
      });
    }

    const { _id, username, email, role, createdAt, updatedAt } = user;
    const id = _id.toString();
    const tokens: TokenStructure = await TokenService.generateAuthTokensService(
      id,
    );

    return {
      tokens,
      user: { id, username, email, role, createdAt, updatedAt },
    };
  }

  public static async register({
    email: enteredEmail,
    username: enteredUsername,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }) {
    const userId = await UserService.createUser({
      email: enteredEmail,
      username: enteredUsername,
      password,
      isDisabled: false,
      role: "user",
    });
    if (!userId) return authErrorHelper.badRequest({ action: "create" });
    const id: string = userId.toString();
    const user = await UserService.getUser(id, true);
    if (!user) return authErrorHelper.notFound();
    const { username, email, role, createdAt, updatedAt } = user;
    const tokens = await TokenService.generateAuthTokensService(id);
    return {
      tokens,
      user: { id, username, email, role, createdAt, updatedAt },
    };
  }

  public static async getRefreshToken(token: string) {
    const refreshTokenDoc:
      | TokenSchema
      | Error = await TokenService.verifyTokenService(token, "refresh");

    if (!("user" in refreshTokenDoc)) {
      return ErrorHelper.throw({
        status: ErrorHelper.status.badRequest,
        name: "BadRequest",
        path: "refresh_token",
        param: "refresh_token",
        message: `refresh_token is invalid`,
        type: "BadRequest",
      });
    }

    const userId = refreshTokenDoc.user;
    const user: UserStructure | Error = await UserService.getUser(userId);
    await TokenService.removeExistingRefreshToken(
      refreshTokenDoc?._id?.toString(),
    );
    return await TokenService.generateRefreshTokensService(
      "id" in user ? user.id : undefined,
    );
  }
}

export default AuthService;
