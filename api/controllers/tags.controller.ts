import Tag, { TagSchema } from "../models/Tag.ts";

import ControllerHelper from "./lib/ControllerHelper.ts";

const TagControllerHelper = new ControllerHelper(Tag, {
  requiredFields: ["tag"],
});

class TagController {
  async create(data: Partial<TagSchema>) {
    const insertId = await TagControllerHelper.add(data);
    return { ok: !!insertId };
  }

  async viewAll() {
    return await TagControllerHelper.viewAll();
  }

  async viewById(id: string | undefined) {
    return await TagControllerHelper.viewById(id);
  }

  async update(id: string | undefined, { tag }: Partial<TagSchema>) {
    const tagToUpdate = await this.viewById(id);
    if (tagToUpdate.tag === tag) return { ok: true }; // Return with ok if the tag is the same
    const updateInfo = await TagControllerHelper.updateById(id, { tag });
    return { ok: updateInfo.modifiedCount > 0 };
  }

  async delete(id: string | undefined) {
    const deletionCount = await TagControllerHelper.deleteById(id);
    return { ok: deletionCount > 0 };
  }
}

export default TagController;
