import type { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import TagService from "../services/tag.service.ts";

export default class TagController {
  public static async create({ request, response, state }: RouterContext) {
    const body = request.body();
    const { tag } = await body.value;
    log.debug("Creating tag");
    response.body = TagService.createTag({ tag }, state.user.id);
  }

  public static async viewAllMine({ response, state }: RouterContext) {
    response.body = await TagService.getMyTags(state.user.id);
  }

  public static async viewAll({ response }: RouterContext) {
    response.body = await TagService.getTags();
  }

  public static async viewOneMine({ response, params, state }: RouterContext) {
    response.body = await TagService.getMyTag(params.id!, state.user.id);
  }

  public static async viewOne({ response, params }: RouterContext) {
    response.body = await TagService.getTag(params.id!);
  }

  public static async updateMine({
    request,
    params,
    response,
    state,
  }: RouterContext) {
    const body = request.body();
    const { tag } = await body.value;
    await TagService.updateMyTag(params.id!, { tag }, state.user.id);
    response.status = 200;
  }

  public static async update({ request, params, response }: RouterContext) {
    const body = request.body();
    const { tag } = await body.value;
    await TagService.updateTag(params.id!, { tag });
    response.status = 200;
  }

  public static async deleteMine({ response, params, state }: RouterContext) {
    await TagService.removeMyTag(params.id!, state.user.id);
    response.status = 200;
  }

  public static async delete({ response, params }: RouterContext) {
    await TagService.removeTag(params.id!);
    response.status = 200;
  }
}
