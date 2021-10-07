import { Role } from "../config/index.ts";

import { HashHelper, ErrorHelper, CollectionHelper } from "../helpers/index.ts";

import { User } from "../models/index.ts";
import { BaseService, JwtService, UserService, UserDoc } from "./index.ts";

const UserHelper = new CollectionHelper(User);

interface RegisterOptions {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: Role;
}

interface UpdateMeOptions {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  oldPassword?: string;
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

export class AuthService extends BaseService {
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

  public static async updateMe(
    options: UpdateMeOptions,
    userId: string
  ): Promise<LoggingStructure> {
    // Create the user
    const user = await UserService.updateMe(options, userId);
    if (!user) return authErrorHelper.notFound();
    const { id, firstName, lastName, email, role, createdAt, updatedAt } = user;
    const token = await JwtService.create(user.id);
    return {
      token,
      user: { id, firstName, lastName, email, role, createdAt, updatedAt },
    };
  }
}
