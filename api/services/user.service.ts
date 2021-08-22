import { Document, ObjectId } from "../deps.ts";
import HashHelper from "../helpers/hash.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import log from "../middlewares/logger.middleware.ts";
import { User, UserSchema } from "../models/user.model.ts";
import { UserHistory } from "../models/user_history.model.ts";
import type {
  CreateUserStructure,
  UpdatedStructure,
  UpdateUserStructure,
  UserStructure,
} from "../types/types.interface.ts";

const userErrorHelper = new ErrorHelper("user");

class UserService {
  public static async createUser(options: CreateUserStructure): Promise<Document | Error> {
    const { name, email, password, role, isDisabled } = options;
    const hashedPassword = await HashHelper.hash(password);
    const createdAt = new Date();

    const user: Document = await User.insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      isDisabled,
      createdAt,
      docVersion: 1,
    });

    if (user) {
      await UserHistory.insertOne({
        id: user,
        name,
        email,
        password: hashedPassword,
        role,
        isDisabled,
        createdAt,
        docVersion: 1,
      });
    } else {
      log.error("Could not create user");
      return userErrorHelper.badRequest({ action: "create" });
    }
    return user;
  }

  public static getUsers(): Promise<UserSchema[]> {
    return User.find().toArray();
  }

  public static async getUser(id: string): Promise<UserStructure | Error> {
    const user: UserSchema | undefined = await User.findOne({
      _id: new ObjectId(id),
    });
    if (!user) {
      log.error("User not found");
      return userErrorHelper.notFound();
    }
    const { name, email, role, isDisabled, createdAt, updatedAt } = user;
    return { id, name, email, role, isDisabled, createdAt, updatedAt };
  }

  public static async updateUser(
    id: string,
    options: UpdateUserStructure
  ): Promise<UpdatedStructure | Error> {
    const user: UserSchema | undefined = await User.findOne({
      _id: new ObjectId(id),
    });
    if (!user) {
      log.error("User not found");
      return userErrorHelper.notFound();
    }
    const { docVersion } = user;
    const newDocVersion = docVersion + 1;
    const { isDisabled, name, role } = options;
    const updatedAt = new Date();
    const result: {
      // deno-lint-ignore no-explicit-any
      upsertedId: any;
      upsertedCount: number;
      matchedCount: number;
      modifiedCount: number;
    } = await User.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          role,
          isDisabled,
          updatedAt,
          docVersion: newDocVersion,
        },
      }
    );
    if (result) {
      await UserHistory.insertOne({
        id: new ObjectId(id),
        name,
        role,
        isDisabled,
        docVersion: newDocVersion,
      });
    } else return userErrorHelper.badRequest({ action: "update" });

    return result;
  }

  public static async removeUser(id: string): Promise<number | Error> {
    const user: UserSchema | undefined = await User.findOne({
      _id: new ObjectId(id),
    });
    if (!user) {
      log.error("User not found");
      return userErrorHelper.notFound();
    }
    const deleteCount: number = await User.deleteOne({ _id: new ObjectId(id) });
    if (deleteCount) {
      const { name, email, role, isDisabled, createdAt, docVersion } = user;
      const newDocVersion = docVersion + 1;
      const updatedAt = new Date();
      await UserHistory.insertOne({
        id: new ObjectId(id),
        name,
        email,
        role,
        isDisabled,
        createdAt,
        updatedAt,
        docVersion: newDocVersion,
      });
    } else return userErrorHelper.badRequest({ action: "create" });
    return deleteCount;
  }
}

export default UserService;
