import type { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import TagService from "../services/tag.service.ts";

export default class TagController {
  public static async create({ request, response }: RouterContext) {
    const body = request.body();
    const { tag, user } = await body.value;
    log.debug("Creating tag");
    response.body = TagService.createTag({ tag, user });
  }

  public static async viewAll({ response }: RouterContext) {
    response.body = await TagService.getTags();
  }

  public static async viewOne({ response, params }: RouterContext) {
    response.body = await TagService.getTag(params.id!);
  }

  public static async update({ request, params, response }: RouterContext) {
    const body = request.body();
    const { tag } = await body.value;
    await TagService.updateTag(params.id!, { tag });
    response.status = 200;
  }

  public static async delete({ response, params }: RouterContext) {
    await TagService.removeTag(params.id!);
    response.status = 200;
  }
}
