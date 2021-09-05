import db from "../db/db.ts";

export interface UserSchema {
  _id: string;
  username: string;
  email: string;
  isValidEmail: boolean;
  password: string;
  role: string;
  docVersion: number;
  isDisabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const User = db.getDatabase.collection<UserSchema>("users");
