import db from "../db/db.ts";

export interface PasswordSchema {
  _id: string;
  user: string;
  iv: string;
  password: string;
  title: string;
  emailOrUsername: string;
  site: string;
  note: string;
  icon: string;
  oAuthParty: string;
  tags: string[];
}

export default db.getDatabase.collection<PasswordSchema>("passwords");
