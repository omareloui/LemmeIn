import { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import PasswordService from "../services/password.service.ts";
// import Password, { PasswordSchema } from "../models/password.model.ts";
// import ErrorHelper from "../helpers/error.helper.ts";
// import ControllerHelper from "../helpers/services.helper.ts";
// import EncryptionHandler from "../helpers/encryption.helper.ts";
import type { CreatePasswordOptions } from "../types/types.interface.ts";

// const passwordControllerErrorHandler = new ErrorHelper("password");

export default class PasswordController {
  public static async create({ request, response }: RouterContext) {
    const body = request.body();
    const data = (await body.value) as CreatePasswordOptions;
    log.debug("Creating password");
    await PasswordService.createPassword(data);
    response.status = 200;
  }

  public static async viewAll({ response }: RouterContext) {
    response.body = await PasswordService.getPasswords();
  }

  public static async viewOne({ params, response }: RouterContext) {
    response.body = await PasswordService.getPassword(params.id!);
  }

  // TODO:
  // public static async decrypt({params, response}: RouterContext) {
  //   response.body = await PasswordService.decryptPassword(params.id!);
  // }

  // TODO:
  // public static async update({ request, params, response }: RouterContext) {
  //   const body = request.body();
  //   const data = (await body.value) as CreatePasswordOptions;
  //   await TagService.updateTag(params.id!, data);
  //   response.status = 200;
  // }

  public static async delete({ response, params }: RouterContext) {
    await PasswordService.removePassword(params.id!);
    response.status = 200;
  }

  // public static async update(id: string | undefined, { note, title, password }: Partial<PasswordSchema>) {
  //   const fieldsToUpdate: Partial<PasswordSchema> = {};
  //   if (note) fieldsToUpdate.note = note;
  //   if (password) fieldsToUpdate.password = password;
  //   if (title) fieldsToUpdate.title = title;
  //   const updateInfo = await PasswordControllerHelper.updateById(id, fieldsToUpdate);
  //   return { ok: updateInfo.modifiedCount > 0 };
  // }

  // public static async delete(id: string | undefined) {
  //   const deletionCount = await PasswordControllerHelper.deleteById(id);
  //   return { ok: deletionCount > 0 };
  // }
}
