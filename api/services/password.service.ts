import { ObjectId } from "../deps.ts";
import { mongoIdRegExp } from "../utils/mongoIdRegExp.ts";
import compareArrays from "../utils/compareArrays.ts";

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

type UpdatePasswordOptions = Partial<CreatePasswordOptions>;

type InsertionData = Partial<
  Omit<PasswordSchema, "_id"> & {
    isOAuth: boolean;
  }
>;

export default class PasswordService extends BaseService {
  public static async createMine(
    data: CreatePasswordOptions,
    userId: string
  ): Promise<VirtualPasswordSchema> {
    const currentDate = new Date();
    const insertionData: InsertionData = {
      ...data,
      user: userId,
      lastUsed: null,
      lastPasswordUpdate: currentDate,
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
    const passwordDoc = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!passwordDoc) return passwordErrorHelper.notFound();
    return this.normalizeDoc(passwordDoc, userId);
  }

  private static async getMyPasswordTags(
    tags: string[],
    userId: string
  ): Promise<VirtualTagSchema[]> {
    if (tags && tags.length > 0)
      return await TagService.getMyPasswordAllTags(tags, userId);
    return [];
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

  public static async updateOneMine(
    id: string,
    {
      app,
      password,
      accountIdentifier,
      isOAuth,
      note,
      site,
      tags,
    }: UpdatePasswordOptions,
    userId: string
  ) {
    const originalDoc = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!originalDoc) return passwordErrorHelper.notFound();

    const fieldsToUpdate: Partial<InsertionData> = {};
    const currentDate = new Date();

    // Check updating the password
    if (password) {
      // Set the original password
      const encryptionHelper = new EncryptionHelper();
      const isOriginalOAuth = this.checkIfPasswordOAuth(originalDoc.password);
      let originalPassword = originalDoc.password;
      // Decrypt the password if it's not oauth
      if (!isOriginalOAuth)
        originalPassword = encryptionHelper.decrypt(originalPassword);

      // Update if it's new password
      if (password !== originalPassword) {
        // Encrypt the password if it's not oauth
        if (password && !isOAuth) {
          const encryption = encryptionHelper.encrypt(password);
          fieldsToUpdate.password = encryption;
        } else if (password && isOAuth) {
          // Making sure it's a valid password id to update to
          if (!password.match(mongoIdRegExp))
            return passwordErrorHelper.badRequest({
              message: "Can't update the password with invalid password id",
            });
          // Make sure it's not the current password id
          if (password === id)
            return passwordErrorHelper.badRequest({
              message: "Can't update the password to the current password",
            });
          // Make sure it exists
          const passwordToUpdateTo = await Password.findOne({
            _id: new ObjectId(password),
            user: userId,
          });
          if (!passwordToUpdateTo)
            return passwordErrorHelper.badRequest({
              message: "Can't find the password you want to update to",
            });
          // Make sure it's not a password that points to the current password
          // nor one of it's references
          const optimizedPasswordToUpdateTo = await this.getOneMine(
            password,
            userId
          );
          let currPass: VirtualPasswordSchema | undefined =
            optimizedPasswordToUpdateTo.password;
          while (currPass) {
            if (currPass.id === id)
              return passwordErrorHelper.badRequest({
                message:
                  "Can't update the password to a password that points to the current one or one of it's references points to the current one",
              });
            currPass = currPass.password;
          }

          fieldsToUpdate.password = password;
        }
        // Update password's last update date
        if (Object.hasOwn(fieldsToUpdate, "password"))
          fieldsToUpdate.lastPasswordUpdate = currentDate;
      }
    }

    // Check updating other fields
    if (app && app.length >= 3 && app !== originalDoc.app)
      fieldsToUpdate.app = app;
    if (site !== undefined && site !== originalDoc.site)
      fieldsToUpdate.site = site;
    if (note !== undefined && note !== originalDoc.note)
      fieldsToUpdate.note = note;
    if (
      accountIdentifier !== undefined &&
      accountIdentifier !== originalDoc.accountIdentifier
    )
      fieldsToUpdate.accountIdentifier = accountIdentifier;
    if (tags !== undefined && !compareArrays(tags, originalDoc.tags))
      fieldsToUpdate.tags = tags;

    // Return without saving if nothing to change
    if (Object.keys(fieldsToUpdate).length === 0)
      return this.normalizeDoc(originalDoc, userId);

    fieldsToUpdate.updatedAt = currentDate;

    const updatingData = await Password.updateOne(
      { _id: new ObjectId(id), user: userId },
      { $set: fieldsToUpdate }
    );
    if (!updatingData)
      return passwordErrorHelper.badRequest({ action: "update" });

    const newPassword = await this.getOneMine(id, userId);
    return newPassword;
  }

  public static async removeOneMine(id: string, userId: string) {
    const password = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!password) return passwordErrorHelper.notFound();
    // Make sure the password to delete doesn't have any passwords that
    // point the the current one
    const passwordsThatPointToTheOneToDelete = await Password.find({
      password: id,
    }).toArray();
    if (passwordsThatPointToTheOneToDelete.length > 0)
      return passwordErrorHelper.badRequest({
        message:
          "You can't delete this password because it has password(s) that point to it",
      });

    const deleteCount = await Password.deleteOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!deleteCount) {
      return passwordErrorHelper.badRequest({ action: "delete" });
    }
    return deleteCount;
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
