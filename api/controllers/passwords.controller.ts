import Password, { PasswordSchema } from "../models/Password.ts";

import ControllerHelper from "./lib/ControllerHelper.ts";

const PasswordControllerHelper = new ControllerHelper(Password);

class PasswordController {
  async create({ note, password, title }: Partial<PasswordSchema>) {
    const normalizedFields: Partial<PasswordSchema> = {};
    if (note) normalizedFields.note = note;
    if (password) normalizedFields.password = password; // TODO: encrypt the pass and stuff.
    if (title) normalizedFields.title = title;
    const insertId = await PasswordControllerHelper.add(normalizedFields);
    return { ok: !!insertId };
  }

  async viewAll() {
    return await PasswordControllerHelper.viewAll();
  }

  async viewById(id: string | undefined) {
    return await PasswordControllerHelper.viewById(id);
  }

  async update(id: string | undefined, { note, title, password }: Partial<PasswordSchema>) {
    const fieldsToUpdate: Partial<PasswordSchema> = {};
    if (note) fieldsToUpdate.note = note;
    if (password) fieldsToUpdate.password = password;
    if (title) fieldsToUpdate.title = title;
    const updateInfo = await PasswordControllerHelper.updateById(id, fieldsToUpdate);
    return { ok: updateInfo.modifiedCount > 0 };
  }

  async delete(id: string | undefined) {
    const deletionCount = await PasswordControllerHelper.deleteById(id);
    return { ok: deletionCount > 0 };
  }
}

export default PasswordController;
