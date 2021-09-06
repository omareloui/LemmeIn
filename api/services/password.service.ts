import { ObjectId } from "../deps.ts";

import EncryptionHelper from "../helpers/encryption.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import { normalizeDocuments } from "../utils/normalizeDocuments.ts";
import { BaseService } from "./base.service.ts";

import { Password, PasswordSchema } from "../models/password.model.ts";
import { Tag, TagSchema } from "../models/tag.model.ts";

const passwordErrorHelper = new ErrorHelper("password");

const notOAuthPasswordRegEx = /\./;

interface CreatePasswordOptions {
  app: string;
  password: string;
  accountIdentifier?: string;
  note?: string;
  site?: string;
  tags?: string[];
  isOAuth?: boolean;
}

interface PopulatedPassword {
  id: string;
  app: string;
  accountIdentifier: string;
  password?: PasswordSchema;
  note?: string;
  site?: string;
  tags?: TagSchema[];
  lastUsed?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class PasswordService extends BaseService {
  public static async create(data: CreatePasswordOptions, userId: string) {
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
    return passwordId.toString();
  }

  public static async getAllMine(userId: string) {
    const passwords = await Password.find({ user: userId }).toArray();
    return normalizeDocuments(passwords);
  }

  public static async getOneMine(id: string, userId: string) {
    const passwordDoc = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!passwordDoc) return passwordErrorHelper.notFound();
    const result: PopulatedPassword = {
      id,
      app: passwordDoc.app,
      accountIdentifier: passwordDoc.accountIdentifier,
      note: passwordDoc.note,
      site: passwordDoc.site,
      lastUsed: passwordDoc.lastUsed,
      createdAt: passwordDoc.createdAt,
      updatedAt: passwordDoc.updatedAt,
    };
    // Populate password if it's oAuth
    if (!passwordDoc.password.match(notOAuthPasswordRegEx))
      result.password = await Password.findOne({
        _id: new ObjectId(passwordDoc.password),
        user: userId,
      });
    // Populate the tags
    if (passwordDoc.tags && passwordDoc.tags.length >= 1)
      result.tags = await this.populateTags(passwordDoc.tags);
    return result;
  }

  public static async removeOneMine(id: string, userId: string) {
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

  public static async decrypt(id: string, userId: string) {
    const passwordDoc = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
      password: { $regex: notOAuthPasswordRegEx },
    });
    if (!passwordDoc) return passwordErrorHelper.notFound();
    const encryptionHelper = new EncryptionHelper();
    const password = encryptionHelper.decrypt(passwordDoc.password);
    await Password.updateOne(
      { _id: new ObjectId(id), user: userId },
      { $set: { lastUsed: new Date() } }
    );
    return password;
  }

  // TODO: get it from tag service
  private static async populateTags(tags: string[]) {
    const tagsIds = tags.map((x) => new ObjectId(x));
    const tagsDocs = await Tag.find({ _id: { $in: tagsIds } });
    return tagsDocs.toArray();
  }
}
