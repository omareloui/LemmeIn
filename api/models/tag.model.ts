import db from "../db/db.ts";

export interface TagSchema {
  _id: string;
  user: string;
  tag: string;
}

export default db.getDatabase.collection<TagSchema>("tags");
