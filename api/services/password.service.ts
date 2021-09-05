import { Password } from "../models/password.model.ts";
import { Tag } from "../models/tag.model.ts";
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
    const currentDate = new Date();
    const insertionData = {
      ...data,
      user: userId,
      lastUsed: null,
      createdAt: currentDate,
      updatedAt: currentDate,
    };
    if (!data.isOAuth) {
      const encryptHelper = new EncryptionHelper();
      insertionData.password = encryptHelper.encrypt(data.password);
    }
    const passwordId = await Password.insertOne(insertionData);
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
    // TODO: if the tag doesn't match /\./ populate the password
    // TODO: populate the tags
    return normalizeDocument(passwordDoc);
  }

  public static async decrypt(id: string, userId: string) {
    const passwordDoc = await PasswordService.getMyPassword(id, userId);
    if (passwordDoc.password.match(/\./)) {
      const encryptionHelper = new EncryptionHelper();
      const password = encryptionHelper.decrypt(passwordDoc.password);
      await Password.updateOne(
        { _id: new ObjectId(id), user: userId },
        { $set: { lastUsed: new Date() } }
      );
      return password;
    }
  }

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

  private static async populateTags(tags: string[]) {
    const tagsIds = tags.map((x) => new ObjectId(x));
    const tagsDocs = await Tag.find({ _id: { $in: tagsIds } });
    return tagsDocs;
  }
}
