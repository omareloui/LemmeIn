import { Password } from "../models/password.model.ts";
import EncryptionHelper from "../helpers/encryption.helper.ts";
import { ObjectId } from "../deps.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import type { CreatePasswordOptions } from "../types/types.interface.ts";
import {
  normalizeDocument,
  normalizeDocuments,
} from "../utils/normalizeDocuments.ts";

const passwordErrorHelper = new ErrorHelper("password");

export default class PasswordService {
  public static async createPassword(
    data: CreatePasswordOptions,
    userId: string
  ) {
    const encryptHelper = new EncryptionHelper();
    const { encryption, iv } = encryptHelper.encrypt(data.password);
    const passwordId = await Password.insertOne({
      ...data,
      user: userId,
      password: encryption,
      iv,
    });
    if (!passwordId)
      return passwordErrorHelper.badRequest({ action: "create" });
    return passwordId;
  }

  public static async getMyPasswords(userId: string) {
    const passwords = await Password.find({ user: userId }).toArray();
    return normalizeDocuments(passwords);
  }

  public static async getMyPassword(id: string, userId: string) {
    const passwordDoc = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!passwordDoc) return passwordErrorHelper.notFound();
    return normalizeDocument(passwordDoc);
  }

  // public static async decrypt(id: string) {
  // }

  // public static async updatePassword(id: string, options: { password: string }) {
  //   const passwordDoc = await Password.findOne({ _id: new ObjectId(id) });
  //   if (!passwordDoc) {
  //     return passwordErrorHelper.notFound();
  //   }
  //   const updateResult = await Password.updateOne(
  //     { _id: new ObjectId(id) },
  //     { $set: { password: options.password } }
  //   );
  //   if (!updateResult) {
  //     return passwordErrorHelper.badRequest({ action: "update" });
  //   }
  //   return updateResult;
  // }

  public static async removeMyPassword(id: string, userId: string) {
    const password = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!password) return passwordErrorHelper.notFound();
    const deleteCount = await Password.deleteOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!deleteCount) {
      return passwordErrorHelper.badRequest({ action: "delete" });
    }
    return deleteCount;
  }

  // TODO:
  // getPasswordTags(passwordId: string) {}
}
