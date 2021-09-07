import { assertThrows, assertThrowsAsync } from "../deps.ts";
import type { Role } from "../config/roles.ts";

import AuthService from "../services/auth.service.ts";
import UserService from "../services/user.service.ts";

import generateRandomText from "../utils/generateRandomText.ts";

type TestFunction = () => void | Promise<void>;

export class Test {
  createdUsersId: string[];

  constructor(public namePrefix: string) {
    this.createdUsersId = [];
  }

  public test(description: string, testFunction: TestFunction, isOnly = false) {
    Deno.test({
      name: `${this.namePrefix} ${description}`,
      only: isOnly,
      fn: testFunction,
    });
  }

  public testAsyncError(
    description: string,
    cb: () => unknown,
    errorMessageIncludes: string
  ) {
    const promiseCallBack = async (
      res: (value: unknown) => void,
      rej: (value: unknown) => void
    ) => {
      try {
        res(await cb());
      } catch (e) {
        rej(new Error(e.message));
      }
    };

    const assertionCallBack = () => new Promise(promiseCallBack);
    const assertionFunction = () =>
      assertThrowsAsync(assertionCallBack, Error, errorMessageIncludes);

    this.test(description, assertionFunction);
  }

  public testError(
    description: string,
    cb: () => unknown,
    errorMessageIncludes: string
  ) {
    this.test(description, () => {
      assertThrows(
        () => {
          cb();
        },
        Error,
        errorMessageIncludes
      );
    });
  }

  public async getToken(role?: Role) {
    const logData = {
      email: `${generateRandomText()}@gmail.com`,
      password: "123456789",
    };
    const createdUser = await AuthService.register({
      firstName: generateRandomText(8),
      lastName: generateRandomText(8),
      role,
      ...logData,
    });
    this.createdUsersId.push(createdUser.user.id);
    const token = createdUser.token.token;
    return token;
  }

  public removeCratedUsers() {
    if (this.createdUsersId.length === 0)
      throw new Error("No user created to remove");
    this.createdUsersId.forEach(async (id) => {
      await UserService.removeOne(id);
    });
  }
}
