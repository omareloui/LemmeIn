import { yup } from "../../deps.ts";
import { MiddlewareTest } from "./middleware.test.helper.ts";
import { validate } from "../validate.middleware.ts";

import type { RouterContext } from "../../deps.ts";

const middlewareTest = new MiddlewareTest("validate");

const next = middlewareTest.mockNext();

interface ValidTests {
  description: string;
  context: RouterContext;
  schema: Record<string, unknown>;
}

interface ErrorTest extends ValidTests {
  errorIncludes: string;
}

const validTests: ValidTests[] = [
  {
    description:
      "should pass with providing the exact needed values to the body",
    schema: {
      body: yup.object({
        name: yup.string().min(1).max(255).trim().required(`name is required`),
      }),
    },
    context: middlewareTest.mockContext({ body: { name: "test" } }),
  },
  {
    description:
      "should pass with providing the exact needed values to the params",
    schema: {
      params: yup.object({
        name: yup.string().min(1).max(255).trim().required(`name is required`),
      }),
    },
    context: middlewareTest.mockContext({ params: { name: "test" } }),
  },
];

const errorTests: ErrorTest[] = [
  {
    description: "should throw error on providing data that was not requested",
    schema: {
      body: yup.object({
        name: yup.string().min(1).max(255).trim().required(`name is required`),
      }),
    },
    context: middlewareTest.mockContext({
      body: { name: "no", notNeeded: true },
    }),
    errorIncludes: "notNeeded is not allowed",
  },
  {
    description: "should throw error on not providing the needed data",
    schema: {
      body: yup.object({
        name: yup.string().min(1).max(255).trim().required(`name is required`),
      }),
    },
    context: middlewareTest.mockContext({ body: {} }),
    errorIncludes: "name is required",
  },
];

validTests.forEach(({ description, context, schema }) => {
  middlewareTest.test(description, async () => {
    await validate(schema)(context, next);
  });
});

errorTests.forEach(({ description, context, schema, errorIncludes }) => {
  middlewareTest.testAsyncError(
    description,
    async () => {
      await validate(schema)(context, next);
    },
    errorIncludes
  );
});
