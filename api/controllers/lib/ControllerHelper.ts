import { Collection, Bson } from "../../deps.ts";

import APIError from "../../lib/APIError.ts";

import checkIfMongoId from "../utils/checkIfMongoId.ts";

class ControllerHelper<Schema> {
  model: Collection<Schema>;

  constructor(Model: Collection<Schema>) {
    this.model = Model;
  }

  async add(data: Partial<Schema>) {
    if (Object.keys(data).length === 0) throw new APIError("Nothing to insert.", 400);
    const insertId = await this.model.insertOne(data);
    return insertId;
  }

  async viewAll() {
    return await this.model.find({}).toArray();
  }

  async viewById(id: string | undefined) {
    if (!id) throw new APIError("No id provided.", 400);
    if (!checkIfMongoId(id)) throw new APIError("The provided id is invalid.", 400);
    return await this.model.findOne({ _id: new Bson.ObjectId(id) });
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
}

export default ControllerHelper;
