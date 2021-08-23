import { Document, ObjectId } from "../deps.ts";
import HashHelper from "../helpers/hash.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import { User, UserSchema } from "../models/user.model.ts";
import { UserHistory } from "../models/user_history.model.ts";
import type {
  CreateUserStructure,
  UpdateUserStructure,
} from "../types/types.interface.ts";

const userErrorHelper = new ErrorHelper("user");

class UserService {
  public static async createUser(
    options: CreateUserStructure
  ): Promise<Document | Error> {
    const { username, email, password, role, isDisabled } = options;
    const hashedPassword = await HashHelper.hash(password);
    const createdAt = new Date();

    // Making sure the username and the email are unique
    const sameEmailUser = await User.findOne({ email, isDisabled: false });
    if (sameEmailUser)
      userErrorHelper.badRequest({
        message: `This email is already in use. Try signing in instead.`,
      });
    const sameUsernameUser = await User.findOne({
      username,
      isDisabled: false,
    });
    if (sameUsernameUser) {
      userErrorHelper.badRequest({
        message: `This username is already in use. Try another one.`,
      });
    }

    // Create the user
    const user: Document = await User.insertOne({
      username,
      email,
      password: hashedPassword,
      role,
      isDisabled,
      createdAt,
      docVersion: 1,
    });

    if (!user) return userErrorHelper.badRequest({ action: "create" });

    // Create the user history first entry
    await UserHistory.insertOne({
      id: user,
      username,
      email,
      password: hashedPassword,
      role,
      isDisabled,
      createdAt,
      docVersion: 1,
    });
    return user;
  }

  public static getUsers() {
    return User.find().toArray();
  }

  public static async getUser(id: string, getOnlyNonDisabled = true) {
    const query: { _id: ObjectId; isDisabled?: boolean } = {
      _id: new ObjectId(id),
    };
    if (getOnlyNonDisabled) query.isDisabled = false;
    const user: UserSchema | undefined = await User.findOne(query);
    if (!user) {
      return userErrorHelper.notFound();
    }
    const { username, email, role, isDisabled, createdAt, updatedAt } = user;
    return { id, username, email, role, isDisabled, createdAt, updatedAt };
  }

  public static async updateUser(id: string, options: UpdateUserStructure) {
    const user: UserSchema | undefined = await User.findOne({
      _id: new ObjectId(id),
    });
    if (!user) return userErrorHelper.notFound();
    const { docVersion } = user;
    const newDocVersion = docVersion + 1;
    const { isDisabled, username, role } = options;
    const updatedAt = new Date();
    const result = await User.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          username,
          role,
          isDisabled,
          updatedAt,
          docVersion: newDocVersion,
        },
      }
    );

    if (!result) return userErrorHelper.badRequest({ action: "update" });

    await UserHistory.insertOne({
      id: new ObjectId(id),
      username,
      role,
      isDisabled,
      docVersion: newDocVersion,
    });
    return result;
  }

  public static async removeUser(id: string): Promise<number | Error> {
    const user: UserSchema | undefined = await User.findOne({
      _id: new ObjectId(id),
    });
    if (!user) return userErrorHelper.notFound();
    const deleteCount: number = await User.deleteOne({ _id: new ObjectId(id) });
    if (!deleteCount) return userErrorHelper.badRequest({ action: "create" });

    const { username, email, role, isDisabled, createdAt, docVersion } = user;
    const newDocVersion = docVersion + 1;
    const updatedAt = new Date();
    await UserHistory.insertOne({
      id: new ObjectId(id),
      username,
      email,
      role,
      isDisabled,
      createdAt,
      updatedAt,
      docVersion: newDocVersion,
    });

    return deleteCount;
  }
}

export default UserService;
