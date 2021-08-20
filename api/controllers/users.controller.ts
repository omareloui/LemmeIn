import User from "../models/User.ts";

import ControllerHelper from "./lib/ControllerHelper.ts";

const UserControllerHelper = new ControllerHelper(User, {
  requiredFields: ["email", "password"],
});

export default class UserController {
  async viewAll() {
    return await UserControllerHelper.viewAll();
  }

  async viewById(id: string | undefined) {
    return await UserControllerHelper.viewById(id);
  }

  async delete(id: string | undefined) {
    const deletionCount = await UserControllerHelper.deleteById(id);
    return { ok: deletionCount > 0 };
  }
}
