import { assertThrows, assertThrowsAsync } from "../deps.ts";

type TestFunction = () => void | Promise<void>;

export class Test {
  constructor(public namePrefix: string) {}

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
}
