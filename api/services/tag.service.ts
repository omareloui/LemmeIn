import { Tag } from "../models/tag.model.ts";
import { ObjectId } from "../deps.ts";
import ErrorHelper from "../helpers/error.helper.ts";
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
    if (!tagDoc) return tagErrorHelper.badRequest({ action: "create" });
    return tagDoc;
  }

  public static async getMyTags(userId: string) {
    const passwords = await Tag.find({ user: userId }).toArray();
    return normalizeDocuments(passwords);
  }

  public static async getMyTag(id: string, userId: string) {
    const tagDoc = await Tag.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!tagDoc) return tagErrorHelper.notFound();
    return normalizeDocuments(tagDoc);
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
    if (!tagDoc) return tagErrorHelper.notFound();
    if (tagDoc.tag === options.tag) return normalizeDocuments(tagDoc); // Skip if the tag is the same

    const duplicatedTag = await Tag.findOne({
      tag: new RegExp(`^${options.tag}$`, "i"),
      user: userId,
    });
    if (duplicatedTag)
      return tagErrorHelper.badRequest({
        message: "There's a tag with the same name. It can't be duplicated.",
      });

    const updateResult = await Tag.updateOne(
      { _id: new ObjectId(id), user: userId },
      { $set: { tag: options.tag } }
    );
    if (!updateResult) return tagErrorHelper.badRequest({ action: "update" });
    return updateResult;
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
