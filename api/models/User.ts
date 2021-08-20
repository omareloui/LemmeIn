import db from "../config/db.ts";

import { Bson } from "../deps.ts";

export interface UserSchema {
  _id: Bson.ObjectId;
  name: { first: string; last: string };
  password: string;
  email: string;
  username: string;
}

export default db.collection<UserSchema>("users");
