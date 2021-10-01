import HashHelper from "../helpers/hash.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import { User, UserSchema } from "../models/user.model.ts";
import { UserHistory } from "../models/user-history.model.ts";
import createRegex from "../utils/createRegex.ts";
import type { Role } from "../config/roles.ts";
import { BaseService } from "./base.service.ts";
import { CollectionHelper } from "../helpers/collection.helper.ts";

const UserHelper = new CollectionHelper(User);
const UserHistoryHelper = new CollectionHelper(UserHistory);

const userErrorHelper = new ErrorHelper("user");

interface CreateOptions {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role?: Role;
}

type UpdateOptions = Partial<CreateOptions>;

export interface UserDoc {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export default class UserService extends BaseService {
  public static async create(options: CreateOptions) {
    const { firstName, lastName, email, password, role } = options;

    // Making sure the email is unique
    const emailRegex = createRegex(email, { i: true, exactMatch: true });
    const sameEmailUser = await UserHelper.findOne({ email: emailRegex });
    if (sameEmailUser)
      return userErrorHelper.badRequest({
        message: "This email is already in use. Try signing in instead.",
      });

    const hashedPassword = await HashHelper.hash(password);
    const currentDate = new Date();

    const userData: Omit<UserSchema, "_id"> = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "user",
      isValidEmail: false,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    // Create the user
    const user = await UserHelper.createOne(userData);
    if (!user) return userErrorHelper.badRequest({ action: "create" });
    const userId = user.id.toString();
    // Create the user history first entry
    await UserHistoryHelper.createOne({
      id: userId,
      ...userData,
      isDisabled: false,
      version: 1,
    });
    return user as UserDoc;
  }

  public static getAll(): Promise<UserDoc[]> {
    return UserHelper.find() as Promise<UserDoc[]>;
  }

  public static async getOne(id: string): Promise<UserDoc> {
    const user = await UserHelper.findById(id);
    if (!user) return userErrorHelper.notFound();
    delete (user as { password?: string }).password;
    return user as UserDoc;
  }

  public static async updateOne(id: string, options: UpdateOptions) {
    const user = await UserHelper.findById(id);
    if (!user) userErrorHelper.notFound();
    const newestUserHistory = await this.getNewestUserHistory(id);
    const newVersion = newestUserHistory.version + 1;

    const { firstName, lastName, email, password, role } = options;
    let hashedPassword;
    if (password) hashedPassword = await HashHelper.hash(password);
    const updatedAt = new Date();
    const newUser = await UserHelper.updateById(id, {
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
      updatedAt,
    });
    if (!newUser) return userErrorHelper.notFound();

    await UserHistoryHelper.createOne({
      ...newUser,
      id,
      isDisabled: false,
      version: newVersion,
    });
    return newUser as UserDoc;
  }

  public static async removeOne(id: string) {
    // Get the user to delete
    const user = await UserHelper.findById(id);
    if (!user) return userErrorHelper.notFound();
    // Delete the user
    await UserHelper.deleteById(id);
    // Set the user's history
    const newestUserHistory = await this.getNewestUserHistory(id);
    const newVersion = newestUserHistory.version + 1;
    await UserHistoryHelper.createOne({
      ...user,
      id,
      isDisabled: true,
      updatedAt: new Date(),
      version: newVersion,
    });
    return true;
  }

  public static async getUserHistory(userId: string) {
    const userHistory = await UserHistoryHelper.find({ id: userId });
    if (userHistory.length === 0)
      return userErrorHelper.notFound({ message: "Can't find user history" });
    const sortedHistory = userHistory.sort((a, b) => a.version - b.version);
    return sortedHistory;
  }

  private static async getNewestUserHistory(userId: string) {
    const userHistory = await this.getUserHistory(userId);
    const newestUserHistory = userHistory.at(-1);
    if (!newestUserHistory) return userErrorHelper.notFound();
    return newestUserHistory;
  }
}
