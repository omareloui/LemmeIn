import db from "../db/db.ts";

export interface NoteSchema {
  _id: string;
  user: string;
  note: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const Note = db.getDatabase.collection<NoteSchema>("notes");
