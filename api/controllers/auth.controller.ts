import type { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import AuthService from "../services/auth.service.ts";

class AuthController {
  public static async login({
    request,
    response,
  }: RouterContext): Promise<void> {
    const body = request.body();
    const { email, password } = await body.value;
    log.debug("Trying Login user");
    response.body = await AuthService.login({ email, password });
  }

  public static async register({ request, response }: RouterContext) {
    const body = request.body();
    const { email, username, password } = await body.value;
    log.debug("Trying registering user");
    const authData = await AuthService.register({ email, username, password });
    response.body = authData;
  }
}

export default AuthController;
