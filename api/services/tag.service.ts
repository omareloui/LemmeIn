import Tag, { TagSchema } from "../models/tag.model.ts";
import { ObjectId } from "../deps.ts";
import ErrorHelper from "../helpers/error.helper.ts";
import log from "../middlewares/logger.middleware.ts";

const tagErrorHelper = new ErrorHelper("tag");

export default class TagService {
  public static async createTag({ tag, user }: Omit<TagSchema, "_id">) {
    const tagDoc = await Tag.insertOne({ tag, user });
    if (!tagDoc) {
      log.error("Could not create tag");
      return tagErrorHelper.badRequest({ action: "create" });
    }
    return tagDoc;
  }

  public static getTags() {
    return Tag.find().toArray();
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
      { $set: { tag: options.tag } },
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
}
