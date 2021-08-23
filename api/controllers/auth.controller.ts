import type { RouterContext } from "../deps.ts";
import AuthService from "../services/auth.service.ts";

class AuthController {
  public static async login({
    request,
    response,
  }: RouterContext): Promise<void> {
    const body = request.body();
    const { email, password } = await body.value;
    response.body = await AuthService.login({ email, password });
  }

  public static async register({ request, response }: RouterContext) {
    const body = request.body();
    const { email, username, password } = await body.value;
    const authData = await AuthService.register({ email, username, password });
    response.body = authData;
  }

  public static async me({ response, state }: RouterContext) {
    const user = await AuthService.me(state.user.id);
    response.body = user;
  }
}

export default AuthController;
