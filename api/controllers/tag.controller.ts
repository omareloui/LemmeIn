import type { RouterContext } from "../deps.ts";
import TagService from "../services/tag.service.ts";

export default class TagController {
  public static async create({ request, response, state }: RouterContext) {
    const body = request.body();
    const { tag, color } = await body.value;
    response.body = await TagService.createMine({ tag, color }, state.user.id);
  }

  public static async viewAllMine({ response, state }: RouterContext) {
    response.body = await TagService.getAllMine(state.user.id);
  }

  public static async updateMine({
    request,
    params,
    response,
    state,
  }: RouterContext) {
    const body = request.body();
    const { tag, color } = await body.value;
    await TagService.updateOneMine(params.id!, { tag, color }, state.user.id);
    response.status = 200;
  }

  public static async deleteMine({ response, params, state }: RouterContext) {
    await TagService.removeOneMine(params.id!, state.user.id);
    response.status = 200;
  }
}
