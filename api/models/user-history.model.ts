import db from "../db/db.ts";
import type { UserSchema } from "./user.model.ts";

export interface UserHistorySchema extends UserSchema {
  id: string;
  isDisabled: boolean;
  version: number;
}

export const UserHistory = db.getDatabase.collection<UserHistorySchema>(
  "users_history"
);
