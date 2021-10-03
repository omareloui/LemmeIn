import { Note, NoteSchema, VirtualNoteSchema } from "../models/note.model.ts";
import { CollectionHelper } from "../helpers/collection.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import compareArrays from "../utils/compareArrays.ts";

import type { NormalizedDoc } from "../utils/normalizeDocuments.ts";

import { BaseService } from "./base.service.ts";

const NoteHelper = new CollectionHelper(Note);
const noteErrorHelper = new ErrorHelper("note");

export interface CreateNoteOptions {
  body: string;
  tags: string[];
}

interface UpdateNoteOptions extends Partial<CreateNoteOptions> {
  updatedAt?: Date;
}

export default class NoteService extends BaseService {
  public static async createMine(
    { body, tags }: CreateNoteOptions,
    userId: string
  ) {
    const currentDate = new Date();
    const note = await NoteHelper.createOne({
      body,
      tags,
      user: userId,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    if (!note) return noteErrorHelper.notFound();
    return note;
  }

  public static async getOneMine(id: string, userId: string) {
    const note = await NoteHelper.findMineById(id, userId);
    if (!note) return noteErrorHelper.notFound();
    return note;
  }

  public static async getAllMine(userId: string) {
    const notes = await NoteHelper.findAllMine(userId);
    const sortedNotes = this.sort(notes);
    return sortedNotes;
  }

  public static async updateOneMine(
    id: string,
    { body, tags }: Omit<UpdateNoteOptions, "updatedAt">,
    userId: string
  ) {
    const noteDoc = await NoteHelper.findMineById(id, userId);
    if (!noteDoc) return noteErrorHelper.notFound();
    const fieldsToUpdate: UpdateNoteOptions = {};

    // Set the fields to update
    if (body && body !== noteDoc.body) fieldsToUpdate.body = body;
    if (tags && !compareArrays(tags, noteDoc.tags)) fieldsToUpdate.tags = tags;

    // See if should update or not
    const shouldUpdate = Object.keys(fieldsToUpdate).length > 0;
    if (!shouldUpdate) return noteDoc as VirtualNoteSchema;

    fieldsToUpdate.updatedAt = new Date();

    const newNote = await NoteHelper.updateMineById(id, fieldsToUpdate, userId);
    return newNote as VirtualNoteSchema;
  }

  public static async removeOneMine(id: string, userId: string) {
    const note = await NoteHelper.findMineById(id, userId);
    if (!note) return noteErrorHelper.notFound();
    await NoteHelper.deleteMineById(id, userId);
    return true;
  }

  private static sort(
    docs: VirtualNoteSchema[] | NormalizedDoc<NoteSchema>[]
  ): VirtualNoteSchema[] {
    return docs.sort(
      (a, b) => Number(b.createdAt) - Number(a.createdAt)
    ) as VirtualNoteSchema[];
  }
}
