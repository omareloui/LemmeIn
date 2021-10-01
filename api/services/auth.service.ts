import HashHelper from "../helpers/hash.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";

import JwtService from "./jwt.service.ts";

import { User } from "../models/user.model.ts";
import { BaseService } from "./base.service.ts";
import UserService from "./user.service.ts";
import type { UserDoc } from "./user.service.ts";
import type { Role } from "../config/roles.ts";
import { CollectionHelper } from "../helpers/collection.helper.ts";

const UserHelper = new CollectionHelper(User);

interface RegisterOptions {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: Role;
}

interface LoginOptions {
  email: string;
  password: string;
}

export interface LoggingStructure {
  user: UserDoc;
  token: {
    expires: Date;
    token: string;
  };
}

const authErrorHelper = new ErrorHelper("auth");

export default class AuthService extends BaseService {
  public static async login({
    email: enteredEmail,
    password,
  }: LoginOptions): Promise<LoggingStructure> {
    // Get the user and validate him
    const user = await UserHelper.findOne({ email: enteredEmail });
    const isValidPass =
      user && (await HashHelper.compare(password, user.password));
    if (!user?.password || !isValidPass)
      return authErrorHelper.unauthorized({
        message: `email or password is not correct`,
        path: "login",
      });
    // Get the token
    const id = user.id.toString();
    const token = await JwtService.create(id);
    const { firstName, lastName, email, role, createdAt, updatedAt } = user;
    return {
      token,
      user: { id, firstName, lastName, email, role, createdAt, updatedAt },
    };
  }

  public static async register(
    options: RegisterOptions
  ): Promise<LoggingStructure> {
    // Create the user
    const user = await UserService.create(options);
    if (!user) return authErrorHelper.notFound();
    const { id, firstName, lastName, email, role, createdAt, updatedAt } = user;
    const token = await JwtService.create(user.id);
    return {
      token,
      user: { id, firstName, lastName, email, role, createdAt, updatedAt },
    };
  }

  public static async me(userId: string): Promise<UserDoc> {
    const user = await UserService.getOne(userId);
    if (!user) return authErrorHelper.notFound();
    return user;
  }
}
