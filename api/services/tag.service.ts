import { Tag, TagSchema, VirtualTagSchema } from "../models/tag.model.ts";
import { ObjectId } from "../deps.ts";
import { CollectionHelper } from "../helpers/collection.helper.ts";
import ErrorHelper from "../helpers/error.helper.ts";

import type { NormalizedDoc } from "../utils/normalizeDocuments.ts";
import createRegex from "../utils/createRegex.ts";

import { BaseService } from "./base.service.ts";
import AccountService from "./account.service.ts";

const TagHelper = new CollectionHelper(Tag);
const tagErrorHelper = new ErrorHelper("tag");

export interface CreateTagOptions {
  name: string;
  color: string;
}

export default class TagService extends BaseService {
  public static async createMine(
    { name, color }: CreateTagOptions,
    userId: string
  ) {
    const tagNameRegex = createRegex(name, { i: true, exactMatch: true });
    const duplicatedTag = await TagHelper.findOne({
      name: tagNameRegex,
      user: userId,
    });
    if (duplicatedTag)
      return tagErrorHelper.badRequest({ message: "The tag already exists" });
    const currentDate = new Date();
    const tag = await TagHelper.createOne({
      name,
      color,
      user: userId,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    if (!tag) return tagErrorHelper.notFound();
    return tag;
  }

  public static async getOneMine(id: string, userId: string) {
    const tag = await TagHelper.findMineById(id, userId);
    if (!tag) return tagErrorHelper.notFound();
    return tag;
  }

  public static async getAllMine(userId: string) {
    const tags = await TagHelper.findAllMine(userId);
    const normalizedTags: VirtualTagSchema[] = await Promise.all(
      tags.map((x) => this.populate(x, userId))
    );
    const sortedTags = this.sort(normalizedTags);
    return sortedTags;
  }

  public static populateTags(
    tagsIds: string[],
    userId: string
  ): Promise<NormalizedDoc<TagSchema>[]> {
    const ids = tagsIds.map((x) => new ObjectId(x));
    return TagHelper.find({ _id: { $in: ids }, user: userId });
  }

  public static async updateOneMine(
    id: string,
    options: Partial<CreateTagOptions>,
    userId: string
  ) {
    const tagDoc = await TagHelper.findMineById(id, userId);
    if (!tagDoc) return tagErrorHelper.notFound();

    // If the tag's new make sure it's not duplicated
    if (options.name && tagDoc.name !== options.name) {
      const tagRegex = createRegex(options.name, { i: true, exactMatch: true });
      const duplicatedTag = await TagHelper.findOne({
        name: tagRegex,
        user: userId,
      });
      if (duplicatedTag)
        return tagErrorHelper.badRequest({
          message: "You have a tag with the same name. You can't duplicate it.",
        });
    }
    const newTag = await TagHelper.updateMineById(
      id,
      { name: options.name, color: options.color, updatedAt: new Date() },
      userId
    );
    return newTag as NormalizedDoc<TagSchema>;
  }

  public static async removeOneMine(id: string, userId: string) {
    await AccountService.removeTagFromAccounts(id, userId);
    const tag = await TagHelper.findMineById(id, userId);
    if (!tag) return tagErrorHelper.notFound();
    await TagHelper.deleteMineById(id, userId);
    return true;
  }

  private static sort(docs: VirtualTagSchema[]): VirtualTagSchema[] {
    return docs.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }

  private static async populate(
    doc: NormalizedDoc<TagSchema>,
    userId: string
  ): Promise<VirtualTagSchema> {
    const tag = doc as VirtualTagSchema;
    const accounts = await AccountService.getMineWithTag(
      doc.id.toString(),
      userId
    );
    tag.accountsCount = accounts.length;
    return tag;
  }
}
