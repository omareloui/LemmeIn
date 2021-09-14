import { ObjectId } from "../deps.ts";
import HashHelper from "../helpers/hash.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import { User, UserSchema } from "../models/user.model.ts";
import { UserHistory } from "../models/user-history.model.ts";
import { normalizeDocument } from "../utils/normalizeDocuments.ts";
import type { Role } from "../config/roles.ts";
import { BaseService } from "./base.service.ts";

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
    const hashedPassword = await HashHelper.hash(password);
    const currentDate = new Date();

    // Making sure the email is unique
    const sameEmailUser = await User.findOne({ email });
    if (sameEmailUser)
      return userErrorHelper.badRequest({
        message: `This email is already in use. Try signing in instead.`,
      });

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
    const user = await User.insertOne(userData);
    if (!user) return userErrorHelper.badRequest({ action: "create" });
    const userId = user.toString();
    // Create the user history first entry
    await UserHistory.insertOne({
      id: userId,
      ...userData,
      isDisabled: false,
      version: 1,
    });
    const newUser = await User.findOne({ _id: user });
    if (!newUser) return userErrorHelper.notFound();
    return normalizeDocument(newUser);
  }

  public static async getAll(): Promise<UserDoc[]> {
    const users = await User.find().toArray();
    return users.map((x) => {
      const { _id, firstName, lastName, email, role, createdAt, updatedAt } = x;
      return {
        id: _id,
        firstName,
        lastName,
        email,
        role,
        createdAt,
        updatedAt,
      };
    });
  }

  public static async getOne(id: string): Promise<UserDoc> {
    const user: UserSchema | undefined = await User.findOne({
      _id: new ObjectId(id),
    });
    if (!user) {
      return userErrorHelper.notFound();
    }
    const { firstName, lastName, email, role, createdAt, updatedAt } = user;
    return { id, firstName, lastName, email, role, createdAt, updatedAt };
  }

  public static async updateOne(
    id: string,
    options: UpdateOptions
  ): Promise<UserDoc> {
    const user = await User.findOne({
      _id: new ObjectId(id),
    });
    if (!user) userErrorHelper.notFound();
    const newestUserHistory = await this.getNewestUserHistory(id);
    const newVersion = newestUserHistory.version + 1;

    const { firstName, lastName, email, password, role } = options;
    let hashedPassword;
    if (password) hashedPassword = await HashHelper.hash(password);
    const updatedAt = new Date();
    const result = await User.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          firstName,
          lastName,
          email,
          role,
          password: hashedPassword,
          updatedAt,
        },
      }
    );
    if (!result) return userErrorHelper.badRequest({ action: "update" });
    const newUser = await User.findOne({ _id: new ObjectId(id) });
    if (!newUser) return userErrorHelper.notFound();
    const normalizedUser = normalizeDocument(newUser);

    await UserHistory.insertOne({
      ...normalizedUser,
      id,
      isDisabled: false,
      version: newVersion,
    });
    return normalizedUser;
  }

  public static async removeOne(id: string) {
    // Get the user to delete
    const user = await User.findOne({ _id: new ObjectId(id) });
    if (!user) return userErrorHelper.notFound();
    // Delete the user
    const deleteCount: number = await User.deleteOne({ _id: new ObjectId(id) });
    if (!deleteCount) return userErrorHelper.badRequest({ action: "create" });
    // Set the user's history
    const newestUserHistory = await this.getNewestUserHistory(id);
    const newVersion = newestUserHistory.version + 1;
    const normalizedUser = normalizeDocument(user);
    await UserHistory.insertOne({
      ...normalizedUser,
      id,
      isDisabled: true,
      updatedAt: new Date(),
      version: newVersion,
    });

    return deleteCount;
  }

  public static async getUserHistory(userId: string) {
    const userHistory = await UserHistory.find({ id: userId }).toArray();
    if (userHistory.length === 0)
      return userErrorHelper.notFound({ message: "Can't find user history" });
    const sortedHistory = userHistory.sort((a, b) => a.version - b.version); // TODO: to test this
    return sortedHistory;
  }

  private static async getNewestUserHistory(userId: string) {
    const userHistory = await this.getUserHistory(userId);
    const newestUserHistory = userHistory.at(-1);
    if (!newestUserHistory) return userErrorHelper.notFound();
    return newestUserHistory;
  }
}
