import type { AccountSchema } from "../models/index.ts";
import type { Doc, Tag } from "./index.ts";

export interface Account extends Omit<Doc<AccountSchema>, "password" | "tags"> {
  tags: Tag[];
  password?: Account;
  encryptedPassword?: string;
  decryptedPassword?: string;
}

export interface CreateAccountOptions {
  app: string;
  password: string;
  accountIdentifier?: string;
  note?: string;
  site?: string;
  tags?: string[];
  isOAuth?: boolean;
}

export type UpdateAccountOptions = Partial<CreateAccountOptions>;

export type InsertionData = Partial<
  Omit<AccountSchema, "_id"> & {
    isOAuth: boolean;
  }
>;
