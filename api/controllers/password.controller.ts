import { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import PasswordService from "../services/password.service.ts";
import type { CreatePasswordOptions } from "../types/types.interface.ts";

export default class PasswordController {
  public static async create({ request, response, state }: RouterContext) {
    const body = request.body();
    const data = (await body.value) as CreatePasswordOptions;
    const userId = state.user.id;
    log.debug("Creating password");
    await PasswordService.createPassword({ ...data }, userId);
    response.status = 200;
  }

  public static async viewAllMine({ response, state }: RouterContext) {
    response.body = await PasswordService.getMyPasswords(state.user.id);
  }

  public static async viewAll({ response }: RouterContext) {
    response.body = await PasswordService.getPasswords();
  }

  public static async viewOneMine({ params, response, state }: RouterContext) {
    response.body = await PasswordService.getMyPassword(
      params.id!,
      state.user.id
    );
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

  public static async deleteMine({ response, params, state }: RouterContext) {
    await PasswordService.removeMyPassword(params.id!, state.user.id);
    response.status = 200;
  }

  public static async delete({ response, params }: RouterContext) {
    await PasswordService.removePassword(params.id!);
    response.status = 200;
  }
}