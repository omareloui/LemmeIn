import db from "../db/db.ts";
import type { Role } from "../config/roles.ts";

export interface UserSchema {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isValidEmail: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export const User = db.getDatabase.collection<UserSchema>("users");
