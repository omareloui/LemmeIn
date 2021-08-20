import { Collection, Bson } from "../../deps.ts";

import APIError from "../../lib/APIError.ts";

import checkIfMongoId from "../utils/checkIfMongoId.ts";

export default class ControllerHelper<Schema extends { _id: Bson.ObjectId }> {
  model: Collection<Schema>;
  requiredFields: (keyof Schema)[];
  privateFields: (keyof Schema)[];

  constructor(
    Model: Collection<Schema>,
    options?: { requiredFields?: (keyof Schema)[]; privateFields?: (keyof Schema)[] }
  ) {
    this.model = Model;

    const requiredFields = options?.requiredFields;
    this.requiredFields = requiredFields && requiredFields.length > 0 ? requiredFields : [];

    const privateFields = options?.privateFields;
    this.privateFields = privateFields && privateFields.length > 0 ? privateFields : [];
  }

  async add(data: Partial<Schema>) {
    if (Object.keys(data).length === 0) throw new APIError("Nothing to insert.", 400);
    this.validateRequiredFieldsArePresent(data);
    const insertId = await this.model.insertOne(data);
    return insertId;
  }

  async viewAll(): Promise<Schema[]> {
    const allCollection = await this.model.find({}).toArray();
    allCollection.forEach(this.removePrivateFields.bind(this));
    return allCollection.map((x) => ({ ...x, createdAt: this.getTimestamp(x) }));
  }

  async viewById(id: string | undefined) {
    if (!id) throw new APIError("No id provided.", 400);
    if (!checkIfMongoId(id)) throw new APIError("The provided id is invalid.", 400);
    const record = await this.model.findOne({ _id: new Bson.ObjectId(id) });
    if (!record) throw new APIError(`Can't find any ${this.model.name} with the provided id.`, 404);
    this.removePrivateFields(record);
    return { ...record, createdAt: this.getTimestamp(record) };
  }

  async updateById(id: string | undefined, data: Partial<Schema>) {
    if (!id) throw new APIError("No id provided", 400);
    if (!checkIfMongoId(id)) throw new APIError("The provided id is invalid.", 400);
    if (Object.keys(data).length === 0) throw new APIError("Nothing to update.", 400);
    const updatedInfo = await this.model.updateOne({ _id: new Bson.ObjectId(id) }, { $set: data });
    if (!updatedInfo) throw new APIError("Something went wrong, please try again later.", 500);
    if (updatedInfo.matchedCount === 0) throw new APIError("No match for the provided id.", 404);
    if (updatedInfo.modifiedCount === 0) throw new APIError("Nothing has been updated.", 304);
    return updatedInfo;
  }

  async deleteById(id: string | undefined) {
    if (!id) throw new APIError("No id provided.", 400);
    if (!checkIfMongoId(id)) throw new APIError("The provided id is invalid.", 400);
    const deletionCount = await this.model.deleteOne({ _id: new Bson.ObjectId(id) });
    if (deletionCount === 0) throw new APIError("No match for the provided id.", 404);
    return deletionCount;
  }

  getTimestamp(record: Schema) {
    return record._id.getTimestamp();
  }

  validateRequiredFieldsArePresent(dataToValidate: Partial<Schema>) {
    for (let i = 0; i < this.requiredFields.length; i++) {
      const field = this.requiredFields[i];
      if (!Object.hasOwn(dataToValidate, field))
        throw new APIError(`The field "${field}" is required.`, 400);
    }
  }

  removePrivateFields(record: Schema) {
    for (let i = 0; i < this.privateFields.length; i++) {
      const field = this.privateFields[i];
      delete record[field];
    }
  }
}
