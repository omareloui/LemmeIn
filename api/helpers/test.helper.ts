import { assertThrowsAsync } from "../deps.ts";

type TestFunction = () => void | Promise<void>;

export class Test {
  constructor(public namePrefix: string) {}

  public test(
    shouldTestWhat: string,
    testFunction: TestFunction,
    isOnly = false
  ) {
    Deno.test({
      name: `${this.namePrefix} ${shouldTestWhat}`,
      only: isOnly,
      fn: testFunction,
    });
  }

  public testAsyncError(
    name: string,
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

    this.test(name, assertionFunction);
  }
}