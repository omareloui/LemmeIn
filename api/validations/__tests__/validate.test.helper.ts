import { Test } from "../../helpers/test.helper.ts";

import { RouterContext, testing, RouteParams } from "../../deps.ts";
import { validate } from "../../middlewares/validate.middleware.ts";

export interface ErrorValidationData {
  description: string;
  values: Record<string, unknown>;
  errorIncludes: string;
}

export type ValidData = {
  description: string;
  schema: Record<string, unknown>;
  body?: Record<string, unknown>;
  params?: RouteParams;
};

export class ValidationTest extends Test {
  constructor(modelName: string) {
    super(`validations/${modelName}:`);
  }

  public async validationMiddleware(
    schema: Record<string, unknown>,
    body?: Record<string, unknown>,
    params?: RouteParams
  ) {
    // @ts-ignore don't need to check for the value's type
    const mockContext = {
      ...testing.createMockContext({ path: "/validate", params: params }),
      request: { body: () => ({ value: body }) },
    } as RouterContext;
    const mockNext = testing.createMockNext();

    try {
      await validate(schema)(mockContext, mockNext);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  public validateCreateAndUpdateErrors(
    errorValidationData: ErrorValidationData[],
    createSchema: Record<string, unknown>,
    updateSchema: Record<string, unknown>
  ) {
    errorValidationData.forEach((data) =>
      [createSchema, updateSchema].forEach((schema, schemaIndex) => {
        const isCreating = schemaIndex === 0;
        this.testAsyncError(
          `(${isCreating ? "create" : "update"}) ${data.description}`,
          () =>
            this.validationMiddleware(
              schema,
              data.values,
              !isCreating ? { id: "123456789abcdef123456789" } : undefined
            ),
          data.errorIncludes
        );
      })
    );
  }

  public testWithValidationMiddleware(
    description: string,
    schema: Record<string, unknown>,
    body?: Record<string, unknown>,
    params?: RouteParams
  ) {
    this.test(description, async () => {
      await this.validationMiddleware(schema, body, params);
    });
  }

  public testWithValidationMiddlewareWithError() {}

  public testValidData(data: ValidData[]) {
    data.forEach((x) => {
      this.testWithValidationMiddleware(
        x.description,
        x.schema,
        x.body,
        x.params
      );
    });
  }
}
