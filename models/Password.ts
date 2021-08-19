import db from "../config/db.ts";

export interface PasswordSchema {
  _id: { $oid: string };
  password: string;
  title: string;
  site: string;
  note: string;
  icon: string;
  oAuthParty: string; // make a lookup?
  tags: string[]; // make a lookup?
  // isOAuth: boolean; // make it a virtual
}

const passwords = db.collection<PasswordSchema>("passwords");

export default passwords;
