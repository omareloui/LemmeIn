import { Tag } from "../models/tag.model.ts";
import { ObjectId } from "../deps.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import log from "../middlewares/logger.middleware.ts";
import normalizeDocuments from "../utils/normalizeDocuments.ts";

const tagErrorHelper = new ErrorHelper("tag");

export default class TagService {
  public static async createTag({ tag }: { tag: string }, userId: string) {
    const duplicatedTag = await Tag.findOne({
      tag: new RegExp(`^${tag}$`, "i"),
      user: userId,
    });
    if (duplicatedTag)
      return tagErrorHelper.badRequest({ message: "The tag already exists" });
    const tagDoc = await Tag.insertOne({ tag, user: userId });
    if (!tagDoc) {
      log.error("Could not create tag");
      return tagErrorHelper.badRequest({ action: "create" });
    }
    return tagDoc;
  }

  public static async getMyTags(userId: string) {
    const passwords = await Tag.find({ user: userId }).toArray();
    return normalizeDocuments(passwords);
  }

  public static getTags() {
    return Tag.find().toArray();
  }

  public static async getMyTag(id: string, userId: string) {
    const tagDoc = await Tag.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!tagDoc) {
      log.error("Tag not found");
      return tagErrorHelper.notFound();
    }
    return normalizeDocuments(tagDoc);
  }

  public static async getTag(id: string) {
    const tagDoc = await Tag.findOne({ _id: new ObjectId(id) });
    if (!tagDoc) {
      log.error("Tag not found");
      return tagErrorHelper.notFound();
    }
    const { tag, user } = tagDoc;
    return { id, tag, user };
  }

  public static async updateTag(id: string, options: { tag: string }) {
    const tagDoc = await Tag.findOne({ _id: new ObjectId(id) });
    if (!tagDoc) {
      log.error("Tag not found");
      return tagErrorHelper.notFound();
    }
    if (tagDoc.tag === options.tag) return tagDoc; // Skip if the tag is the same
    const updateResult = await Tag.updateOne(
      { _id: new ObjectId(id) },
      { $set: { tag: options.tag } }
    );
    if (!updateResult) return tagErrorHelper.badRequest({ action: "update" });
    return updateResult;
  }

  public static async updateMyTag(
    id: string,
    options: { tag: string },
    userId: string
  ) {
    const tagDoc = await Tag.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!tagDoc) {
      log.error("Tag not found");
      return tagErrorHelper.notFound();
    }
    if (tagDoc.tag === options.tag) return normalizeDocuments(tagDoc); // Skip if the tag is the same
    const updateResult = await Tag.updateOne(
      { _id: new ObjectId(id), user: userId },
      { $set: { tag: options.tag } }
    );
    if (!updateResult) return tagErrorHelper.badRequest({ action: "update" });
    return updateResult;
  }

  public static async removeTag(id: string) {
    const tag = await Tag.findOne({ _id: new ObjectId(id) });
    if (!tag) return tagErrorHelper.notFound();
    const deleteCount = await Tag.deleteOne({ _id: new ObjectId(id) });
    if (!deleteCount) return tagErrorHelper.notFound();
    return deleteCount;
  }

  public static async removeMyTag(id: string, userId: string) {
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
