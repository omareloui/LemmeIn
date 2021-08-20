import db from "../config/db.ts";

import { Bson } from "../deps.ts";

export interface PasswordSchema {
  _id: { $oid: string };
  userId: Bson.ObjectId;
  password: string;
  title: string;
  emailOrUsername: string;
  site: string;
  note: string;
  icon: string;
  oAuthParty: Bson.ObjectId;
  tags: Bson.ObjectId[];
}

const passwords = db.collection<PasswordSchema>("passwords");

export default passwords;
