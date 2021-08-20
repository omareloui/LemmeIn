import db from "../config/db.ts";

import { Bson } from "../deps.ts";

export interface TagSchema {
  _id: Bson.ObjectId;
  user: Bson.ObjectId;
  tag: string;
}

export default db.collection<TagSchema>("tags");
