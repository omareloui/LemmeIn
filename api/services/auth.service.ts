import HashHelper from "../helpers/hash.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import { User, UserSchema } from "../models/user.model.ts";
import TokenService from "./token.service.ts";
import UserService from "./user.service.ts";
import type { LoggingStructure } from "../types/types.interface.ts";

const authErrorHelper = new ErrorHelper("auth");

class AuthService {
  public static async login({
    email: enteredEmail,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<LoggingStructure> {
    // Get the user and validate him
    const user: UserSchema | undefined = await User.findOne({
      email: enteredEmail,
      isDisabled: false,
    });
    const isValidPass =
      user && (await HashHelper.compare(password, user.password));
    if (!user?.password || !isValidPass) {
      return authErrorHelper.unauthorized({
        message: `email or password is not correct`,
        path: "login",
      });
    }
    // Get the token
    const id = user._id.toString();
    const token = await TokenService.create(id);
    const { username, email, role, createdAt, updatedAt } = user;
    return {
      token,
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
  }): Promise<LoggingStructure> {
    const userId = await UserService.createUser({
      email: enteredEmail,
      username: enteredUsername,
      password,
      isDisabled: false,
      role: "user",
    });
    if (!userId) return authErrorHelper.badRequest({ action: "create" });
    const id = userId.toString();
    const user = await UserService.getUser(id);
    if (!user) return authErrorHelper.notFound();
    const { username, email, role, createdAt, updatedAt } = user;
    const token = await TokenService.create(id);
    return {
      token,
      user: { id, username, email, role, createdAt, updatedAt },
    };
  }
}

export default AuthService;
