import { RouterContext } from "../deps.ts";
import PasswordService from "../services/password.service.ts";

export default class PasswordController {
  public static async create({ request, response, state }: RouterContext) {
    const body = request.body();
    const data = await body.value;
    const userId = state.user.id;
    await PasswordService.createMine(data, userId);
    response.status = 200;
  }

  public static async viewAllMine({ response, state }: RouterContext) {
    response.body = await PasswordService.getAllMine(state.user.id);
  }

  public static async viewOneMine({ params, response, state }: RouterContext) {
    response.body = await PasswordService.getOneMine(params.id!, state.user.id);
  }

  public static async decrypt({ params, response, state }: RouterContext) {
    response.body = await PasswordService.decrypt(params.id!, state.user.id);
  }

  public static async deleteMine({ response, params, state }: RouterContext) {
    await PasswordService.removeOneMine(params.id!, state.user.id);
    response.status = 200;
  }
}
