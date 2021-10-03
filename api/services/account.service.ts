import { ObjectId } from "../deps.ts";
import { mongoIdRegExp } from "../utils/mongoIdRegExp.ts";
import compareArrays from "../utils/compareArrays.ts";

import EncryptionHelper from "../helpers/encryption.helper.ts";
import { CollectionHelper } from "../helpers/collection.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import { BaseService } from "./base.service.ts";

import {
  Account,
  AccountSchema,
  VirtualAccountSchema,
} from "../models/account.model.ts";

import type { Document } from "../deps.ts";
import type { NormalizedDoc } from "../utils/normalizeDocuments.ts";
import type { TagSchema } from "../models/tag.model.ts";

import TagService from "./tag.service.ts";

const AccountHelper = new CollectionHelper(Account);
const accountErrorHelper = new ErrorHelper("account");

const ENCRYPTED_PASSWORD_REG_EXP = /[\da-z]\.[\da-z]/;

interface CreateAccountOptions {
  app: string;
  password: string;
  accountIdentifier?: string;
  note?: string;
  site?: string;
  tags?: string[];
  isOAuth?: boolean;
}

type UpdateAccountOptions = Partial<CreateAccountOptions>;

type InsertionData = Partial<
  Omit<AccountSchema, "_id"> & {
    isOAuth: boolean;
  }
>;

export default class AccountService extends BaseService {
  public static async createMine(
    data: CreateAccountOptions,
    userId: string
  ): Promise<VirtualAccountSchema> {
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
    const account = await AccountHelper.createOne(insertionData);
    if (!account) return accountErrorHelper.badRequest({ action: "create" });
    return this.populate(account, userId);
  }

  public static async getAllMine(
    userId: string
  ): Promise<VirtualAccountSchema[]> {
    const accounts = await AccountHelper.findAllMine(userId);
    return await this.populateAndSort(accounts, userId);
  }

  public static async getMineWithTag(
    tagId: string,
    userId: string
  ): Promise<VirtualAccountSchema[]> {
    const accounts = await AccountHelper.find({ user: userId, tags: tagId });
    return this.populateAndSort(accounts, userId);
  }

  public static async getOneMine(
    id: string,
    userId: string
  ): Promise<VirtualAccountSchema> {
    const account = await AccountHelper.findMineById(id, userId);
    if (!account) return accountErrorHelper.notFound();
    return this.populate(account, userId);
  }

  private static async getMyAccountTags(
    tags: string[],
    userId: string
  ): Promise<NormalizedDoc<TagSchema>[]> {
    if (tags && tags.length > 0)
      return await TagService.getMyAccountAllTags(tags, userId);
    return [];
  }

  public static async decrypt(id: string, userId: string) {
    const account = await AccountHelper.findOne({
      _id: new ObjectId(id),
      user: userId,
      password: ENCRYPTED_PASSWORD_REG_EXP,
    });
    if (!account) return accountErrorHelper.notFound();
    const encryptionHelper = new EncryptionHelper();
    const password = encryptionHelper.decrypt(account.password);
    return password;
  }

  public static async updateLastUsed(id: string, userId: string) {
    const account = await AccountHelper.findMineById(id, userId);
    if (!account) return accountErrorHelper.notFound();
    await AccountHelper.updateMineById(id, { lastUsed: new Date() }, userId);
    return true;
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
    }: UpdateAccountOptions,
    userId: string
  ) {
    const originalDoc = await AccountHelper.findMineById(id, userId);
    if (!originalDoc) return accountErrorHelper.notFound();

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
            return accountErrorHelper.badRequest({
              message: "Can't update the password with invalid password id",
            });
          // Make sure it's not the current password id
          if (password === id)
            return accountErrorHelper.badRequest({
              message: "Can't update the password to the current password",
            });
          // Make sure it exists
          const passwordToUpdateTo = await AccountHelper.findMineById(
            password,
            userId
          );
          if (!passwordToUpdateTo)
            return accountErrorHelper.badRequest({
              message: "Can't find the password you want to update to",
            });
          // Make sure it's not a password that points to the current password
          // nor one of it's references
          const optimizedPasswordToUpdateTo = await this.getOneMine(
            password,
            userId
          );
          let currPass: VirtualAccountSchema | undefined =
            optimizedPasswordToUpdateTo.password;
          while (currPass) {
            if (currPass.id.toString() === id)
              return accountErrorHelper.badRequest({
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
      return this.populate(originalDoc, userId);

    fieldsToUpdate.updatedAt = currentDate;

    const newAccount = await AccountHelper.updateMineById(
      id,
      fieldsToUpdate,
      userId
    );
    if (!newAccount) return accountErrorHelper.badRequest({ action: "update" });
    return newAccount;
  }

  public static async removeTagFromAccounts(tagId: string, userId: string) {
    const accounts = await AccountHelper.find({ user: userId, tags: tagId });
    for (const account of accounts) {
      if (!account.tags || account.tags.length === 0) continue;
      const newTags = account.tags.filter((tag) => tag !== tagId);
      await AccountHelper.updateMineById(account.id, { tags: newTags }, userId);
    }
    return true;
  }

  public static async removeOneMine(id: string, userId: string) {
    const account = await AccountHelper.findMineById(id, userId);
    if (!account) return accountErrorHelper.notFound();
    // Make sure the account to delete doesn't have any passwords that
    // point the the current one
    const accountThatPointToTheOneToDelete = await AccountHelper.find({
      password: id,
    });
    if (accountThatPointToTheOneToDelete.length > 0)
      return accountErrorHelper.badRequest({
        message:
          "You can't delete this account because it has password(s) that point to it",
      });

    await AccountHelper.deleteMineById(id, userId);
    return true;
  }

  private static async populate(
    doc: NormalizedDoc<AccountSchema>,
    userId: string
  ): Promise<VirtualAccountSchema> {
    const isOAuth = this.checkIfPasswordOAuth(doc.password);
    // @ts-ignore accept the password type as virtual password
    const result = { ...doc } as VirtualPasswordSchema;
    // Set password
    if (!isOAuth) {
      delete (result as { password?: string }).password;
    } else {
      result.password = await this.getOneMine(result.password, userId);
    }
    // Set tags
    result.tags = await this.getMyAccountTags(doc.tags, userId);
    return result;
  }

  private static async populateAndSort(
    docs: NormalizedDoc<AccountSchema>[],
    userId: string
  ): Promise<VirtualAccountSchema[]> {
    const populated = await Promise.all(
      docs.map((x) => this.populate(x, userId))
    );
    return this.sort(populated);
  }

  private static checkIfPasswordOAuth(password: string | Document) {
    return !!password.toString().match(mongoIdRegExp);
  }

  private static sort(docs: VirtualAccountSchema[]): VirtualAccountSchema[] {
    return docs.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }
}
