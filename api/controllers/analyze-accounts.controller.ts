import type { RouterContext } from "../deps.ts";
import AnalyzeAccountsService from "../services/analyze-accounts.service.ts";

export default class TagController {
  public static async analyzeMine({ response, state }: RouterContext) {
    response.body = await AnalyzeAccountsService.analyzeMine(state.user.id);
  }
}
