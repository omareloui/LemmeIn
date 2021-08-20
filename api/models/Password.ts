import db from "../config/db.ts";

import { Bson } from "../deps.ts";

export interface PasswordSchema {
  _id: Bson.ObjectId;
  user: Bson.ObjectId;
  iv: string;
  password: string;
  title: string;
  emailOrUsername: string;
  site: string;
  note: string;
  icon: string;
  oAuthParty: Bson.ObjectId;
  tags: Bson.ObjectId[];
}

export default db.collection<PasswordSchema>("passwords");
