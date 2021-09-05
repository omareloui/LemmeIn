import db from "../db/db.ts";

export interface PasswordSchema {
  _id: string;
  user: string;
  password: string;
  app: string;
  accountIdentifier: string;
  site: string;
  note: string;
  tags: string[];
  lastUsed: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const Password = db.getDatabase.collection<PasswordSchema>("passwords");
