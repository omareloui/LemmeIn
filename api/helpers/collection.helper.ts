import { ObjectId } from "../deps.ts";
import type { Collection, FindOptions, Document } from "../deps.ts";
import {
  normalizeDocument,
  normalizeDocuments,
} from "../utils/normalizeDocuments.ts";

import config from "../config/config.ts";

const { env } = config;

type ID = Document | string;
type CollectionDocument = { _id: ID };
type CollectionFindOptions<T> = Partial<Record<keyof T, string | RegExp>>;
type CollectionUpdateOptions<T> = Partial<Omit<T, "_id">>;

export class CollectionHelper<T extends CollectionDocument> {
  private findOptions: FindOptions;

  constructor(public collection: Collection<T>) {
    this.findOptions = { noCursorTimeout: env === "production" ? false : true };
  }

  async find(options?: CollectionFindOptions<T>) {
    const docs = await this.collection
      .find(options, this.findOptions)
      .toArray();
    return normalizeDocuments(docs);
  }

  async findOne(options: CollectionFindOptions<T>) {
    const doc = await this.collection.findOne(options, this.findOptions);
    return normalizeDocument(doc);
  }

  findById(id: ID) {
    // @ts-ignore for some reason it casts an unnecessary error
    return this.findOne({ _id: new ObjectId(id) });
  }

  async createOne(data: Partial<T>) {
    const createdCollectionId = await this.collection.insertOne(data);
    return this.findById(createdCollectionId);
  }

  async updateById(id: ID, newOptions: CollectionUpdateOptions<T>) {
    await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: newOptions }
    );
    return this.findById(id);
  }

  async deleteById(id: ID) {
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}
