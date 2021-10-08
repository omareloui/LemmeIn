import db from "../db/db.ts";
import { VirtualTagSchema } from "./tag.model.ts";

export interface AccountSchema {
  _id: string;
  user: string;
  password: string;
  app: string;
  accountIdentifier: string;
  site: string;
  note: string;
  tags: string[];
  lastUsed: Date | null;
  lastPasswordUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VirtualAccountSchema
  extends Omit<AccountSchema, "_id" | "password" | "tags"> {
  id: string;
  tags: VirtualTagSchema[];
  encryptedPassword?: string;
  password?: VirtualAccountSchema;
}

export interface DecryptedAccountSchema extends VirtualAccountSchema {
  decryptedPassword?: string;
}

export const Account = db.getDatabase.collection<AccountSchema>("accounts");
