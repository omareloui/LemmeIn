import Password, { PasswordSchema } from "../models/Password.ts";

import ControllerHelper from "./lib/ControllerHelper.ts";
import EncryptionHandler from "./lib/EncryptionHandler.ts";
import APIError from "../lib/APIError.ts";

const PasswordControllerHelper = new ControllerHelper(Password, {
  requiredFields: ["title", "password", "iv"],
  privateFields: ["iv"],
});

export default class PasswordController {
  async create(data: Partial<PasswordSchema>) {
    if (!data.password) throw new APIError("No password provided.", 400);
    const normalizedFields: Partial<PasswordSchema> = { ...data };

    const encryptHandler = new EncryptionHandler();
    const { encryption, iv } = encryptHandler.encrypt(data.password);
    normalizedFields.iv = iv;
    normalizedFields.password = encryption;

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
