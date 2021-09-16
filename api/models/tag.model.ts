import db from "../db/db.ts";

export interface TagSchema {
  _id: string;
  user: string;
  tag: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VirtualTagSchema extends Omit<TagSchema, "_id"> {
  id: string;
  passwordsCount: number;
}

export const Tag = db.getDatabase.collection<TagSchema>("tags");
