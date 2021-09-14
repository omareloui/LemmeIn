import { Tag } from "../models/tag.model.ts";
import { ObjectId } from "../deps.ts";
import ErrorHelper from "../helpers/error.helper.ts";

import {
  normalizeDocument,
  normalizeDocuments,
} from "../utils/normalizeDocuments.ts";

import { BaseService } from "./base.service.ts";

const tagErrorHelper = new ErrorHelper("tag");

export interface CreateTagOptions {
  tag: string;
  color: string;
}

export default class TagService extends BaseService {
  public static async createMine(
    { tag, color }: CreateTagOptions,
    userId: string
  ) {
    const duplicatedTag = await Tag.findOne({
      tag: new RegExp(`^${tag}$`, "i"),
      user: userId,
    });
    if (duplicatedTag)
      return tagErrorHelper.badRequest({ message: "The tag already exists" });
    const currentDate = new Date();
    const tagDoc = await Tag.insertOne({
      tag,
      color,
      user: userId,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    if (!tagDoc) return tagErrorHelper.badRequest({ action: "create" });
    const newTag = await Tag.findOne({ _id: tagDoc });
    if (!newTag) return tagErrorHelper.notFound();
    return normalizeDocument(newTag);
  }

  public static async getOneMine(id: string, userId: string) {
    const password = await Tag.findOne({ _id: new ObjectId(id), user: userId });
    if (!password) return tagErrorHelper.notFound();
    return normalizeDocument(password);
  }

  public static async getAllMine(userId: string) {
    const passwords = await Tag.find({ user: userId }).toArray();
    return normalizeDocuments(passwords);
  }

  public static async getMyPasswordAllTags(tagsIds: string[], userId: string) {
    const ids = tagsIds.map((x) => new ObjectId(x));
    const tagsDocs = await Tag.find({ _id: { $in: ids }, user: userId });
    const tagsArray = await tagsDocs.toArray();
    const normalizedTags = tagsArray.map((x) => {
      x._id.toString();
      return normalizeDocument(x);
    });
    return normalizedTags;
  }

  public static async updateOneMine(
    id: string,
    options: Partial<CreateTagOptions>,
    userId: string
  ) {
    const tagDoc = await Tag.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!tagDoc) return tagErrorHelper.notFound();

    // If the tag's new make sure it's not duplicated
    if (tagDoc.tag !== options.tag) {
      const duplicatedTag = await Tag.findOne({
        tag: new RegExp(`^${options.tag}$`, "i"),
        user: userId,
      });
      if (duplicatedTag)
        return tagErrorHelper.badRequest({
          message: "You have a tag with the same name. You can't duplicate it.",
        });
    }
    const updateResult = await Tag.updateOne(
      { _id: new ObjectId(id), user: userId },
      {
        $set: { tag: options.tag, color: options.color, updatedAt: new Date() },
      }
    );
    if (!updateResult) return tagErrorHelper.badRequest({ action: "update" });
    const newTag = await TagService.getOneMine(id, userId);
    return newTag;
  }

  public static async removeOneMine(id: string, userId: string) {
    const tag = await Tag.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!tag) return tagErrorHelper.notFound();
    const deleteCount = await Tag.deleteOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!deleteCount) return tagErrorHelper.notFound();
    return deleteCount;
  }
}
