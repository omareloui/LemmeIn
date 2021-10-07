import { Note, NoteSchema, VirtualNoteSchema } from "../models/note.model.ts";
import compareArrays from "../utils/compareArrays.ts";

import { CollectionHelper } from "../helpers/collection.helper.ts";
import EncryptionHelper from "../helpers/encryption.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";

import type { NormalizedDoc } from "../utils/normalizeDocuments.ts";
import TagService from "./tag.service.ts";

import { BaseService } from "./base.service.ts";

const NoteHelper = new CollectionHelper(Note);
const NoteEncryptionHelper = new EncryptionHelper();
const noteErrorHelper = new ErrorHelper("note");

export interface CreateNoteOptions {
  body?: string;
  title?: string;
  tags?: string[];
}

interface UpdateNoteOptions extends Partial<CreateNoteOptions> {
  updatedAt?: Date;
}

export default class NoteService extends BaseService {
  public static async createMine(
    { body, tags, title }: CreateNoteOptions,
    userId: string
  ): Promise<VirtualNoteSchema> {
    const currentDate = new Date();
    if (!title && !body)
      noteErrorHelper.badRequest({
        message: "The body and title can not both be empty",
      });

    const bodyAndTitle: { body?: string; title?: string } = {};
    if (body) bodyAndTitle.body = await NoteEncryptionHelper.encrypt(body);
    if (title) bodyAndTitle.title = await NoteEncryptionHelper.encrypt(title);

    const note = await NoteHelper.createOne({
      ...bodyAndTitle,
      tags: tags || [],
      user: userId,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    if (!note) return noteErrorHelper.notFound();
    await this.populateTags(note, userId);
    await this.decryptNote(note);
    return note as VirtualNoteSchema;
  }

  public static async getOneMine(
    id: string,
    userId: string
  ): Promise<VirtualNoteSchema> {
    const note = await NoteHelper.findMineById(id, userId);
    if (!note) return noteErrorHelper.notFound();
    await this.populateTags(note, userId);
    await this.decryptNote(note);
    return note as VirtualNoteSchema;
  }

  public static async getAllMine(userId: string): Promise<VirtualNoteSchema[]> {
    const notes = await NoteHelper.findAllMine(userId);
    const sortedNotes = this.sort(notes);
    await Promise.all(
      notes.map(async (x) => {
        await this.populateTags(x, userId);
        await this.decryptNote(x);
      })
    );
    return sortedNotes;
  }

  public static async updateOneMine(
    id: string,
    { body, tags, title }: Omit<UpdateNoteOptions, "updatedAt">,
    userId: string
  ): Promise<VirtualNoteSchema> {
    const noteDoc = await this.getOneMine(id, userId);
    if (!noteDoc) return noteErrorHelper.notFound();
    const fieldsToUpdate: UpdateNoteOptions = {};

    // Validate title and body fields
    // If provided body and title both are empty
    if (body === "" && title === "")
      noteErrorHelper.badRequest({
        message: "The body and title can not both be empty",
      });

    // If provided empty title and the original body is empty
    if (noteDoc.body === "" && title === "")
      noteErrorHelper.badRequest({
        message: "The body and title can not both be empty",
      });
    if (noteDoc.title === "" && body === "")
      noteErrorHelper.badRequest({
        message: "The body and title can not both be empty",
      });

    // Set the fields to update
    if (body !== undefined && body !== noteDoc.body)
      fieldsToUpdate.body =
        body === "" ? "" : await NoteEncryptionHelper.encrypt(body);
    if (title !== undefined && title !== noteDoc.title)
      fieldsToUpdate.title =
        title === "" ? "" : await NoteEncryptionHelper.encrypt(title);
    if (
      (tags && !noteDoc.tags) ||
      (tags &&
        noteDoc.tags &&
        !compareArrays(
          tags,
          noteDoc.tags.map((x) => x.id)
        ))
    )
      fieldsToUpdate.tags = tags;

    // See if should update or not
    const shouldUpdate = Object.keys(fieldsToUpdate).length > 0;
    if (!shouldUpdate) return noteDoc as VirtualNoteSchema;

    fieldsToUpdate.updatedAt = new Date();

    const newNote = await NoteHelper.updateMineById(id, fieldsToUpdate, userId);
    await this.populateTags(newNote!, userId);
    await this.decryptNote(newNote!);
    return newNote as VirtualNoteSchema;
  }

  public static async removeOneMine(
    id: string,
    userId: string
  ): Promise<boolean> {
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

  private static async decryptNote(
    doc: VirtualNoteSchema | NormalizedDoc<NoteSchema>
  ): Promise<void> {
    if (doc.body) doc.body = await NoteEncryptionHelper.decrypt(doc.body);
    if (doc.title) doc.title = await NoteEncryptionHelper.decrypt(doc.title);
  }

  private static async populateTags(
    doc: NoteSchema | NormalizedDoc<NoteSchema>,
    userId: string
  ): Promise<VirtualNoteSchema> {
    doc.tags = await TagService.populateTags(
      (doc.tags as string[]) || [],
      userId
    );
    return doc as VirtualNoteSchema;
  }
}
