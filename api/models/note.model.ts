import db from "../db/db.ts";
import { NormalizedDoc } from "../utils/normalizeDocuments.ts";
import { TagSchema } from "./tag.model.ts";

type Tag = NormalizedDoc<TagSchema>;

export interface NoteSchema {
  _id: string;
  user: string;
  title: string;
  body: string;
  tags: Tag[] | string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VirtualNoteSchema extends Omit<NoteSchema, "_id" | "tags"> {
  id: string;
  tags: Tag[];
}

export const Note = db.getDatabase.collection<NoteSchema>("notes");
