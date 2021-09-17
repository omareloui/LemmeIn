import { ObjectId } from "../deps.ts";
import { mongoIdRegExp } from "../utils/mongoIdRegExp.ts";

import EncryptionHelper from "../helpers/encryption.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import { normalizeDocument } from "../utils/normalizeDocuments.ts";
import { BaseService } from "./base.service.ts";

import {
  Password,
  PasswordSchema,
  VirtualPasswordSchema,
} from "../models/password.model.ts";
import type { VirtualTagSchema } from "../models/tag.model.ts";
import TagService from "./tag.service.ts";

const passwordErrorHelper = new ErrorHelper("password");

const ENCRYPTED_PASSWORD_REG_EXP = /[\da-z]\.[\da-z]/;

interface CreatePasswordOptions {
  app: string;
  password: string;
  accountIdentifier?: string;
  note?: string;
  site?: string;
  tags?: string[];
  isOAuth?: boolean;
}

export default class PasswordService extends BaseService {
  public static async createMine(
    data: CreatePasswordOptions,
    userId: string
  ): Promise<VirtualPasswordSchema> {
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
    delete insertionData.isOAuth;
    const passwordId = await Password.insertOne(insertionData);
    if (!passwordId)
      return passwordErrorHelper.badRequest({ action: "create" });
    const newPassword = await Password.findOne({ _id: passwordId });
    if (!newPassword) return passwordErrorHelper.notFound();
    return this.normalizeDoc(newPassword, userId);
  }

  public static async getAllMine(
    userId: string
  ): Promise<VirtualPasswordSchema[]> {
    const passwords = await Password.find({ user: userId }).toArray();
    const normalizedDocs = await this.normalizeAndSortDocs(passwords, userId);
    return normalizedDocs;
  }

  public static async getMineWithTag(
    tagId: string,
    userId: string
  ): Promise<VirtualPasswordSchema[]> {
    const passwords = await Password.find({
      user: userId,
      tags: tagId,
    }).toArray();
    return this.normalizeAndSortDocs(passwords, userId);
  }

  public static async getOneMine(
    id: string,
    userId: string
  ): Promise<VirtualPasswordSchema> {
    const passwordDoc = (await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    })) as PasswordSchema;
    return this.normalizeDoc(passwordDoc, userId);
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
      password: { $regex: ENCRYPTED_PASSWORD_REG_EXP },
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

  private static async getMyPasswordTags(
    tags: string[],
    userId: string
  ): Promise<VirtualTagSchema[]> {
    if (tags && tags.length > 0)
      return await TagService.getMyPasswordAllTags(tags, userId);
    return [];
  }

  private static async normalizeDoc(
    doc: PasswordSchema,
    userId: string
  ): Promise<VirtualPasswordSchema> {
    const p = { ...normalizeDocument(doc), id: doc._id.toString() };
    const isOAuth = this.checkIfPasswordOAuth(p.password);
    // @ts-ignore accept the password type as virtual password
    const result = { ...p } as VirtualPasswordSchema;
    // Set password
    if (!isOAuth) {
      delete (result as { password?: string }).password;
    } else {
      result.password = await this.getOneMine(p.password, userId);
    }
    // Set tags
    result.tags = await this.getMyPasswordTags(doc.tags, userId);
    return result;
  }

  private static async normalizeAndSortDocs(
    docs: PasswordSchema[],
    userId: string
  ): Promise<VirtualPasswordSchema[]> {
    docs = docs.map((x) => {
      x._id = x._id.toString();
      return x;
    });
    const normalized = await Promise.all(
      docs.map((x) => this.normalizeDoc(x, userId))
    );
    return this.sort(normalized);
  }

  private static checkIfPasswordOAuth(password: string) {
    return !!password.toString().match(mongoIdRegExp);
  }

  private static sort(docs: VirtualPasswordSchema[]): VirtualPasswordSchema[] {
    return docs.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }
}
