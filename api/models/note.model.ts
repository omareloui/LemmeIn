import db from "../db/db.ts";

export interface NoteSchema {
  _id: string;
  user: string;
  body: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VirtualNoteSchema extends Omit<NoteSchema, "_id"> {
  id: string;
}

export const Note = db.getDatabase.collection<NoteSchema>("notes");
