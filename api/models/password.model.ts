import db from "../db/db.ts";
import { VirtualTagSchema } from "./tag.model.ts";

export interface PasswordSchema {
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

export interface VirtualPasswordSchema
  extends Omit<PasswordSchema, "_id" | "password" | "tags"> {
  id: string;
  tags: VirtualTagSchema[];
  password?: VirtualPasswordSchema;
}

export const Password = db.getDatabase.collection<PasswordSchema>("passwords");
