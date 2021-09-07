import { MiddlewareTest } from "./middleware.test.helper.ts";
import { auth } from "../auth.middleware.ts";

import type { RouterContext } from "../../deps.ts";
import type { Rights } from "../../config/roles.ts";

const middlewareTest = new MiddlewareTest("auth");

const userToken = await middlewareTest.getToken();
const adminToken = await middlewareTest.getToken("admin");

const notSignedContext = middlewareTest.mockContext();
const userContext = middlewareTest.mockContext({ authToken: userToken });
const adminContext = middlewareTest.mockContext({ authToken: adminToken });

const next = middlewareTest.mockNext();

interface ValidTests {
  description: string;
  context: RouterContext;
  right: Rights[number];
}

interface ErrorTest extends ValidTests {
  errorIncludes?: string;
}

const validTests: ValidTests[] = [
  {
    description: "should pass admin context on user right",
    context: adminContext,
    right: "getMe",
  },
  {
    description: "should pass admin context on admin right",
    context: adminContext,
    right: "manageUsers",
  },
  {
    description: "should pass user context on user right",
    context: userContext,
    right: "getMe",
  },
];

const errorTests: ErrorTest[] = [
  {
    description: "should throw error on user right with not signed context",
    context: notSignedContext,
    right: "getMe",
    errorIncludes: "Invalid token",
  },
  {
    description: "should throw error on admin right with user context",
    context: userContext,
    right: "getUsers",
  },
];

validTests.forEach(({ description, context, right }) => {
  middlewareTest.test(description, async () => {
    await auth(right)(context, next);
  });
});

errorTests.forEach(({ description, context, right, errorIncludes }) => {
  middlewareTest.testAsyncError(
    description,
    async () => {
      await auth(right)(context, next);
    },
    errorIncludes || "Insufficient rights"
  );
});
